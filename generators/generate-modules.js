#!/usr/bin/env bun

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

class TypeScriptModuleGenerator {
  constructor() {
    this.config = {
      inputFile: join(process.cwd(), 'postman', 'iNaturalist_API_Collection.postman_collection.json'),
      outputDir: join(process.cwd(), 'typescript'),
      baseUrl: 'https://api.inaturalist.org/v1',
    };

    this.collectionLoader = new CollectionLoader(this.config);
    this.moduleBuilder = new ModuleBuilder(this.config);
    this.fileManager = new FileManager(this.config.outputDir);
  }

  async generate() {
    console.log('Loading Postman collection...');
    const collection = await this.collectionLoader.loadCollection();
    
    console.log('Extracting categories...');
    const categories = this.collectionLoader.extractCategories(collection);
    console.log(`Found ${categories.length} categories`);

    console.log('Generating TypeScript modules...');
    this.fileManager.ensureOutputDirectory();
    
    for (const category of categories) {
      const module = this.moduleBuilder.buildModule(category);
      this.fileManager.writeModule(category.name, module);
    }

    const indexModule = this.moduleBuilder.buildIndexModule(categories);
    this.fileManager.writeIndexModule(indexModule);

    console.log('TypeScript modules generated successfully!');
    console.log(`Output directory: ${this.config.outputDir}`);
    console.log(`Generated ${categories.length} modules + index`);
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
      className: this._toClassName(categoryItem.name),
      fileName: this._toFileName(categoryItem.name),
      endpoints: this._extractEndpoints(categoryItem.item || [])
    }));
  }

  _extractEndpoints(items) {
    return items.map(item => {
      const request = item.request;
      const url = this._extractUrl(request.url);
      
      return {
        name: this._extractMethodName(item.name, request.method),
        method: request.method,
        url: url,
        description: request.description || item.name,
        requiresAuth: this._requiresAuth(request),
        hasBody: this._hasBody(request),
        queryParams: this._extractQueryParams(request.url),
        pathParams: this._extractPathParams(url)
      };
    });
  }

  _extractUrl(url) {
    if (typeof url === 'string') {
      return url.replace(/^https:\/\/[^/]+/, '').replace(/\{\{inat_base_url\}\}/, '').replace(/\?.*$/, '');
    }
    return url.raw ? url.raw.replace(/^https:\/\/[^/]+/, '').replace(/\{\{inat_base_url\}\}/, '').replace(/\?.*$/, '') : '';
  }

  _extractMethodName(name, method) {
    const cleanName = name
      .split(' - ')[0]
      .replace(/[^a-zA-Z0-9/]/g, '')
      .split('/')
      .filter(part => part && !part.startsWith(':'))
      .join('_');
    
    return `${method.toLowerCase()}_${cleanName}`.replace(/_{2,}/g, '_');
  }

  _requiresAuth(request) {
    return request.auth?.type !== 'noauth' && 
           request.header?.some(h => h.key === 'Authorization');
  }

  _hasBody(request) {
    return ['POST', 'PUT', 'PATCH'].includes(request.method) && request.body;
  }

  _extractQueryParams(url) {
    if (typeof url === 'string' && url.includes('?')) {
      const queryString = url.split('?')[1];
      return queryString.split('&').map(param => {
        const [key] = param.split('=');
        return { name: key, type: 'string' };
      });
    }
    return [];
  }

  _extractPathParams(url) {
    const matches = url.match(/:([a-zA-Z_][a-zA-Z0-9_]*)/g);
    return matches ? matches.map(match => ({
      name: match.slice(1),
      type: 'string | number'
    })) : [];
  }

  _toClassName(name) {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
      .replace(/[^a-zA-Z0-9]/g, '');
  }

  _toFileName(name) {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}

class ModuleBuilder {
  constructor(config) {
    this.config = config;
  }

  buildModule(category) {
    const imports = this._buildImports();
    const interfaces = this._buildInterfaces(category);
    const classDefinition = this._buildClass(category);
    
    return [imports, interfaces, classDefinition].join('\n\n');
  }

  buildIndexModule(categories) {
    const axiosImport = `import axios from 'axios';\nimport type { AxiosInstance } from 'axios';`;
    const imports = categories.map(cat => 
      `import { ${cat.className} } from './${cat.fileName}';`
    ).join('\n');

    const clientClass = this._buildClientClass(categories);
    const exportStatement = `export { ${categories.map(cat => cat.className).join(', ')} };`;

    return [axiosImport, imports, clientClass, exportStatement].join('\n\n');
  }

  _buildImports() {
    return `import type { AxiosInstance, AxiosResponse } from 'axios';`;
  }

  _buildInterfaces(category) {
    const interfaces = [];
    
    category.endpoints.forEach(endpoint => {
      if (endpoint.queryParams.length > 0) {
        const interfaceName = `${this._capitalize(endpoint.name)}Params`;
        const properties = endpoint.queryParams.map(param => 
          `  ${param.name}?: ${param.type};`
        ).join('\n');
        
        interfaces.push(`interface ${interfaceName} {\n${properties}\n}`);
      }
    });

    return interfaces.join('\n\n');
  }

  _buildClass(category) {
    const className = category.className;
    const methods = category.endpoints.map(endpoint => this._buildMethod(endpoint)).join('\n\n');

    return `export class ${className} {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

${methods}
}`;
  }

  _buildMethod(endpoint) {
    const methodName = endpoint.name;
    const pathParams = endpoint.pathParams.map(p => `${p.name}: ${p.type}`);
    const hasParams = endpoint.queryParams.length > 0;
    const hasBody = endpoint.hasBody;
    
    let parameters = [...pathParams];
    if (hasParams) {
      const paramTypeName = `${this._capitalize(methodName)}Params`;
      parameters.push(`params?: ${paramTypeName}`);
    }
    if (hasBody) {
      parameters.push('data?: any');
    }

    const paramString = parameters.join(', ');
    const url = this._buildUrlTemplate(endpoint.url, endpoint.pathParams);
    
    let configObject = '{}';
    if (hasParams && hasBody) {
      configObject = '{ params, data }';
    } else if (hasParams) {
      configObject = '{ params }';
    } else if (hasBody) {
      configObject = '{ data }';
    }

    return `  async ${methodName}(${paramString}): Promise<AxiosResponse<any>> {
    return this.client.${endpoint.method.toLowerCase()}(\`${url}\`, ${configObject});
  }`;
  }

  _buildUrlTemplate(url, pathParams) {
    let template = url;
    pathParams.forEach(param => {
      template = template.replace(`:${param.name}`, `\${${param.name}}`);
    });
    return template;
  }

  _buildClientClass(categories) {
    const properties = categories.map(cat => 
      `  public ${cat.fileName.replace(/-/g, '_')}: ${cat.className};`
    ).join('\n');

    const initializations = categories.map(cat => 
      `    this.${cat.fileName.replace(/-/g, '_')} = new ${cat.className}(this.client);`
    ).join('\n');

    return `export class INaturalistClient {
  private client: AxiosInstance;
${properties}

  constructor(baseURL: string = '${this.config.baseUrl}', apiToken?: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(apiToken && { 'Authorization': \`Bearer \${apiToken}\` })
      }
    });

${initializations}
  }

  setApiToken(token: string): void {
    this.client.defaults.headers['Authorization'] = \`Bearer \${token}\`;
  }

  removeApiToken(): void {
    delete this.client.defaults.headers['Authorization'];
  }
}`;
  }

  _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
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

  writeModule(categoryName, moduleContent) {
    const fileName = this._toFileName(categoryName);
    const filePath = join(this.outputDir, `${fileName}.ts`);
    writeFileSync(filePath, moduleContent);
    console.log(`Generated ${fileName}.ts`);
  }

  writeIndexModule(indexContent) {
    const filePath = join(this.outputDir, 'index.ts');
    writeFileSync(filePath, indexContent);
    console.log('Generated index.ts');
  }

  _toFileName(name) {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}

const generator = new TypeScriptModuleGenerator();
await generator.generate();