import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerPath = path.join(__dirname, '..', 'data', 'swagger.json');
const outputPath = path.join(__dirname, '..', 'postman', 'iNaturalist_API_Collection_from_swagger.postman_collection.json');

const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

// Create folders for each tag
const folders = {};
swagger.tags.forEach(tag => {
  folders[tag.name] = {
    name: tag.name,
    description: tag.description,
    item: [],
    auth: {
      type: "bearer",
      bearer: [{
        key: "token",
        value: "{{jwt_api_token}}",
        type: "string"
      }]
    }
  };
});

// Convert Swagger paths to Postman requests
Object.entries(swagger.paths).forEach(([path, methods]) => {
  Object.entries(methods).forEach(([method, endpoint]) => {
    if (method === 'parameters') return; // Skip parameter definitions
    
    const tags = endpoint.tags || ['Uncategorized'];
    const tag = tags[0];
    
    // Convert path parameters from {id} to :id for Postman
    const postmanPath = path.replace(/{([^}]+)}/g, ':$1');
    
    // Build the request object
    const request = {
      name: endpoint.summary || `${method.toUpperCase()} ${path}`,
      request: {
        method: method.toUpperCase(),
        header: [],
        description: endpoint.description || '',
        url: `{{inat_base_url}}${postmanPath}`
      }
    };

    // Add authentication if required
    if (endpoint.security && endpoint.security.length > 0) {
      request.request.auth = {
        type: "bearer",
        bearer: [{
          key: "token",
          value: "{{jwt_api_token}}",
          type: "string"
        }]
      };
    }

    // Handle parameters
    const queryParams = [];
    const pathParams = [];
    const headerParams = [];
    let bodyContent = null;

    if (endpoint.parameters) {
      endpoint.parameters.forEach(param => {
        // Handle $ref parameters
        if (param.$ref) {
          const refName = param.$ref.split('/').pop();
          const actualParam = swagger.parameters ? swagger.parameters[refName] : null;
          if (actualParam) {
            param = actualParam;
          }
        }

        switch (param.in) {
          case 'query':
            queryParams.push({
              key: param.name,
              value: param.example || '',
              description: param.description || '',
              disabled: !param.required
            });
            break;
          case 'path':
            pathParams.push({
              key: param.name,
              value: `{{${param.name}}}`,
              description: param.description || ''
            });
            break;
          case 'header':
            headerParams.push({
              key: param.name,
              value: param.example || '',
              type: 'text',
              description: param.description || ''
            });
            break;
          case 'body':
            if (param.schema) {
              let exampleBody = {};
              if (param.schema.$ref) {
                const defName = param.schema.$ref.split('/').pop();
                const definition = swagger.definitions[defName];
                if (definition && definition.properties) {
                  // Create example body from schema
                  Object.entries(definition.properties).forEach(([prop, propDef]) => {
                    if (propDef.example !== undefined) {
                      exampleBody[prop] = propDef.example;
                    } else if (propDef.type === 'string') {
                      exampleBody[prop] = '';
                    } else if (propDef.type === 'number' || propDef.type === 'integer') {
                      exampleBody[prop] = 0;
                    } else if (propDef.type === 'boolean') {
                      exampleBody[prop] = false;
                    } else if (propDef.type === 'array') {
                      exampleBody[prop] = [];
                    } else if (propDef.type === 'object') {
                      exampleBody[prop] = {};
                    }
                  });
                }
              }
              bodyContent = {
                mode: 'raw',
                raw: JSON.stringify(exampleBody, null, 2),
                options: {
                  raw: {
                    language: 'json'
                  }
                }
              };
            }
            break;
          case 'formData':
            if (!bodyContent) {
              bodyContent = {
                mode: 'urlencoded',
                urlencoded: []
              };
            }
            if (bodyContent.mode === 'urlencoded') {
              bodyContent.urlencoded.push({
                key: param.name,
                value: param.example || '',
                description: param.description || '',
                type: 'text',
                disabled: !param.required
              });
            }
            break;
        }
      });
    }

    // Special handling for OAuth endpoint
    if (path === '/oauth/token' && method === 'post') {
      request.request.header.push({
        key: 'Content-Type',
        value: 'application/x-www-form-urlencoded',
        type: 'text'
      });
      bodyContent = {
        mode: 'urlencoded',
        urlencoded: [
          { key: 'grant_type', value: 'authorization_code', type: 'text' },
          { key: 'client_id', value: '{{client_id}}', type: 'text' },
          { key: 'client_secret', value: '{{client_secret}}', type: 'text' },
          { key: 'code', value: '{{authorization_code}}', type: 'text' },
          { key: 'redirect_uri', value: '{{redirect_uri}}', type: 'text' }
        ]
      };
    }

    // Build the URL object
    const urlParts = postmanPath.split('/').filter(p => p);
    request.request.url = {
      raw: `{{inat_base_url}}${postmanPath}`,
      host: ['{{inat_base_url}}'],
      path: urlParts,
      query: queryParams.length > 0 ? queryParams : undefined
    };

    // Add headers
    if (headerParams.length > 0) {
      request.request.header = request.request.header.concat(headerParams);
    }

    // Add body
    if (bodyContent) {
      request.request.body = bodyContent;
    }

    // Add content-type header for JSON bodies
    if (bodyContent && bodyContent.mode === 'raw') {
      request.request.header.push({
        key: 'Content-Type',
        value: 'application/json',
        type: 'text'
      });
    }

    // Add path variables
    if (pathParams.length > 0) {
      request.request.url.variable = pathParams;
    }

    // Add to appropriate folder
    if (folders[tag]) {
      folders[tag].item.push(request);
    }
  });
});

// Create the Postman collection
const collection = {
  info: {
    name: "iNaturalist API v1 (Complete from Swagger)",
    description: swagger.info.description,
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  auth: {
    type: "bearer",
    bearer: [{
      key: "token",
      value: "{{jwt_api_token}}",
      type: "string"
    }]
  },
  variable: [
    {
      key: "inat_base_url",
      value: "https://api.inaturalist.org/v1",
      type: "string"
    },
    {
      key: "jwt_api_token",
      value: "",
      type: "string",
      description: "JWT token obtained from /users/api_token endpoint"
    },
    {
      key: "client_id",
      value: "",
      type: "string",
      description: "OAuth client ID"
    },
    {
      key: "client_secret",
      value: "",
      type: "string",
      description: "OAuth client secret"
    },
    {
      key: "authorization_code",
      value: "",
      type: "string",
      description: "OAuth authorization code"
    },
    {
      key: "redirect_uri",
      value: "",
      type: "string", 
      description: "OAuth redirect URI"
    }
  ],
  item: Object.values(folders).filter(folder => folder.item.length > 0).sort((a, b) => a.name.localeCompare(b.name))
};

// Create output directory if it doesn't exist
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the collection
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2));

console.log(`✅ Generated Postman collection with ${collection.item.length} folders and ${collection.item.reduce((sum, folder) => sum + folder.item.length, 0)} requests`);
console.log(`📄 Output: ${outputPath}`);