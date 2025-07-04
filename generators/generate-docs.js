#!/usr/bin/env bun

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

class DocumentationGenerator {
  constructor() {
    this.config = {
      inputFile: join(process.cwd(), 'postman', 'iNaturalist_API_Collection.postman_collection.json'),
      outputDir: join(process.cwd(), 'docs'),
    };

    this.collectionLoader = new CollectionLoader(this.config);
    this.docBuilder = new DocumentationBuilder();
    this.fileManager = new FileManager(this.config.outputDir);
  }

  async generate() {
    console.log('Loading Postman collection...');
    const collection = await this.collectionLoader.loadCollection();
    
    console.log('Extracting categories...');
    const categories = this.collectionLoader.extractCategories(collection);
    console.log(`Found ${categories.length} categories`);

    console.log('Generating documentation...');
    this.fileManager.ensureOutputDirectory();
    
    const documentation = this.docBuilder.buildDocumentation(categories);
    this.fileManager.writeDocumentation(documentation);

    console.log('API documentation generated successfully!');
    console.log(`Output: ${join(this.config.outputDir, 'API.md')}`);
  }
}

class CollectionLoader {
  constructor(config) {
    this.config = config;
  }

  async loadCollection() {
    if (!existsSync(this.config.inputFile)) {
      throw new Error(`Postman collection not found: ${this.config.inputFile}`);
    }

    const data = readFileSync(this.config.inputFile, 'utf8');
    return JSON.parse(data);
  }

  extractCategories(collection) {
    return collection.item.map(categoryItem => ({
      name: categoryItem.name,
      description: this._extractCategoryDescription(categoryItem),
      endpoints: this._extractEndpoints(categoryItem.item || [])
    }));
  }

  _extractCategoryDescription(categoryItem) {
    const endpointCount = categoryItem.item ? categoryItem.item.length : 0;
    const authRequired = categoryItem.item ? 
      categoryItem.item.filter(item => this._requiresAuth(item.request)).length : 0;
    
    return {
      endpointCount,
      authRequired,
      authOptional: endpointCount - authRequired
    };
  }

  _extractEndpoints(items) {
    return items.map(item => {
      const request = item.request;
      const url = this._extractUrl(request.url);
      
      return {
        name: item.name.split(' - ')[0],
        method: request.method,
        url: url,
        description: request.description || item.name,
        requiresAuth: this._requiresAuth(request),
        parameters: this._extractParameters(request),
        requestBody: this._extractRequestBody(request),
        headers: this._extractHeaders(request)
      };
    });
  }

  _extractUrl(url) {
    if (typeof url === 'string') {
      return url.replace(/^https:\/\/[^/]+/, '').replace(/\{\{inat_base_url\}\}/, '');
    }
    return url.raw ? url.raw.replace(/^https:\/\/[^/]+/, '').replace(/\{\{inat_base_url\}\}/, '') : '';
  }

  _requiresAuth(request) {
    return request.auth?.type !== 'noauth' && 
           request.header?.some(h => h.key === 'Authorization');
  }

  _extractParameters(request) {
    const params = [];
    
    if (typeof request.url === 'string' && request.url.includes('?')) {
      const queryString = request.url.split('?')[1];
      queryString.split('&').forEach(param => {
        const [key] = param.split('=');
        if (key) {
          params.push({
            name: key,
            type: 'query',
            required: false,
            description: `Query parameter: ${key}`
          });
        }
      });
    }

    const url = this._extractUrl(request.url);
    const pathMatches = url.match(/:([a-zA-Z_][a-zA-Z0-9_]*)/g);
    if (pathMatches) {
      pathMatches.forEach(match => {
        params.push({
          name: match.slice(1),
          type: 'path',
          required: true,
          description: `Path parameter: ${match.slice(1)}`
        });
      });
    }

    return params;
  }

  _extractRequestBody(request) {
    if (!request.body) return null;

    if (request.body.mode === 'urlencoded') {
      return {
        type: 'application/x-www-form-urlencoded',
        fields: request.body.urlencoded || []
      };
    }

    if (request.body.mode === 'raw') {
      return {
        type: 'application/json',
        example: request.body.raw || '{}'
      };
    }

    return null;
  }

  _extractHeaders(request) {
    return (request.header || [])
      .filter(h => h.key !== 'Authorization')
      .map(h => ({
        name: h.key,
        value: h.value,
        description: `Header: ${h.key}`
      }));
  }
}

class DocumentationBuilder {
  buildDocumentation(categories) {
    const totalEndpoints = categories.reduce((sum, cat) => sum + cat.endpoints.length, 0);
    const totalAuthRequired = categories.reduce((sum, cat) => sum + cat.description.authRequired, 0);

    let markdown = '# iNaturalist API Documentation\n\n';
    
    markdown += this._buildOverview(categories, totalEndpoints, totalAuthRequired);
    markdown += this._buildTableOfContents(categories);
    markdown += this._buildCategoryDocumentation(categories);
    markdown += this._buildStatistics(categories, totalEndpoints, totalAuthRequired);

    return markdown;
  }

  _buildOverview(categories, totalEndpoints, totalAuthRequired) {
    let overview = '## Overview\n\n';
    overview += 'This documentation covers the iNaturalist API endpoints organized by category. ';
    overview += `There are ${categories.length} categories with a total of ${totalEndpoints} endpoints.\n\n`;
    overview += '**Base URL:** `https://api.inaturalist.org/v1`\n\n';
    overview += '**Authentication:** Many endpoints require authentication using Bearer tokens. ';
    overview += `${totalAuthRequired} out of ${totalEndpoints} endpoints require authentication.\n\n`;
    return overview;
  }

  _buildTableOfContents(categories) {
    let toc = '## Table of Contents\n\n';
    categories.forEach(category => {
      const anchor = category.name.toLowerCase().replace(/\s+/g, '-');
      toc += `- [${category.name}](#${anchor})\n`;
    });
    toc += '\n';
    return toc;
  }

  _buildCategoryDocumentation(categories) {
    let docs = '';
    
    categories.forEach(category => {
      docs += `## ${category.name}\n\n`;
      
      docs += `**Endpoints:** ${category.description.endpointCount}  \n`;
      docs += `**Authentication Required:** ${category.description.authRequired}  \n`;
      docs += `**Authentication Optional:** ${category.description.authOptional}  \n\n`;

      docs += '### Endpoints\n\n';
      docs += this._buildEndpointsTable(category.endpoints);
      docs += '\n';

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
      const description = endpoint.description.length > 60 ? 
        endpoint.description.substring(0, 57) + '...' : endpoint.description;
      
      table += `| ${endpoint.method} | \`${endpoint.url}\` | ${auth} | ${description} |\n`;
    });

    return table;
  }

  _buildEndpointDetails(endpoint) {
    let details = `#### ${endpoint.method} ${endpoint.url}\n\n`;
    
    details += `**Description:** ${endpoint.description}\n\n`;
    details += `**Authentication:** ${endpoint.requiresAuth ? 'Required' : 'Optional'}\n\n`;

    if (endpoint.parameters.length > 0) {
      details += '**Parameters:**\n\n';
      details += '| Name | Type | Required | Description |\n';
      details += '|------|------|----------|-------------|\n';
      
      endpoint.parameters.forEach(param => {
        const required = param.required ? 'Yes' : 'No';
        details += `| ${param.name} | ${param.type} | ${required} | ${param.description} |\n`;
      });
      details += '\n';
    }

    if (endpoint.requestBody) {
      details += '**Request Body:**\n\n';
      details += `- **Content-Type:** \`${endpoint.requestBody.type}\`\n`;
      
      if (endpoint.requestBody.fields) {
        details += '- **Fields:**\n';
        endpoint.requestBody.fields.forEach(field => {
          details += `  - \`${field.key}\`: ${field.value}\n`;
        });
      }
      
      if (endpoint.requestBody.example) {
        details += '- **Example:**\n```json\n';
        details += endpoint.requestBody.example;
        details += '\n```\n';
      }
      details += '\n';
    }

    if (endpoint.headers.length > 0) {
      details += '**Headers:**\n\n';
      endpoint.headers.forEach(header => {
        details += `- \`${header.name}\`: ${header.value}\n`;
      });
      details += '\n';
    }

    details += '\n';
    return details;
  }

  _buildStatistics(categories, totalEndpoints, totalAuthRequired) {
    let stats = '## Statistics\n\n';
    stats += '| Metric | Value |\n';
    stats += '|--------|-------|\n';
    stats += `| Total Categories | ${categories.length} |\n`;
    stats += `| Total Endpoints | ${totalEndpoints} |\n`;
    stats += `| Endpoints Requiring Auth | ${totalAuthRequired} |\n`;
    stats += `| Public Endpoints | ${totalEndpoints - totalAuthRequired} |\n`;
    
    const methodStats = this._calculateMethodStatistics(categories);
    Object.entries(methodStats).forEach(([method, count]) => {
      stats += `| ${method} Endpoints | ${count} |\n`;
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