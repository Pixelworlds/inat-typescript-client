#!/usr/bin/env bun

import { execSync } from 'child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { join, resolve } from 'path';

class INaturalistSDKGenerator {
  constructor() {
    this.projectRoot = resolve(process.cwd());
    this.typescriptDir = join(this.projectRoot, 'typescript');
    this.srcDir = join(this.projectRoot, 'src');
  }

  prepareSrcDirectory() {
    if (existsSync(this.srcDir)) {
      const files = readdirSync(this.srcDir);
      for (const file of files) {
        const filePath = join(this.srcDir, file);
        if (statSync(filePath).isDirectory()) {
          rmSync(filePath, { recursive: true });
        } else {
          unlinkSync(filePath);
        }
      }
    } else {
      mkdirSync(this.srcDir, { recursive: true });
    }

    console.log('Cleaned and prepared src directory');
  }

  getAllModules() {
    const modules = [];

    if (!existsSync(this.typescriptDir)) {
      throw new Error(`TypeScript modules directory not found: ${this.typescriptDir}`);
    }

    const files = readdirSync(this.typescriptDir);
    for (const file of files) {
      if (file.endsWith('.ts') && file !== 'index.ts') {
        const moduleName = file.replace('.ts', '');
        modules.push(moduleName);
      }
    }

    console.log(`Found ${modules.length} modules to include`);
    return modules;
  }

  transformModule(sourceFile, targetFile, moduleName) {
    const content = readFileSync(sourceFile, 'utf8');

    let transformedContent = content.replace(
      /import type { AxiosInstance, AxiosResponse } from 'axios';/,
      `import type { HttpClient, ApiResponse } from './types';`
    );

    // Fix swagger-types import path
    transformedContent = transformedContent.replace(
      /import type \* as Types from '\.\.\/src\/types\/swagger-types';/,
      `import type * as Types from './types/swagger-types';`
    );

    transformedContent = transformedContent.replace(/AxiosInstance/g, 'HttpClient');
    transformedContent = transformedContent.replace(/AxiosResponse/g, 'ApiResponse');

    transformedContent = transformedContent.replace(
      /private client: HttpClient;\s*constructor\(client: HttpClient\) {\s*this\.client = client;\s*}/,
      'constructor(private http: HttpClient) {}'
    );

    transformedContent = transformedContent.replace(/this\.client\./g, 'this.http.');

    writeFileSync(targetFile, transformedContent);
  }

  getClassName(moduleName) {
    return moduleName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  copyModules() {
    const modules = this.getAllModules();
    let copiedCount = 0;

    for (const moduleName of modules) {
      const sourceFile = join(this.typescriptDir, `${moduleName}.ts`);
      const targetFile = join(this.srcDir, `${moduleName}.ts`);

      if (existsSync(sourceFile)) {
        this.transformModule(sourceFile, targetFile, moduleName);
        copiedCount++;
      } else {
        console.warn(`Warning: Module ${moduleName} not found at ${sourceFile}`);
      }
    }

    console.log(`Copied and transformed ${copiedCount} modules`);
    return modules;
  }

  generateTypes() {
    const typesContent = `import type { AxiosResponse } from 'axios';

export interface HttpClient {
  get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>;
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>;
  delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  params?: any;
  data?: any;
  [key: string]: any;
}

export type ApiResponse<T = any> = AxiosResponse<T>;

export interface INaturalistConfig {
  baseURL?: string;
  apiToken?: string;
  timeout?: number;
}
`;

    writeFileSync(join(this.srcDir, 'types.ts'), typesContent);
    console.log('Generated shared types');

    // Also copy swagger types if they exist
    const swaggerTypesSource = join(this.projectRoot, 'src', 'types', 'swagger-types.ts');
    const swaggerTypesTarget = join(this.srcDir, 'types');

    if (existsSync(swaggerTypesSource)) {
      if (!existsSync(swaggerTypesTarget)) {
        mkdirSync(swaggerTypesTarget, { recursive: true });
      }
      copyFileSync(swaggerTypesSource, join(swaggerTypesTarget, 'swagger-types.ts'));
      console.log('Copied swagger-generated types');
    } else {
      // Generate the types first if they don't exist
      console.log('Swagger types not found, generating them first...');
      execSync('bun run generate:types', { cwd: this.projectRoot });

      if (existsSync(swaggerTypesSource)) {
        if (!existsSync(swaggerTypesTarget)) {
          mkdirSync(swaggerTypesTarget, { recursive: true });
        }
        copyFileSync(swaggerTypesSource, join(swaggerTypesTarget, 'swagger-types.ts'));
        console.log('Generated and copied swagger types');
      }
    }
  }

  generateHttpClient() {
    const httpClientContent = `import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { HttpClient, RequestConfig, ApiResponse, INaturalistConfig } from './types';

export class INaturalistHttpClient implements HttpClient {
  private client: AxiosInstance;

  constructor(config: INaturalistConfig = {}) {
    const baseURL = config.baseURL || 'https://api.inaturalist.org/v1';
    
    this.client = axios.create({
      baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(config.apiToken && { 'Authorization': \`Bearer \${config.apiToken}\` })
      },
    });
  }

  setApiToken(token: string): void {
    this.client.defaults.headers['Authorization'] = \`Bearer \${token}\`;
  }

  removeApiToken(): void {
    delete this.client.defaults.headers['Authorization'];
  }

  async get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.client.get(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.client.post(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.client.put(url, data, config);
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.client.delete(url, config);
  }

  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.client.patch(url, data, config);
  }
}
`;

    writeFileSync(join(this.srcDir, 'http-client.ts'), httpClientContent);
    console.log('Generated HTTP client');
  }

  generateMainIndex(modules) {
    const imports = modules
      .map(moduleName => {
        const className = this.getClassName(moduleName);
        return `import { ${className} } from './${moduleName}';`;
      })
      .join('\n');

    const properties = modules
      .map(moduleName => {
        const propertyName = moduleName.replace(/-/g, '_');
        const className = this.getClassName(moduleName);
        return `  public readonly ${propertyName}: ${className};`;
      })
      .join('\n');

    const initializers = modules
      .map(moduleName => {
        const propertyName = moduleName.replace(/-/g, '_');
        const className = this.getClassName(moduleName);
        return `    this.${propertyName} = new ${className}(this.http);`;
      })
      .join('\n');

    const indexContent = `import { INaturalistHttpClient } from './http-client';
import type { INaturalistConfig, HttpClient } from './types';

${imports}

export type { INaturalistConfig, RequestConfig, ApiResponse } from './types';
export * from './types/swagger-types';

export {
${modules.map(moduleName => `  ${this.getClassName(moduleName)}`).join(',\n')}
};

export class INaturalistClient {
  private http: HttpClient;

${properties}

  constructor(baseURL?: string, apiToken?: string);
  constructor(config?: INaturalistConfig);
  constructor(configOrBaseURL?: string | INaturalistConfig, apiToken?: string) {
    let config: INaturalistConfig;
    
    if (typeof configOrBaseURL === 'string') {
      config = {
        baseURL: configOrBaseURL,
        apiToken: apiToken
      };
    } else {
      config = configOrBaseURL || {};
    }

    this.http = new INaturalistHttpClient(config);

${initializers}
  }

  setApiToken(token: string): void {
    (this.http as INaturalistHttpClient).setApiToken(token);
  }

  removeApiToken(): void {
    (this.http as INaturalistHttpClient).removeApiToken();
  }
}

export default INaturalistClient;
`;

    writeFileSync(join(this.srcDir, 'index.ts'), indexContent);
    console.log('Generated main index.ts and INaturalistClient class');
  }

  async generate() {
    console.log('Starting iNaturalist SDK generation...\n');

    try {
      this.prepareSrcDirectory();
      const modules = this.copyModules();
      this.generateTypes();
      this.generateHttpClient();
      this.generateMainIndex(modules);

      console.log('\nSDK generation completed successfully!');
      console.log(`Generated SDK with ${modules.length} modules`);
      console.log('Run "bun run build" to compile the SDK');
    } catch (error) {
      console.error('SDK generation failed:', error.message);
      process.exit(1);
    }
  }
}

const generator = new INaturalistSDKGenerator();
await generator.generate();
