#!/usr/bin/env bun

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const swaggerPath = join(process.cwd(), 'data', 'swagger.json');
const outputPath = join(process.cwd(), 'src', 'types', 'swagger-types.ts');

function mapSwaggerTypeToTypeScript(type, format) {
  switch (type) {
    case 'integer':
      return 'number';
    case 'number':
      return 'number';
    case 'string':
      return 'string';
    case 'boolean':
      return 'boolean';
    case 'array':
      return null;
    case 'object':
      return null;
    default:
      return 'any';
  }
}

function processEnumValues(enumValues) {
  return enumValues.map(value => `'${value}'`).join(' | ');
}

function processProperty(name, property, required = false) {
  const isOptional = !required;
  const optionalMarker = isOptional ? '?' : '';
  
  if (property.enum) {
    return `  ${name}${optionalMarker}: ${processEnumValues(property.enum)};`;
  }
  
  if (property.$ref) {
    const refType = property.$ref.split('/').pop();
    return `  ${name}${optionalMarker}: ${refType};`;
  }
  
  if (property.type === 'array') {
    if (property.items) {
      if (property.items.$ref) {
        const refType = property.items.$ref.split('/').pop();
        return `  ${name}${optionalMarker}: ${refType}[];`;
      } else if (property.items.type) {
        const itemType = mapSwaggerTypeToTypeScript(property.items.type, property.items.format);
        if (itemType) {
          return `  ${name}${optionalMarker}: ${itemType}[];`;
        } else if (property.items.type === 'object') {
          return `  ${name}${optionalMarker}: Record<string, any>[];`;
        }
      }
    }
    return `  ${name}${optionalMarker}: any[];`;
  }
  
  if (property.type === 'object') {
    if (property.properties) {
      const nestedProps = Object.entries(property.properties)
        .map(([nestedName, nestedProp]) => {
          const isNestedRequired = property.required && property.required.includes(nestedName);
          return processProperty(nestedName, nestedProp, isNestedRequired);
        })
        .join('\n');
      return `  ${name}${optionalMarker}: {\n${nestedProps}\n  };`;
    }
    return `  ${name}${optionalMarker}: Record<string, any>;`;
  }
  
  const tsType = mapSwaggerTypeToTypeScript(property.type, property.format);
  if (tsType) {
    return `  ${name}${optionalMarker}: ${tsType};`;
  }
  
  return `  ${name}${optionalMarker}: any;`;
}

function processDefinition(name, definition) {
  let output = '';
  
  if (definition.allOf) {
    const baseTypes = [];
    const additionalProperties = [];
    
    for (const item of definition.allOf) {
      if (item.$ref) {
        const refType = item.$ref.split('/').pop();
        baseTypes.push(refType);
      } else if (item.type === 'object' && item.properties) {
        const props = Object.entries(item.properties)
          .map(([propName, propDef]) => {
            const isRequired = item.required && item.required.includes(propName);
            return processProperty(propName, propDef, isRequired);
          });
        additionalProperties.push(...props);
      }
    }
    
    if (baseTypes.length > 0 && additionalProperties.length > 0) {
      output += `export interface ${name} extends ${baseTypes.join(', ')} {\n`;
      output += additionalProperties.join('\n');
      output += '\n}\n';
    } else if (baseTypes.length > 0) {
      output += `export type ${name} = ${baseTypes.join(' & ')};\n`;
    } else if (additionalProperties.length > 0) {
      output += `export interface ${name} {\n`;
      output += additionalProperties.join('\n');
      output += '\n}\n';
    }
  } else if (definition.type === 'object') {
    output += `export interface ${name} {\n`;
    
    if (definition.properties) {
      const properties = Object.entries(definition.properties)
        .map(([propName, propDef]) => {
          const isRequired = definition.required && definition.required.includes(propName);
          return processProperty(propName, propDef, isRequired);
        })
        .join('\n');
      
      output += properties;
    }
    
    output += '\n}\n';
  } else if (definition.enum) {
    output += `export type ${name} = ${processEnumValues(definition.enum)};\n`;
  } else {
    const tsType = mapSwaggerTypeToTypeScript(definition.type, definition.format);
    if (tsType) {
      output += `export type ${name} = ${tsType};\n`;
    } else {
      output += `export type ${name} = any;\n`;
    }
  }
  
  return output;
}

async function generateTypes() {
  console.log('Reading swagger.json...');
  const swaggerContent = readFileSync(swaggerPath, 'utf-8');
  const swagger = JSON.parse(swaggerContent);
  
  if (!swagger.definitions) {
    console.error('No definitions found in swagger.json');
    return;
  }
  
  console.log(`Found ${Object.keys(swagger.definitions).length} definitions`);
  
  let output = `/**
 * TypeScript types generated from Swagger/OpenAPI definitions
 * Generated by: generate-types-from-swagger.js
 * Source: data/swagger.json
 */

`;
  
  const sortedDefinitions = Object.entries(swagger.definitions).sort(([a], [b]) => {
    const aHasRef = JSON.stringify(swagger.definitions[a]).includes('$ref');
    const bHasRef = JSON.stringify(swagger.definitions[b]).includes('$ref');
    
    if (aHasRef && !bHasRef) return 1;
    if (!aHasRef && bHasRef) return -1;
    
    return a.localeCompare(b);
  });
  
  for (const [name, definition] of sortedDefinitions) {
    console.log(`Processing ${name}...`);
    output += processDefinition(name, definition);
    output += '\n';
  }
  
  const outputDir = join(process.cwd(), 'src', 'types');
  const fs = await import('fs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  writeFileSync(outputPath, output);
  console.log(`\nGenerated TypeScript types at: ${outputPath}`);
  console.log(`Total definitions processed: ${Object.keys(swagger.definitions).length}`);
}

generateTypes();