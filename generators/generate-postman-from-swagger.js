import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerPath = path.join(__dirname, '..', 'data', 'swagger.json');
const swaggerAuthPath = path.join(__dirname, '..', 'data', 'swagger-auth.json');
const outputPath = path.join(__dirname, '..', 'postman', 'iNaturalist_API_Collection.postman_collection.json');

const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
const swaggerAuth = JSON.parse(fs.readFileSync(swaggerAuthPath, 'utf8'));

// Merge swagger files
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

// Also ensure tags are created for any paths that have tags
Object.entries(swaggerAuth.paths || {}).forEach(([path, methods]) => {
  Object.entries(methods).forEach(([method, endpoint]) => {
    if (endpoint.tags) {
      endpoint.tags.forEach(tag => {
        if (!swagger.tags.find(t => t.name === tag)) {
          swagger.tags.push({ name: tag, description: '' });
        }
      });
    }
  });
});

// Merge definitions for parameter references
swagger.definitions = {
  ...swagger.definitions,
  ...swaggerAuth.definitions
};

console.log('Tags after merge:', swagger.tags.map(t => t.name || t));

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
        value: "{{inat_api_token}}",
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
      // Special case: /users/api_token uses OAuth access token, not JWT
      const tokenVariable = path === '/users/api_token' ? '{{inat_access_token}}' : '{{inat_api_token}}';
      
      request.request.auth = {
        type: "bearer",
        bearer: [{
          key: "token",
          value: tokenVariable,
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
              disabled: true
            });
            break;
          case 'path':
            pathParams.push({
              key: param.name,
              value: '',
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
          { key: 'client_id', value: '', type: 'text' },
          { key: 'client_secret', value: '', type: 'text' },
          { key: 'code', value: '', type: 'text' },
          { key: 'redirect_uri', value: '', type: 'text' }
        ]
      };
      
      // Add post-response script
      request.event = [{
        listen: 'test',
        script: {
          type: 'text/javascript',
          exec: [
            'const responseJson = pm.response.text();',
            '',
            'if (responseJson) {',
            '  try {',
            '    const parsedJson = JSON.parse(responseJson);',
            '',
            '    if (parsedJson.access_token !== undefined) {',
            '      pm.globals.set(\'inat_access_token\', parsedJson.access_token);',
            '      pm.globals.set(\'inat_token_type\', parsedJson.token_type);',
            '      pm.globals.set(\'inat_token_scope\', parsedJson.scope);',
            '      pm.globals.set(\'inat_token_created_at\', parsedJson.created_at);',
            '    } else {',
            '      console.error(\'No access_token found in response\');',
            '      console.log(\'Response body:\', JSON.stringify(parsedJson, null, 2));',
            '    }',
            '  } catch (e) {',
            '    console.error(\'Failed to parse JSON:\', e);',
            '    console.log(\'Response body:\', responseJson);',
            '  }',
            '} else {',
            '  console.error(\'Empty response body\');',
            '}'
          ]
        }
      }];
    }

    // Build the URL object
    const urlParts = postmanPath.split('/').filter(p => p);
    
    // OAuth endpoints should use the full URL
    const isOAuthEndpoint = path.startsWith('/oauth/') || path === '/users/edit.json' || path === '/users/api_token';
    
    if (isOAuthEndpoint) {
      request.request.url = {
        raw: `https://www.inaturalist.org${postmanPath}`,
        host: ['https://www.inaturalist.org'],
        path: urlParts,
        query: queryParams.length > 0 ? queryParams : undefined
      };
    } else {
      request.request.url = {
        raw: `{{inat_base_url}}${postmanPath}`,
        host: ['{{inat_base_url}}'],
        path: urlParts,
        query: queryParams.length > 0 ? queryParams : undefined
      };
    }

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
    name: "iNaturalist API Collection",
    description: swagger.info.description,
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  auth: {
    type: "bearer",
    bearer: [{
      key: "token",
      value: "{{inat_api_token}}",
      type: "string"
    }]
  },
  variable: [
    {
      key: "inat_base_url",
      value: "https://api.inaturalist.org/v1",
      type: "string"
    },
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