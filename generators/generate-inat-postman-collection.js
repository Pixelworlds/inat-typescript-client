#!/usr/bin/env bun

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

const INPUT_FILE = join(process.cwd(), 'inat-api-endpoints.json');
const OUTPUT_FILE = join(process.cwd(), 'postman', 'iNaturalist_API_Collection.postman_collection.json');

const ENDPOINT_GROUPS = {
  authentication: ['oauth', 'users/api_token', 'users/edit', 'users/new_updates'],
  comments: ['comments'],
  identifications: ['identifications'],
  observation_field_values: ['observation_field_values'],
  observation_fields: ['observation_fields'],
  observation_photos: ['observation_photos'],
  observations: ['observations'],
  places: ['places'],
  project_observations: ['project_observations'],
  projects: ['projects'],
  users: ['users'],
};

function loadEndpointsData() {
  if (!existsSync(INPUT_FILE)) {
    throw new Error(`Input file not found: ${INPUT_FILE}`);
  }

  const data = JSON.parse(readFileSync(INPUT_FILE, 'utf8'));
  return data.endpoints || [];
}

function convertUrlParameters(url) {
  let convertedUrl = url;
  const pathParams = [];

  const paramRegex = /\{\{([^}]+)\}\}/g;
  let match;

  while ((match = paramRegex.exec(url)) !== null) {
    const paramName = match[1];
    convertedUrl = convertedUrl.replace(`{{${paramName}}}`, `:${paramName}`);
    if (!pathParams.find(p => p.key === paramName)) {
      pathParams.push({
        key: paramName,
        value: `{{${paramName}}}`,
        description: `Parameter: ${paramName}`,
      });
    }
  }

  const colonParamRegex = /:([a-zA-Z_][a-zA-Z0-9_]*)/g;
  while ((match = colonParamRegex.exec(convertedUrl)) !== null) {
    const paramName = match[1];
    if (!pathParams.find(p => p.key === paramName)) {
      pathParams.push({
        key: paramName,
        value: `{{${paramName}}}`,
        description: `Parameter: ${paramName}`,
      });
    }
  }

  return { convertedUrl, pathParams };
}

function buildPostmanRequest(endpoint) {
  const { convertedUrl, pathParams } = convertUrlParameters(endpoint.endpoint.url);

  const request = {
    method: endpoint.endpoint.method,
    header: [],
    description: endpoint.endpoint.description || `${endpoint.endpoint.method} ${endpoint.endpoint.url}`,
  };

  if (endpoint.authentication) {
    if (endpoint.authentication.type === 'oauth') {
      request.header.push({
        key: 'Authorization',
        value: 'Bearer {{access_token}}',
        type: 'text',
      });
    } else if (endpoint.authentication.type === 'required') {
      request.header.push({
        key: 'Authorization',
        value: 'Bearer {{api_token}}',
        type: 'text',
      });
    }
  }

  if (['POST', 'PUT', 'PATCH'].includes(endpoint.endpoint.method)) {
    request.header.push({
      key: 'Content-Type',
      value: 'application/json',
      type: 'text',
    });
  }

  let fullUrl = `{{inat_base_url}}${convertedUrl}`;

  if (endpoint.parameters && endpoint.parameters.query && endpoint.parameters.query.length > 0) {
    const queryParams = endpoint.parameters.query.map(param => `${param.name}=`).join('&');
    fullUrl += `?${queryParams}`;
  }

  request.url = fullUrl;

  if (['POST', 'PUT', 'PATCH'].includes(endpoint.endpoint.method)) {
    if (endpoint.request && endpoint.request.payload) {
      request.body = {
        mode: 'raw',
        raw: JSON.stringify(endpoint.request.payload, null, 2),
        options: {
          raw: {
            language: 'json',
          },
        },
      };
    } else {
      request.body = {
        mode: 'raw',
        raw: JSON.stringify({}, null, 2),
        options: {
          raw: {
            language: 'json',
          },
        },
      };
    }
  }

  return request;
}

function categorizeEndpoint(endpoint) {
  const url = endpoint.endpoint.url.toLowerCase();

  if (endpoint.endpoint.section === 'Authentication') {
    return 'authentication';
  }

  for (const [category, patterns] of Object.entries(ENDPOINT_GROUPS)) {
    for (const pattern of patterns) {
      if (url.includes(pattern)) {
        return category;
      }
    }
  }

  return 'other';
}

function buildPostmanCollection(endpoints) {
  const collection = {
    info: {
      name: 'iNaturalist API Collection',
      description: `Auto-generated Postman collection for iNaturalist API endpoints.

IMPORTANT: Before using this collection, you MUST configure the following variables in your Postman environment:

- inat_base_url: The iNaturalist base URL (https://www.inaturalist.org)
- access_token: Your OAuth access token for authenticated requests
- api_token: Your API token for authenticated requests

For OAuth endpoints, you'll also need:
- client_id: Your OAuth application client ID
- client_secret: Your OAuth application client secret
- redirect_uri: Your OAuth application redirect URI

To create an environment:
1. Click the environment dropdown (top right in Postman)
2. Select "Manage Environments"
3. Click "Add" to create a new environment
4. Add the variables mentioned above with your actual values
5. Select your environment from the dropdown before running requests`,
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      _postman_id: 'inat-api-collection',
    },
    item: [],
    variable: [
      {
        key: 'inat_base_url',
        value: 'https://www.inaturalist.org',
        type: 'string',
      },
    ],
    event: [
      {
        listen: 'prerequest',
        script: {
          type: 'text/javascript',
          exec: ['// This script runs before every request in the collection'],
        },
      },
    ],
  };

  const categorizedEndpoints = {};

  endpoints.forEach(endpoint => {
    const category = categorizeEndpoint(endpoint);
    if (!categorizedEndpoints[category]) {
      categorizedEndpoints[category] = [];
    }
    categorizedEndpoints[category].push(endpoint);
  });

  const categoryOrder = [
    'authentication',
    'comments',
    'identifications',
    'observation_field_values',
    'observation_fields',
    'observation_photos',
    'observations',
    'places',
    'project_observations',
    'projects',
    'users',
    'other',
  ];

  categoryOrder.forEach(category => {
    if (categorizedEndpoints[category]) {
      const folder = {
        name: category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' '),
        item: [],
      };

      categorizedEndpoints[category].forEach(endpoint => {
        const request = buildPostmanRequest(endpoint);
        const endpointName = endpoint.endpoint.url.split('/').pop() || endpoint.endpoint.url;

        folder.item.push({
          name: `${endpoint.endpoint.method} ${endpointName}`,
          request: request,
          response: [],
        });
      });

      collection.item.push(folder);
    }
  });

  return collection;
}

function main() {
  console.log('Loading iNaturalist API endpoints...');
  const endpoints = loadEndpointsData();
  console.log(`Found ${endpoints.length} endpoints`);

  console.log('Building Postman collection...');
  const collection = buildPostmanCollection(endpoints);

  const outputDir = dirname(OUTPUT_FILE);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Writing collection to ${OUTPUT_FILE}...`);
  writeFileSync(OUTPUT_FILE, JSON.stringify(collection, null, 2));

  console.log('iNaturalist Postman collection generated successfully!');
  console.log(`Output: ${OUTPUT_FILE}`);
  console.log(`Total endpoints: ${endpoints.length}`);
  console.log(`Categories: ${collection.item.length}`);
}

main();
