#!/usr/bin/env bun

import { writeFileSync } from 'fs';
import { join } from 'path';

class SwaggerSpecParser {
  constructor() {
    this.config = {
      outputFile: join(process.cwd(), 'data', 'inat-api-endpoints.json'),
      specs: {
        main: 'https://www.inaturalist.org/swagger/v1/swagger.json',
        observations: 'https://api.inaturalist.org/v1/docs/#!/Observations',
        identifications: 'https://api.inaturalist.org/v1/docs/#!/Identifications',
        projects: 'https://api.inaturalist.org/v1/docs/#!/Projects',
        ranks: 'https://api.inaturalist.org/v1/docs/#!/Ranks'
      }
    };

    this.specFetcher = new SpecFetcher();
    this.templateProcessor = new TemplateProcessor();
    this.endpointExtractor = new EndpointExtractor();
    this.fileManager = new FileManager(this.config.outputFile);
  }

  async parseAllSpecs() {
    console.log('Starting to parse all Swagger specifications...');
    
    const specs = await this.specFetcher.fetchAllSpecs(this.config.specs);
    const { allEndpoints, sourceFiles } = this._processSpecs(specs);
    
    const result = this._createResult(allEndpoints, sourceFiles);
    this.fileManager.saveResult(result);
    
    this._logResults(result);
    return result;
  }

  _processSpecs(specs) {
    const allEndpoints = [];
    const sourceFiles = [];
    
    for (const [specName, specContent] of Object.entries(specs)) {
      console.log(`Processing ${specName} specification...`);
      
      try {
        const parsedSpec = this._parseSpecContent(specContent, specName);
        
        if (parsedSpec?.paths) {
          const endpoints = this.endpointExtractor.extractEndpoints(parsedSpec, specName);
          allEndpoints.push(...endpoints);
          sourceFiles.push(specName);
          console.log(`Extracted ${endpoints.length} endpoints from ${specName}`);
        } else {
          console.log(`No valid OpenAPI paths found in ${specName}`);
        }
        
      } catch (error) {
        console.error(`Error parsing ${specName}:`, error.message);
      }
    }
    
    return { allEndpoints, sourceFiles };
  }

  _parseSpecContent(specContent, specName) {
    if (typeof specContent === 'string') {
      if (specContent.trim().startsWith('{')) {
        return JSON.parse(specContent);
      } else {
        console.log(`${specName} appears to be HTML/text, skipping...`);
        return null;
      }
    }
    
    return specContent;
  }

  _createResult(allEndpoints, sourceFiles) {
    return {
      meta: {
        source: 'iNaturalist API Swagger Specifications',
        extractedAt: new Date().toISOString(),
        totalEndpoints: allEndpoints.length,
        sourceFiles
      },
      endpoints: allEndpoints
    };
  }

  _logResults(result) {
    console.log(`Successfully parsed and cached ${result.meta.totalEndpoints} endpoints to ${this.config.outputFile}`);
    console.log(`Source files: ${result.meta.sourceFiles.join(', ')}`);
  }
}

class SpecFetcher {
  async fetchAllSpecs(specUrls) {
    const specs = {};
    
    console.log('Fetching Swagger specifications...');
    
    for (const [name, url] of Object.entries(specUrls)) {
      try {
        const spec = await this._fetchSingleSpec(name, url);
        if (spec !== null) {
          specs[name] = spec;
        }
      } catch (error) {
        console.error(`Error fetching ${name}:`, error.message);
      }
    }
    
    return specs;
  }

  async _fetchSingleSpec(name, url) {
    console.log(`Fetching ${name} from ${url}...`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`Failed to fetch ${name}: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const spec = await this._parseResponse(response);
    console.log(`Successfully fetched ${name}`);
    
    return spec;
  }

  async _parseResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  }
}

class TemplateProcessor {
  constructor() {
    this.includeMapping = {
      '_observation_search_params_v1.yml.ejs': 'observations',
      '_identification_search_params_v1.yml.ejs': 'identifications', 
      '_project_search_params_v1.yml.ejs': 'projects',
      '_ranks.yml.ejs': 'ranks'
    };
  }

  processEJSTemplate(content, context = {}, allSpecs = {}) {
    const defaultContext = {
      type: 'index',
      ...context
    };
    
    try {
      let processedContent = this._processIncludes(content, allSpecs);
      processedContent = this._processVariables(processedContent, defaultContext);
      
      return processedContent;
    } catch (error) {
      console.error('Error processing EJS template:', error);
      return content;
    }
  }

  _processIncludes(content, allSpecs) {
    const includePattern = /<%[-=]\s*include\s*\(\s*["']([^"']+)["']\s*(?:,\s*({[^}]*}))?\s*\)\s*%>/g;
    
    return content.replace(includePattern, (match, filename) => {
      const specName = this.includeMapping[filename];
      
      if (specName && allSpecs[specName]) {
        return allSpecs[specName];
      }
      
      return '';
    });
  }

  _processVariables(content, defaultContext) {
    const variablePattern = /<%[-=]\s*([^%]+)\s*%>/g;
    
    return content.replace(variablePattern, (match, expression) => {
      try {
        const cleanExpression = expression.trim();
        
        if (cleanExpression.includes('type')) {
          return defaultContext.type || 'index';
        }
        
        return '';
      } catch (e) {
        console.warn(`Error processing template expression: ${expression}`, e);
        return '';
      }
    });
  }
}

class EndpointExtractor {
  constructor() {
    this.supportedMethods = ['get', 'post', 'put', 'patch', 'delete'];
  }

  extractEndpoints(spec, specName = 'unknown') {
    const endpoints = [];
    
    if (!spec?.paths) {
      console.warn(`No paths found in ${specName} spec`);
      return endpoints;
    }
    
    for (const [path, pathItem] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        if (this._isValidMethod(method)) {
          const endpoint = this._createEndpoint(path, method, operation);
          endpoints.push(endpoint);
        }
      }
    }
    
    return endpoints;
  }

  _isValidMethod(method) {
    return this.supportedMethods.includes(method.toLowerCase());
  }

  _createEndpoint(path, method, operation) {
    const endpoint = {
      url: path,
      method: method.toUpperCase(),
      summary: operation.summary || '',
      description: operation.description || '',
      tags: operation.tags || [],
      section: operation.tags?.[0] || 'Other',
      parameters: this._extractParameters(operation.parameters),
      requiresAuth: this._hasAuthentication(operation)
    };

    if (endpoint.requiresAuth) {
      endpoint.authentication = { type: 'required' };
    }

    if (operation.requestBody) {
      endpoint.request = { payload: {} };
    }

    return endpoint;
  }

  _extractParameters(parameters) {
    if (!parameters) return [];

    return parameters.map(param => ({
      name: param.name,
      in: param.in,
      required: param.required || false,
      type: param.type || param.schema?.type || 'string',
      description: param.description || ''
    }));
  }

  _hasAuthentication(operation) {
    return operation.security && operation.security.length > 0;
  }
}

class FileManager {
  constructor(outputFile) {
    this.outputFile = outputFile;
  }

  saveResult(result) {
    try {
      writeFileSync(this.outputFile, JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(`Failed to write to ${this.outputFile}:`, error.message);
      throw error;
    }
  }
}

export async function parseAllSpecs() {
  const parser = new SwaggerSpecParser();
  return await parser.parseAllSpecs();
}

if (import.meta.main) {
  await parseAllSpecs();
}