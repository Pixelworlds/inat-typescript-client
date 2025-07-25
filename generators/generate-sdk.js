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

    // Check if typescript directory exists and has .ts files
    const shouldGenerateModules =
      !existsSync(this.typescriptDir) ||
      (existsSync(this.typescriptDir) && readdirSync(this.typescriptDir).filter(f => f.endsWith('.ts')).length === 0);

    if (shouldGenerateModules) {
      console.log('TypeScript modules not found, generating modules first...');
      try {
        execSync('bun run generate:modules', {
          cwd: this.projectRoot,
          stdio: 'inherit',
        });
      } catch (error) {
        console.error('Failed to generate TypeScript modules:', error.message);
        throw new Error('TypeScript module generation failed');
      }
    }

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

    if (modules.length === 0) {
      throw new Error('No TypeScript modules found after generation. Please check the module generation process.');
    }

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

  getActualClassName(moduleName) {
    const sourceFile = join(this.typescriptDir, `${moduleName}.ts`);
    if (!existsSync(sourceFile)) {
      return this.getClassName(moduleName);
    }

    const content = readFileSync(sourceFile, 'utf8');

    // Look for export class declarations
    const classMatch = content.match(/export class (\w+)/);
    if (classMatch) {
      return classMatch[1];
    }

    // Fallback to the original method
    return this.getClassName(moduleName);
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

  async generateTypes() {
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

    console.log('Checking for swagger types...');
    console.log('Swagger types source path:', swaggerTypesSource);
    console.log('Swagger types source exists:', existsSync(swaggerTypesSource));

    if (existsSync(swaggerTypesSource)) {
      if (!existsSync(swaggerTypesTarget)) {
        mkdirSync(swaggerTypesTarget, { recursive: true });
      }

      const targetFile = join(swaggerTypesTarget, 'swagger-types.ts');

      // Only copy if source and destination are different
      if (swaggerTypesSource !== targetFile) {
        copyFileSync(swaggerTypesSource, targetFile);
        console.log('Generated and copied swagger types');
      } else {
        console.log('Swagger types already in correct location, no copy needed');
      }
    } else {
      // Generate the types first if they don't exist
      console.log('Swagger types not found, generating them first...');

      // Check if data files exist
      const swaggerPath = join(this.projectRoot, 'data', 'swagger.json');
      const swaggerAuthPath = join(this.projectRoot, 'data', 'swagger-auth.json');

      console.log('Checking data files:');
      console.log('swagger.json path:', swaggerPath);
      console.log('swagger.json exists:', existsSync(swaggerPath));
      console.log('swagger-auth.json path:', swaggerAuthPath);
      console.log('swagger-auth.json exists:', existsSync(swaggerAuthPath));

      if (!existsSync(swaggerPath)) {
        throw new Error(`Required data file missing: ${swaggerPath}`);
      }

      if (!existsSync(swaggerAuthPath)) {
        throw new Error(`Required data file missing: ${swaggerAuthPath}`);
      }

      try {
        console.log('Attempting to generate swagger types...');
        execSync('bun run generate:types', {
          cwd: this.projectRoot,
          stdio: 'inherit',
        });
        console.log('Swagger types generation command completed');
      } catch (error) {
        console.error('Failed to generate swagger types:', error.message);
        console.error('Error details:', error);
        throw new Error('Swagger types generation failed');
      }

      console.log('Checking if swagger types were generated...');
      console.log('Swagger types source exists after generation:', existsSync(swaggerTypesSource));

      // Add a small delay to handle potential race conditions in CI
      if (!existsSync(swaggerTypesSource)) {
        console.log('Swagger types not immediately available, waiting 1 second...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Swagger types source exists after delay:', existsSync(swaggerTypesSource));
      }

      if (existsSync(swaggerTypesSource)) {
        if (!existsSync(swaggerTypesTarget)) {
          mkdirSync(swaggerTypesTarget, { recursive: true });
        }

        const targetFile = join(swaggerTypesTarget, 'swagger-types.ts');

        // Only copy if source and destination are different
        if (swaggerTypesSource !== targetFile) {
          copyFileSync(swaggerTypesSource, targetFile);
          console.log('Generated and copied swagger types');
        } else {
          console.log('Swagger types already in correct location, no copy needed');
        }
      } else {
        console.error('Swagger types still not found after generation');
        console.error('Expected location:', swaggerTypesSource);

        // Show what's in the src directory
        const srcDir = join(this.projectRoot, 'src');
        console.log('Contents of src directory:');
        if (existsSync(srcDir)) {
          const srcContents = readdirSync(srcDir);
          srcContents.forEach(item => {
            const itemPath = join(srcDir, item);
            const isDir = statSync(itemPath).isDirectory();
            console.log(`  ${item} ${isDir ? '(directory)' : '(file)'}`);

            if (isDir && item === 'types') {
              console.log('    Contents of types directory:');
              const typesContents = readdirSync(itemPath);
              typesContents.forEach(typeFile => {
                console.log(`      ${typeFile}`);
              });
            }
          });
        } else {
          console.log('  src directory does not exist');
        }

        throw new Error('Failed to generate swagger types');
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
        const className = this.getActualClassName(moduleName);
        return `import { ${className} } from './${moduleName}';`;
      })
      .join('\n');

    const properties = modules
      .map(moduleName => {
        const propertyName = moduleName.replace(/-/g, '_');
        const className = this.getActualClassName(moduleName);
        return `  public readonly ${propertyName}: ${className};`;
      })
      .join('\n');

    const initializers = modules
      .map(moduleName => {
        const propertyName = moduleName.replace(/-/g, '_');
        const className = this.getActualClassName(moduleName);
        return `    this.${propertyName} = new ${className}(this.http);`;
      })
      .join('\n');

    const indexContent = `import { INaturalistHttpClient } from './http-client';
import type { INaturalistConfig, HttpClient } from './types';

${imports}

export type { INaturalistConfig, RequestConfig, ApiResponse } from './types';
export type * from './types/swagger-types';

export {
${modules.map(moduleName => `  ${this.getActualClassName(moduleName)}`).join(',\n')}
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
    console.log('Starting iNaturalist SDK generation...\\n');

    // Add comprehensive environment debugging
    console.log('=== ENVIRONMENT DEBUG INFO ===');
    console.log('Current working directory:', process.cwd());
    console.log('Project root:', this.projectRoot);
    console.log('TypeScript directory:', this.typescriptDir);
    console.log('Src directory:', this.srcDir);
    console.log('Node version:', process.version);
    console.log('Platform:', process.platform);
    console.log('Architecture:', process.arch);

    // Check if critical directories exist
    console.log('\\n=== DIRECTORY EXISTENCE CHECK ===');
    console.log('Project root exists:', existsSync(this.projectRoot));
    console.log('TypeScript dir exists:', existsSync(this.typescriptDir));
    console.log('Src dir exists:', existsSync(this.srcDir));

    // Check data files
    const dataDir = join(this.projectRoot, 'data');
    console.log('Data dir exists:', existsSync(dataDir));
    if (existsSync(dataDir)) {
      console.log('Data directory contents:');
      const dataFiles = readdirSync(dataDir);
      dataFiles.forEach(file => console.log(`  ${file}`));
    }

    // Check root directory contents
    console.log('\\n=== ROOT DIRECTORY CONTENTS ===');
    const rootFiles = readdirSync(this.projectRoot);
    rootFiles.forEach(file => {
      const filePath = join(this.projectRoot, file);
      const isDir = statSync(filePath).isDirectory();
      console.log(`  ${file} ${isDir ? '(directory)' : '(file)'}`);
    });

    console.log('\\n=== STARTING GENERATION PROCESS ===');

    try {
      console.log('Step 1: Preparing src directory...');
      this.prepareSrcDirectory();
      console.log('✓ Src directory prepared');

      console.log('Step 2: Copying modules...');
      const modules = this.copyModules();
      console.log(`✓ Copied ${modules.length} modules`);

      console.log('Step 3: Generating types...');
      await this.generateTypes();
      console.log('✓ Types generated');

      console.log('Step 4: Generating HTTP client...');
      this.generateHttpClient();
      console.log('✓ HTTP client generated');

      console.log('Step 5: Generating main index...');
      this.generateMainIndex(modules);
      console.log('✓ Main index generated');

      // Verify all required files exist
      const requiredFiles = ['index.ts', 'http-client.ts', 'types.ts'];
      console.log('\\nStep 6: Verifying required files...');
      for (const file of requiredFiles) {
        const filePath = join(this.srcDir, file);
        if (existsSync(filePath)) {
          console.log(`✓ ${file} exists`);
        } else {
          console.error(`✗ ${file} missing at ${filePath}`);
          throw new Error(`Required file missing: ${file}`);
        }
      }

      console.log('\\n✅ SDK generation completed successfully!');
      console.log(`Generated SDK with ${modules.length} modules`);
      console.log('Run "bun run build" to compile the SDK');
    } catch (error) {
      console.error('\\n❌ SDK generation failed:');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

      // Show current directory contents for debugging
      console.log('\\n=== FAILURE DEBUG INFORMATION ===');
      console.log('Current working directory:', process.cwd());
      console.log('Project root:', this.projectRoot);
      console.log('Src directory:', this.srcDir);
      console.log('TypeScript directory:', this.typescriptDir);

      try {
        console.log('\\nSrc directory contents:');
        if (existsSync(this.srcDir)) {
          const srcFiles = readdirSync(this.srcDir);
          srcFiles.forEach(file => console.log(`  ${file}`));
        } else {
          console.log('  Src directory does not exist');
        }
      } catch (e) {
        console.log('  Error reading src directory:', e.message);
      }

      try {
        console.log('\\nTypeScript directory contents:');
        if (existsSync(this.typescriptDir)) {
          const tsFiles = readdirSync(this.typescriptDir);
          tsFiles.forEach(file => console.log(`  ${file}`));
        } else {
          console.log('  TypeScript directory does not exist');
        }
      } catch (e) {
        console.log('  Error reading typescript directory:', e.message);
      }

      // Show environment variables that might be relevant
      console.log('\\n=== ENVIRONMENT VARIABLES ===');
      console.log('HOME:', process.env.HOME);
      console.log('PWD:', process.env.PWD);
      console.log('GITHUB_WORKSPACE:', process.env.GITHUB_WORKSPACE);
      console.log('RUNNER_WORKSPACE:', process.env.RUNNER_WORKSPACE);

      throw error;
    }
  }
}

const generator = new INaturalistSDKGenerator();
await generator.generate();
