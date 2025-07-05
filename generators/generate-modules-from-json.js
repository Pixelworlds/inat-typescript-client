#!/usr/bin/env bun

import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'fs';
import { join, resolve } from 'path';

class JSONToTypeScriptGenerator {
  constructor() {
    this.projectRoot = resolve(process.cwd());
    this.dataFile = join(this.projectRoot, 'data', 'inat-api-endpoints.json');
    this.outputDir = join(this.projectRoot, 'typescript');
  }

  loadEndpoints() {
    if (!existsSync(this.dataFile)) {
      throw new Error(`Endpoints data file not found: ${this.dataFile}`);
    }

    const data = readFileSync(this.dataFile, 'utf8');
    const json = JSON.parse(data);
    return json.endpoints;
  }

  groupEndpointsByModule(endpoints) {
    const modules = new Map();

    for (const endpoint of endpoints) {
      const section = endpoint.endpoint.section || 'Unknown';
      let moduleName;

      // Map sections to module names
      if (section === 'Authentication') {
        moduleName = 'authentication';
      } else if (section === 'Identifications') {
        moduleName = 'identifications';  
      } else if (section === 'Controlled Terms') {
        moduleName = 'controlled-terms';
      } else if (section === 'Annotations') {
        moduleName = 'annotations';
      } else if (section === 'Flags') {
        moduleName = 'flags';
      } else if (section === 'Taxa') {
        moduleName = 'taxa';
      } else if (section === 'Search') {
        moduleName = 'search';
      } else {
        // Extract module name from URL
        const url = endpoint.endpoint.url;
        const firstSegment = url.split('/')[1];
        
        if (firstSegment === 'comments') {
          moduleName = 'comments';
        } else if (firstSegment === 'observations') {
          moduleName = 'observations';
        } else if (firstSegment === 'observation_field_values') {
          moduleName = 'observation-field-values';
        } else if (firstSegment === 'observation_fields') {
          moduleName = 'observation-fields';
        } else if (firstSegment === 'observation_photos') {
          moduleName = 'observation-photos';
        } else if (firstSegment === 'projects') {
          moduleName = 'projects';
        } else if (firstSegment === 'project_observations') {
          moduleName = 'project-observations';
        } else if (firstSegment === 'places') {
          moduleName = 'places';
        } else if (firstSegment === 'users') {
          moduleName = 'users';
        } else if (firstSegment === 'oauth') {
          moduleName = 'authentication';
        } else {
          moduleName = firstSegment || 'misc';
        }
      }

      if (!modules.has(moduleName)) {
        modules.set(moduleName, []);
      }

      modules.get(moduleName).push({
        name: this.generateMethodName(endpoint.endpoint.url, endpoint.endpoint.method),
        method: endpoint.endpoint.method,
        url: endpoint.endpoint.url,
        description: endpoint.endpoint.description,
        requiresAuth: endpoint.authentication?.required || false,
        hasBody: ['POST', 'PUT', 'PATCH'].includes(endpoint.endpoint.method),
        pathParams: this.extractPathParams(endpoint.endpoint.url)
      });
    }

    return modules;
  }

  generateMethodName(url, method) {
    const cleanUrl = url
      .replace(/^\//, '')
      .replace(/\/:/g, '_')
      .replace(/\//g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '')
      .toLowerCase();
    
    return `${method.toLowerCase()}_${cleanUrl}`;
  }

  extractPathParams(url) {
    const matches = url.match(/:([a-zA-Z_][a-zA-Z0-9_]*)/g);
    return matches ? matches.map(match => ({
      name: match.slice(1),
      type: 'string | number'
    })) : [];
  }

  getClassName(moduleName) {
    return moduleName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  generateModule(moduleName, endpoints) {
    const className = this.getClassName(moduleName);
    const methods = endpoints.map(endpoint => this.generateMethod(endpoint)).join('\n\n');

    const interfaces = this.generateInterfaces(endpoints);
    const interfacesSection = interfaces.length > 0 ? interfaces.join('\n\n') + '\n\n' : '';

    return `import type { AxiosInstance, AxiosResponse } from 'axios';

${interfacesSection}export class ${className} {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

${methods}
}
`;
  }

  generateInterfaces(endpoints) {
    const interfaces = [];
    
    endpoints.forEach(endpoint => {
      // For now, we'll keep interfaces simple since the JSON doesn't have detailed parameter info
      // This can be enhanced later with actual parameter definitions
    });

    return interfaces;
  }

  generateMethod(endpoint) {
    const methodName = endpoint.name;
    const pathParams = endpoint.pathParams.map(p => `${p.name}: ${p.type}`);
    const hasBody = endpoint.hasBody;
    
    let parameters = [...pathParams];
    if (hasBody) {
      parameters.push('data?: any');
    }

    const paramString = parameters.join(', ');
    const url = this.buildUrlTemplate(endpoint.url, endpoint.pathParams);
    
    let configObject = '{}';
    if (hasBody) {
      configObject = '{ data }';
    }

    let comment = '';
    if (endpoint.description && endpoint.description !== 'Auth required') {
      comment = `  /**\n   * ${endpoint.description}\n   */\n`;
    }

    return `${comment}  async ${methodName}(${paramString}): Promise<AxiosResponse<any>> {
    return this.client.${endpoint.method.toLowerCase()}(\`${url}\`, ${configObject});
  }`;
  }

  buildUrlTemplate(url, pathParams) {
    let template = url;
    pathParams.forEach(param => {
      template = template.replace(`:${param.name}`, `\${${param.name}}`);
    });
    return template;
  }

  cleanOutputDirectory() {
    if (existsSync(this.outputDir)) {
      rmSync(this.outputDir, { recursive: true });
    }
    mkdirSync(this.outputDir, { recursive: true });
  }

  async generate() {
    console.log('Loading endpoints from JSON data...');
    const endpoints = this.loadEndpoints();
    console.log(`Loaded ${endpoints.length} endpoints`);

    console.log('Grouping endpoints by module...');
    const modules = this.groupEndpointsByModule(endpoints);
    console.log(`Created ${modules.size} modules`);

    console.log('Cleaning output directory...');
    this.cleanOutputDirectory();

    console.log('Generating TypeScript modules...');
    for (const [moduleName, moduleEndpoints] of modules) {
      const moduleContent = this.generateModule(moduleName, moduleEndpoints);
      const filePath = join(this.outputDir, `${moduleName}.ts`);
      writeFileSync(filePath, moduleContent);
      console.log(`Generated ${moduleName}.ts with ${moduleEndpoints.length} endpoints`);
    }

    console.log('\nTypeScript modules generated successfully!');
    console.log(`Output directory: ${this.outputDir}`);
    console.log(`Generated ${modules.size} modules from ${endpoints.length} endpoints`);
  }
}

const generator = new JSONToTypeScriptGenerator();
await generator.generate();