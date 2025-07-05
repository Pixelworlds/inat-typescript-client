#!/usr/bin/env bun

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

class TypeScriptModuleGenerator {
  constructor() {
    this.config = {
      inputFile: join(process.cwd(), 'data', 'swagger.json'),
      authInputFile: join(process.cwd(), 'data', 'swagger-auth.json'),
      outputDir: join(process.cwd(), 'typescript'),
      baseUrl: 'https://api.inaturalist.org/v1',
    };

    this.swaggerLoader = new SwaggerLoader(this.config);
    this.moduleBuilder = new ModuleBuilder(this.config);
    this.fileManager = new FileManager(this.config.outputDir);
  }

  async generate() {
    console.log('Loading Swagger specification...');
    const swagger = await this.swaggerLoader.loadSwagger();
    
    console.log('Extracting modules by tags...');
    const modules = this.swaggerLoader.extractModules(swagger);
    console.log(`Found ${modules.length} modules`);

    console.log('Generating TypeScript modules...');
    this.fileManager.ensureOutputDirectory();
    
    for (const module of modules) {
      const moduleContent = this.moduleBuilder.buildModule(module);
      this.fileManager.writeModule(module.fileName, moduleContent);
    }

    const indexModule = this.moduleBuilder.buildIndexModule(modules);
    this.fileManager.writeIndexModule(indexModule);

    console.log('TypeScript modules generated successfully!');
    console.log(`Output directory: ${this.config.outputDir}`);
    console.log(`Generated ${modules.length} modules + index`);
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
    
    // Also load swagger-auth.json if it exists and merge paths
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

  extractModules(swagger) {
    const moduleMap = new Map();
    
    // Process each path and method
    for (const [path, pathItem] of Object.entries(swagger.paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        if (method === 'parameters') continue; // Skip parameter definitions
        
        const tags = operation.tags || ['default'];
        for (const tag of tags) {
          if (!moduleMap.has(tag)) {
            moduleMap.set(tag, {
              name: tag,
              className: this._toClassName(tag),
              fileName: this._toFileName(tag),
              endpoints: []
            });
          }
          
          const module = moduleMap.get(tag);
          module.endpoints.push(this._createEndpoint(path, method, operation, swagger));
        }
      }
    }
    
    return Array.from(moduleMap.values());
  }

  _createEndpoint(path, method, operation, swagger) {
    const pathParams = this._extractPathParams(path, operation, swagger);
    const queryParams = this._extractQueryParams(operation, swagger);
    const bodyParam = this._extractBodyParam(operation);
    const methodName = this._generateMethodName(path, method, operation);
    
    return {
      name: methodName,
      method: method.toUpperCase(),
      path: path,
      summary: operation.summary || '',
      description: operation.description || '',
      operationId: operation.operationId || methodName,
      requiresAuth: this._requiresAuth(operation),
      pathParams,
      queryParams,
      bodyParam,
      consumes: operation.consumes || [],
      produces: operation.produces || swagger.produces || ['application/json'],
      responses: operation.responses || {}
    };
  }

  _extractPathParams(path, operation, swagger) {
    const params = [];
    const pathMatches = path.match(/\{([^}]+)\}/g);
    
    if (pathMatches) {
      for (const match of pathMatches) {
        const paramName = match.slice(1, -1);
        const paramDef = this._findParameter(paramName, operation, swagger);
        
        params.push({
          name: paramName,
          type: this._getParamType(paramDef),
          required: true,
          description: paramDef?.description || ''
        });
      }
    }
    
    return params;
  }

  _extractQueryParams(operation, swagger) {
    const params = [];
    
    if (operation.parameters) {
      for (const param of operation.parameters) {
        const resolvedParam = this._resolveParameter(param, swagger);
        
        if (resolvedParam && resolvedParam.in === 'query') {
          params.push({
            name: resolvedParam.name,
            type: this._getParamType(resolvedParam),
            required: resolvedParam.required || false,
            description: resolvedParam.description || ''
          });
        }
      }
    }
    
    return params;
  }

  _extractBodyParam(operation) {
    if (operation.parameters) {
      for (const param of operation.parameters) {
        if (param.in === 'body') {
          return {
            name: param.name || 'body',
            schema: param.schema,
            description: param.description || ''
          };
        }
      }
    }
    return null;
  }

  _findParameter(name, operation, swagger) {
    if (operation.parameters) {
      for (const param of operation.parameters) {
        const resolvedParam = this._resolveParameter(param, swagger);
        if (resolvedParam && resolvedParam.name === name) {
          return resolvedParam;
        }
      }
    }
    return null;
  }

  _resolveParameter(param, swagger) {
    if (param.$ref) {
      const refPath = param.$ref.split('/');
      let resolved = swagger;
      for (let i = 1; i < refPath.length; i++) {
        resolved = resolved[refPath[i]];
      }
      return resolved;
    }
    return param;
  }

  _getParamType(param) {
    if (!param) return 'any';
    
    if (param.type === 'integer') return 'number';
    if (param.type === 'boolean') return 'boolean';
    if (param.type === 'array') {
      const itemType = param.items?.type || 'any';
      return itemType === 'integer' ? 'number[]' : `${itemType}[]`;
    }
    if (param.enum) return param.enum.map(v => `'${v}'`).join(' | ');
    
    return 'string';
  }

  _generateMethodName(path, method, operation) {
    if (operation.operationId) {
      return this._sanitizeMethodName(operation.operationId);
    }
    
    // Generate from summary or path
    const summary = operation.summary || '';
    if (summary) {
      return this._sanitizeMethodName(summary.toLowerCase().replace(/\s+/g, '_'));
    }
    
    // Generate from path and method
    const pathParts = path.split('/').filter(p => p && !p.startsWith('{'));
    const cleanPath = pathParts.join('_');
    return `${method.toLowerCase()}_${cleanPath}`;
  }

  _sanitizeMethodName(name) {
    return name
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '')
      .toLowerCase();
  }

  _requiresAuth(operation) {
    return operation.security && operation.security.length > 0;
  }

  _toClassName(name) {
    return name
      .split(/[\s-]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
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

  buildModule(module) {
    const imports = this._buildImports(module);
    const interfaces = this._buildInterfaces(module);
    const classDefinition = this._buildClass(module);
    
    return [imports, interfaces, classDefinition].filter(Boolean).join('\n\n');
  }

  buildIndexModule(modules) {
    const axiosImport = `import axios from 'axios';\nimport type { AxiosInstance } from 'axios';`;
    const imports = modules.map(mod => 
      `import { ${mod.className} } from './${mod.fileName}';`
    ).join('\n');

    const clientClass = this._buildClientClass(modules);
    const exportStatement = `export { ${modules.map(mod => mod.className).join(', ')} };`;

    return [axiosImport, imports, clientClass, exportStatement].join('\n\n');
  }

  _buildImports(module) {
    const imports = [
      `import type { AxiosInstance, AxiosResponse } from 'axios';`
    ];
    
    // Check if we need to import types from swagger-types
    const needsTypes = module.endpoints.some(ep => 
      ep.bodyParam?.schema?.$ref || 
      ep.responses['200']?.schema?.$ref
    );
    
    if (needsTypes) {
      imports.push(`import type * as Types from '../src/types/swagger-types';`);
    }
    
    return imports.join('\n');
  }

  _buildInterfaces(module) {
    const interfaces = new Map();
    
    module.endpoints.forEach(endpoint => {
      if (endpoint.queryParams.length > 0) {
        const interfaceName = `${this._toTitleCase(endpoint.name)}Params`;
        if (!interfaces.has(interfaceName)) {
          const properties = endpoint.queryParams.map(param => {
            const optional = param.required ? '' : '?';
            const comment = param.description ? `\n  /** ${param.description} */` : '';
            return `${comment}\n  ${param.name}${optional}: ${param.type};`;
          }).join('\n');
          
          interfaces.set(interfaceName, `export interface ${interfaceName} {${properties}\n}`);
        }
      }
    });

    return Array.from(interfaces.values()).join('\n\n');
  }

  _buildClass(module) {
    const className = module.className;
    const methods = module.endpoints.map(endpoint => this._buildMethod(endpoint)).join('\n\n');

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
    const jsDoc = this._buildJsDoc(endpoint);
    
    // Build parameters
    const params = [];
    
    // Path parameters
    endpoint.pathParams.forEach(param => {
      params.push(`${param.name}: ${param.type}`);
    });
    
    // Query parameters
    if (endpoint.queryParams.length > 0) {
      const paramTypeName = `${this._toTitleCase(methodName)}Params`;
      const required = endpoint.queryParams.some(p => p.required);
      params.push(`params${required ? '' : '?'}: ${paramTypeName}`);
    }
    
    // Body parameter
    if (endpoint.bodyParam) {
      const bodyType = this._getBodyType(endpoint.bodyParam);
      params.push(`data: ${bodyType}`);
    }
    
    const paramString = params.join(', ');
    const returnType = this._getReturnType(endpoint);
    const url = this._buildUrlTemplate(endpoint.path, endpoint.pathParams);
    
    // Special handling for form-encoded endpoints
    if (endpoint.consumes.includes('application/x-www-form-urlencoded')) {
      return `${jsDoc}
  async ${methodName}(${paramString}): Promise<${returnType}> {
    const formData = new URLSearchParams();
    if (data) {
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key].toString());
        }
      });
    }
    
    return this.client.${endpoint.method.toLowerCase()}(\`${url}\`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }${endpoint.queryParams.length > 0 ? ',\n      params' : ''}
    });
  }`;
    }
    
    // Build axios config
    const axiosConfig = this._buildAxiosConfig(endpoint);
    
    return `${jsDoc}
  async ${methodName}(${paramString}): Promise<${returnType}> {
    return this.client.${endpoint.method.toLowerCase()}(\`${url}\`${axiosConfig});
  }`;
  }

  _buildJsDoc(endpoint) {
    const lines = ['  /**'];
    
    if (endpoint.summary) {
      lines.push(`   * ${endpoint.summary}`);
    }
    
    if (endpoint.description && endpoint.description !== endpoint.summary) {
      lines.push('   *');
      endpoint.description.split('\n').forEach(line => {
        lines.push(`   * ${line.trim()}`);
      });
    }
    
    if (endpoint.requiresAuth) {
      lines.push('   * @requires Authentication');
    }
    
    lines.push('   */');
    return lines.join('\n');
  }

  _buildAxiosConfig(endpoint) {
    const configs = [];
    
    if (endpoint.method === 'GET' || endpoint.method === 'DELETE') {
      if (endpoint.queryParams.length > 0) {
        configs.push('{ params }');
      }
    } else {
      // POST, PUT, PATCH
      if (endpoint.bodyParam) {
        configs.push('data');
      }
      
      if (endpoint.queryParams.length > 0) {
        configs.push('{ params }');
      }
    }
    
    return configs.length > 0 ? ', ' + configs.join(', ') : '';
  }

  _buildUrlTemplate(path, pathParams) {
    let template = path;
    pathParams.forEach(param => {
      template = template.replace(`{${param.name}}`, `\${${param.name}}`);
    });
    return template;
  }

  _getBodyType(bodyParam) {
    if (bodyParam.schema?.$ref) {
      const typeName = bodyParam.schema.$ref.split('/').pop();
      return `Types.${typeName}`;
    }
    return 'any';
  }

  _getReturnType(endpoint) {
    const response = endpoint.responses['200'];
    if (response?.schema?.$ref) {
      const typeName = response.schema.$ref.split('/').pop();
      return `AxiosResponse<Types.${typeName}>`;
    }
    return 'AxiosResponse<any>';
  }

  _buildClientClass(modules) {
    const properties = modules.map(mod => {
      const propName = mod.fileName.replace(/-/g, '_');
      return `  public ${propName}: ${mod.className};`;
    }).join('\n');

    const initializations = modules.map(mod => {
      const propName = mod.fileName.replace(/-/g, '_');
      return `    this.${propName} = new ${mod.className}(this.client);`;
    }).join('\n');

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

  _toTitleCase(str) {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
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