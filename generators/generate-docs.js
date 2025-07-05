#!/usr/bin/env bun

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

class DocumentationGenerator {
  constructor() {
    this.config = {
      inputFile: join(process.cwd(), 'data', 'swagger.json'),
      authInputFile: join(process.cwd(), 'data', 'swagger-auth.json'),
      outputDir: join(process.cwd(), 'docs'),
    };

    this.swaggerLoader = new SwaggerLoader(this.config);
    this.docBuilder = new DocumentationBuilder();
    this.fileManager = new FileManager(this.config.outputDir);
  }

  async generate() {
    console.log('Loading Swagger specification...');
    const swagger = await this.swaggerLoader.loadSwagger();
    
    console.log('Extracting API information...');
    const apiInfo = this.swaggerLoader.extractApiInfo(swagger);
    console.log(`Found ${apiInfo.categories.length} categories with ${apiInfo.totalEndpoints} endpoints`);

    console.log('Generating documentation...');
    this.fileManager.ensureOutputDirectory();
    
    const documentation = this.docBuilder.buildDocumentation(apiInfo);
    this.fileManager.writeDocumentation(documentation);

    console.log('API documentation generated successfully!');
    console.log(`Output: ${join(this.config.outputDir, 'API.md')}`);
  }
}

class SwaggerLoader {
  constructor(config) {
    this.config = config;
  }

  async loadSwagger() {
    if (!existsSync(this.config.inputFile)) {
      throw new Error(`Swagger file not found: ${this.config.inputFile}`);
    }

    const data = readFileSync(this.config.inputFile, 'utf8');
    const swagger = JSON.parse(data);
    
    // Also load swagger-auth.json if it exists and merge
    if (existsSync(this.config.authInputFile)) {
      const authData = readFileSync(this.config.authInputFile, 'utf8');
      const swaggerAuth = JSON.parse(authData);
      
      // Merge paths
      swagger.paths = {
        ...swagger.paths,
        ...swaggerAuth.paths
      };
      
      // Merge tags
      swagger.tags = swagger.tags || [];
      if (swaggerAuth.tags) {
        swaggerAuth.tags.forEach(tag => {
          if (!swagger.tags.find(t => t.name === tag.name)) {
            swagger.tags.push(tag);
          }
        });
      }
      
      console.log(`Merged ${Object.keys(swaggerAuth.paths || {}).length} paths from swagger-auth.json`);
    }
    
    return swagger;
  }

  extractApiInfo(swagger) {
    const categoriesMap = new Map();
    let totalEndpoints = 0;
    let totalAuthRequired = 0;

    Object.entries(swagger.paths).forEach(([path, pathObj]) => {
      Object.entries(pathObj).forEach(([method, operation]) => {
        if (method === 'parameters') return;

        totalEndpoints++;
        const tags = operation.tags || ['Uncategorized'];
        const requiresAuth = this._requiresAuth(operation);
        
        if (requiresAuth) totalAuthRequired++;

        tags.forEach(tag => {
          if (!categoriesMap.has(tag)) {
            categoriesMap.set(tag, {
              name: tag,
              endpoints: [],
              authRequired: 0,
              authOptional: 0
            });
          }

          const category = categoriesMap.get(tag);
          const endpoint = this._extractEndpoint(path, method, operation);
          
          category.endpoints.push(endpoint);
          if (requiresAuth) {
            category.authRequired++;
          } else {
            category.authOptional++;
          }
        });
      });
    });

    const categories = Array.from(categoriesMap.values())
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      swagger,
      categories,
      totalEndpoints,
      totalAuthRequired
    };
  }

  _requiresAuth(operation) {
    return operation.security && operation.security.length > 0;
  }

  _extractEndpoint(path, method, operation) {
    return {
      name: operation.operationId || operation.summary || `${method} ${path}`,
      method: method.toUpperCase(),
      url: path,
      summary: operation.summary || '',
      description: operation.description || operation.summary || '',
      requiresAuth: this._requiresAuth(operation),
      parameters: this._extractParameters(operation),
      requestBody: this._extractRequestBody(operation),
      responses: this._extractResponses(operation)
    };
  }

  _extractParameters(operation) {
    const params = [];
    
    if (operation.parameters) {
      operation.parameters.forEach(param => {
        params.push({
          name: param.name,
          type: param.in,
          required: param.required || false,
          description: param.description || '',
          schema: param.schema || { type: param.type }
        });
      });
    }

    return params;
  }

  _extractRequestBody(operation) {
    if (!operation.consumes || !operation.parameters) return null;

    const bodyParam = operation.parameters.find(p => p.in === 'body');
    if (!bodyParam) return null;

    const isFormData = operation.consumes.includes('application/x-www-form-urlencoded');
    
    return {
      type: isFormData ? 'application/x-www-form-urlencoded' : 'application/json',
      schema: bodyParam.schema,
      required: bodyParam.required || false
    };
  }

  _extractResponses(operation) {
    const responses = [];
    
    if (operation.responses) {
      Object.entries(operation.responses).forEach(([code, response]) => {
        responses.push({
          code,
          description: response.description || ''
        });
      });
    }

    return responses;
  }
}

class DocumentationBuilder {
  buildDocumentation(apiInfo) {
    const { swagger, categories, totalEndpoints, totalAuthRequired } = apiInfo;

    let markdown = '# iNaturalist API Documentation\n\n';
    
    markdown += this._buildOverview(swagger, categories, totalEndpoints, totalAuthRequired);
    markdown += this._buildTableOfContents(categories);
    markdown += this._buildCategoryDocumentation(categories);
    markdown += this._buildStatistics(categories, totalEndpoints, totalAuthRequired);

    return markdown;
  }

  _buildOverview(swagger, categories, totalEndpoints, totalAuthRequired) {
    let overview = '## Overview\n\n';
    
    if (swagger.info && swagger.info.description) {
      overview += `${swagger.info.description}\n\n`;
    }
    
    overview += `This documentation covers the iNaturalist API endpoints organized by category. `;
    overview += `There are ${categories.length} categories with a total of ${totalEndpoints} endpoints.\n\n`;
    
    overview += `**Version:** ${swagger.info?.version || 'v1'}\n\n`;
    overview += `**Base URL:** \`${swagger.schemes?.[0] || 'https'}://${swagger.host || 'api.inaturalist.org'}${swagger.basePath || ''}\`\n\n`;
    
    overview += '**Authentication:** Many endpoints require authentication using Bearer tokens. ';
    overview += `${totalAuthRequired} out of ${totalEndpoints} endpoints require authentication.\n\n`;
    
    return overview;
  }

  _buildTableOfContents(categories) {
    let toc = '## Table of Contents\n\n';
    categories.forEach(category => {
      const anchor = category.name.toLowerCase().replace(/\s+/g, '-');
      toc += `- [${category.name}](#${anchor}) (${category.endpoints.length} endpoints)\n`;
    });
    toc += '\n';
    return toc;
  }

  _buildCategoryDocumentation(categories) {
    let docs = '';
    
    categories.forEach(category => {
      const anchor = category.name.toLowerCase().replace(/\s+/g, '-');
      docs += `## ${category.name}\n\n`;
      
      docs += `**Total Endpoints:** ${category.endpoints.length}  \n`;
      docs += `**Requires Authentication:** ${category.authRequired}  \n`;
      docs += `**Public Access:** ${category.authOptional}  \n\n`;

      docs += '### Endpoints\n\n';
      docs += this._buildEndpointsTable(category.endpoints);
      docs += '\n';

      docs += '### Endpoint Details\n\n';
      category.endpoints.forEach(endpoint => {
        docs += this._buildEndpointDetails(endpoint);
      });

      docs += '---\n\n';
    });

    return docs;
  }

  _buildEndpointsTable(endpoints) {
    let table = '| Method | Endpoint | Auth | Description |\n';
    table += '|--------|----------|------|-------------|\n';

    endpoints.forEach(endpoint => {
      const auth = endpoint.requiresAuth ? '🔒 Required' : '🔓 Optional';
      const description = endpoint.summary.length > 60 ? 
        endpoint.summary.substring(0, 57) + '...' : endpoint.summary;
      
      table += `| ${endpoint.method} | \`${endpoint.url}\` | ${auth} | ${description} |\n`;
    });

    return table;
  }

  _buildEndpointDetails(endpoint) {
    let details = `#### ${endpoint.method} ${endpoint.url}\n\n`;
    
    if (endpoint.summary) {
      details += `**${endpoint.summary}**\n\n`;
    }
    
    if (endpoint.description && endpoint.description !== endpoint.summary) {
      details += `${endpoint.description}\n\n`;
    }
    
    details += `**Authentication:** ${endpoint.requiresAuth ? 'Required (Bearer token)' : 'Not required'}\n\n`;

    if (endpoint.parameters.length > 0) {
      details += '**Parameters:**\n\n';
      
      const pathParams = endpoint.parameters.filter(p => p.type === 'path');
      const queryParams = endpoint.parameters.filter(p => p.type === 'query');
      const headerParams = endpoint.parameters.filter(p => p.type === 'header');
      
      if (pathParams.length > 0) {
        details += '*Path Parameters:*\n\n';
        details += '| Name | Required | Description |\n';
        details += '|------|----------|-------------|\n';
        pathParams.forEach(param => {
          const required = param.required ? 'Yes' : 'No';
          details += `| \`${param.name}\` | ${required} | ${param.description} |\n`;
        });
        details += '\n';
      }
      
      if (queryParams.length > 0) {
        details += '*Query Parameters:*\n\n';
        details += '| Name | Required | Type | Description |\n';
        details += '|------|----------|------|-------------|\n';
        queryParams.forEach(param => {
          const required = param.required ? 'Yes' : 'No';
          const type = param.schema?.type || 'string';
          details += `| \`${param.name}\` | ${required} | ${type} | ${param.description} |\n`;
        });
        details += '\n';
      }
      
      if (headerParams.length > 0) {
        details += '*Header Parameters:*\n\n';
        details += '| Name | Required | Description |\n';
        details += '|------|----------|-------------|\n';
        headerParams.forEach(param => {
          const required = param.required ? 'Yes' : 'No';
          details += `| \`${param.name}\` | ${required} | ${param.description} |\n`;
        });
        details += '\n';
      }
    }

    if (endpoint.requestBody) {
      details += '**Request Body:**\n\n';
      details += `- **Content-Type:** \`${endpoint.requestBody.type}\`\n`;
      details += `- **Required:** ${endpoint.requestBody.required ? 'Yes' : 'No'}\n`;
      
      if (endpoint.requestBody.schema && endpoint.requestBody.schema.$ref) {
        const schemaName = endpoint.requestBody.schema.$ref.split('/').pop();
        details += `- **Schema:** [${schemaName}](#schemas)\n`;
      }
      
      details += '\n';
    }

    if (endpoint.responses.length > 0) {
      details += '**Responses:**\n\n';
      details += '| Code | Description |\n';
      details += '|------|-------------|\n';
      endpoint.responses.forEach(response => {
        details += `| ${response.code} | ${response.description} |\n`;
      });
      details += '\n';
    }

    details += '\n';
    return details;
  }

  _buildStatistics(categories, totalEndpoints, totalAuthRequired) {
    let stats = '## API Statistics\n\n';
    stats += '### Summary\n\n';
    stats += '| Metric | Value |\n';
    stats += '|--------|-------|\n';
    stats += `| Total Categories | ${categories.length} |\n`;
    stats += `| Total Endpoints | ${totalEndpoints} |\n`;
    stats += `| Authenticated Endpoints | ${totalAuthRequired} |\n`;
    stats += `| Public Endpoints | ${totalEndpoints - totalAuthRequired} |\n`;
    stats += `| Auth Percentage | ${((totalAuthRequired / totalEndpoints) * 100).toFixed(1)}% |\n`;
    stats += '\n';
    
    stats += '### Endpoints by Method\n\n';
    const methodStats = this._calculateMethodStatistics(categories);
    stats += '| Method | Count | Percentage |\n';
    stats += '|--------|-------|------------|\n';
    Object.entries(methodStats).forEach(([method, count]) => {
      const percentage = ((count / totalEndpoints) * 100).toFixed(1);
      stats += `| ${method} | ${count} | ${percentage}% |\n`;
    });
    stats += '\n';
    
    stats += '### Categories by Size\n\n';
    stats += '| Category | Endpoints | Auth Required |\n';
    stats += '|----------|-----------|---------------|\n';
    const sortedCategories = [...categories].sort((a, b) => b.endpoints.length - a.endpoints.length);
    sortedCategories.forEach(category => {
      stats += `| ${category.name} | ${category.endpoints.length} | ${category.authRequired} |\n`;
    });
    
    stats += '\n';
    return stats;
  }

  _calculateMethodStatistics(categories) {
    const methods = {};
    categories.forEach(category => {
      category.endpoints.forEach(endpoint => {
        methods[endpoint.method] = (methods[endpoint.method] || 0) + 1;
      });
    });
    return methods;
  }
}

class FileManager {
  constructor(outputDir) {
    this.outputDir = outputDir;
  }

  ensureOutputDirectory() {
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
  }

  writeDocumentation(content) {
    const filePath = join(this.outputDir, 'API.md');
    writeFileSync(filePath, content);
    console.log('Generated API.md');
  }
}

const generator = new DocumentationGenerator();
await generator.generate();