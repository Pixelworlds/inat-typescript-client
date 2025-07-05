#!/usr/bin/env bun

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { parseAllSpecs } from './parse-swagger-specs.js';

class PostmanCollectionGenerator {
  constructor() {
    this.config = {
      inputFile: join(process.cwd(), 'data', 'inat-api-endpoints.json'),
      outputFile: join(process.cwd(), 'postman', 'iNaturalist_API_Collection.postman_collection.json'),
      baseUrl: '{{inat_base_url}}',
      oauthBaseUrl: 'https://www.inaturalist.org',
    };

    this.endpointLoader = new EndpointLoader(this.config);
    this.authHandler = new AuthenticationHandler();
    this.requestBuilder = new RequestBuilder(this.config, this.authHandler);
    this.collectionBuilder = new CollectionBuilder();
  }

  async generate() {
    console.log('Loading iNaturalist API endpoints...');
    const endpoints = await this.endpointLoader.loadEndpoints();
    console.log(`Found ${endpoints.length} endpoints`);

    console.log('Building Postman collection...');
    const collection = this.collectionBuilder.buildCollection(endpoints, this.requestBuilder);

    this._ensureOutputDirectory();
    this._writeCollection(collection);

    console.log('iNaturalist Postman collection generated successfully!');
    console.log(`Output: ${this.config.outputFile}`);
    console.log(`Total endpoints: ${endpoints.length}`);
    console.log(`Categories: ${collection.item.length}`);
  }

  _ensureOutputDirectory() {
    const outputDir = dirname(this.config.outputFile);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
  }

  _writeCollection(collection) {
    console.log(`Writing collection to ${this.config.outputFile}...`);
    writeFileSync(this.config.outputFile, JSON.stringify(collection, null, 2));
  }
}

class EndpointLoader {
  constructor(config) {
    this.config = config;
  }

  async loadEndpoints() {
    let endpoints = [];

    if (!existsSync(this.config.inputFile)) {
      console.log('📋 No cached endpoints found, parsing from Swagger specs...');
      const result = await parseAllSpecs();
      endpoints = result.endpoints || [];
    } else {
      const data = JSON.parse(readFileSync(this.config.inputFile, 'utf8'));
      endpoints = this._normalizeEndpointFormat(data.endpoints || []);
    }

    return this._addCustomEndpoints(endpoints);
  }

  _normalizeEndpointFormat(endpoints) {
    if (!Array.isArray(endpoints) || endpoints.length === 0) {
      return [];
    }

    //
    if (endpoints[0].url) {
      return endpoints;
    }

    if (endpoints[0].endpoint) {
      return endpoints.map(item => ({
        url: item.endpoint.url,
        method: item.endpoint.method,
        summary: item.endpoint.description || '',
        description: item.endpoint.description || '',
        tags: [item.endpoint.section || 'Other'],
        section: item.endpoint.section || 'Other',
        parameters: item.parameters?.query || [],
        requiresAuth: item.authentication?.required || false,
        authentication: item.authentication,
      }));
    }

    return [];
  }

  _addCustomEndpoints(endpoints) {
    const jwtTokenEndpoint = {
      url: '/users/api_token',
      method: 'GET',
      summary: 'Get JWT Token',
      description: 'Obtain a JWT token using OAuth authentication. Each JWT expires after 24 hours.',
      tags: ['Users'],
      section: 'Users',
      requiresAuth: true,
      authentication: { type: 'oauth' },
      parameters: [],
    };

    const jwtExists = endpoints.some(ep => ep.url === '/users/api_token');
    if (!jwtExists) {
      endpoints.push(jwtTokenEndpoint);
    }

    return endpoints;
  }
}

class AuthenticationHandler {
  constructor() {
    this.oauthEndpoints = ['/oauth/authorize', '/oauth/token'];
    this.jwtEndpoint = '/users/api_token';
  }

  isOAuthEndpoint(url) {
    return this.oauthEndpoints.includes(url);
  }

  isJWTEndpoint(url) {
    return url === this.jwtEndpoint;
  }

  shouldUseOAuthBaseUrl(url) {
    return this.isOAuthEndpoint(url) || this.isJWTEndpoint(url);
  }

  getAuthHeaders(endpoint) {
    const headers = [];

    if (endpoint.authentication?.type === 'oauth') {
      headers.push({
        key: 'Authorization',
        value: 'Bearer {{access_token}}',
        type: 'text',
      });
    } else if (endpoint.authentication?.type === 'required') {
      headers.push({
        key: 'Authorization',
        value: 'Bearer {{api_token}}',
        type: 'text',
      });
    }

    return headers;
  }

  getAuthConfig(endpoint) {
    if (this.isOAuthEndpoint(endpoint.url)) {
      return { type: 'noauth' };
    }

    if (this.isJWTEndpoint(endpoint.url)) {
      return {
        type: 'bearer',
        bearer: [
          {
            key: 'token',
            value: '{{inat_access_token}}',
            type: 'string',
          },
        ],
      };
    }

    if (endpoint.requiresAuth === false) {
      return { type: 'noauth' };
    }

    return null;
  }

  getOAuthTokenScript() {
    return [
      'const responseJson = pm.response.text();',
      '',
      'if (responseJson) {',
      '  try {',
      '    const parsedJson = JSON.parse(responseJson);',
      '',
      '    if (parsedJson.access_token !== undefined) {',
      "      pm.globals.set('inat_access_token', parsedJson.access_token);",
      "      pm.globals.set('inat_token_type', parsedJson.token_type);",
      "      pm.globals.set('inat_token_scope', parsedJson.scope);",
      "      pm.globals.set('inat_token_created_at', parsedJson.created_at);",
      '      ',
      '      // Now make the second request with the access token',
      '      pm.sendRequest({',
      "        url: 'https://www.inaturalist.org/users/api_token',",
      "        method: 'GET',",
      '        header: {',
      "          'Authorization': `Bearer ${parsedJson.access_token}`,",
      "          'Accept': 'application/json'",
      '        }',
      '      }, function (err, response) {',
      '        if (err) {',
      "          console.error('Failed to get JWT token:', err);",
      '        } else {',
      '          const responseJson = response.text();',
      '          if (responseJson) {',
      '            try {',
      '              const parsedJson = JSON.parse(responseJson);',
      '              ',
      '              if (parsedJson.api_token !== undefined) {',
      "                pm.globals.set('inat_api_token', parsedJson.api_token);",
      "                console.log('JWT token retrieved and saved to inat_api_token');",
      '              } else {',
      "                console.error('No api_token found in response');",
      "                console.log('Response body:', JSON.stringify(parsedJson, null, 2));",
      '              }',
      '            } catch (e) {',
      "              console.error('Failed to parse JSON:', e);",
      "              console.log('Response body:', responseJson);",
      '            }',
      '          } else {',
      "            console.error('Empty response body');",
      '          }',
      '        }',
      '      });',
      '    } else {',
      "      console.error('No access_token found in response');",
      "      console.log('Response body:', JSON.stringify(parsedJson, null, 2));",
      '    }',
      '  } catch (e) {',
      "    console.error('Failed to parse JSON:', e);",
      "    console.log('Response body:', responseJson);",
      '  }',
      '} else {',
      "  console.error('Empty response body');",
      '}',
    ];
  }
}

class RequestBuilder {
  constructor(config, authHandler) {
    this.config = config;
    this.authHandler = authHandler;
  }

  buildRequest(endpoint) {
    const { convertedUrl } = this._convertUrlParameters(endpoint.url);

    const request = {
      method: endpoint.method,
      header: this._buildHeaders(endpoint),
      description: endpoint.summary || endpoint.description || `${endpoint.method} ${endpoint.url}`,
      url: this._buildUrl(endpoint, convertedUrl),
    };

    if (['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
      request.body = this._buildRequestBody(endpoint);
    }

    const authConfig = this.authHandler.getAuthConfig(endpoint);
    if (authConfig) {
      request.auth = authConfig;
    }

    return request;
  }

  _convertUrlParameters(url) {
    let convertedUrl = url;
    const pathParams = [];

    const paramRegex = /\{\{?([^}]+)\}?\}/g;
    let match;

    while ((match = paramRegex.exec(url)) !== null) {
      const paramName = match[1];
      const replacement = `:${paramName}`;
      convertedUrl = convertedUrl.replace(match[0], replacement);

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

  _buildHeaders(endpoint) {
    const headers = [];

    headers.push(...this.authHandler.getAuthHeaders(endpoint));

    const isTileEndpoint = endpoint.url.includes('.png') || endpoint.url.includes('.grid.json');
    if (!isTileEndpoint) {
      headers.push({
        key: 'Accept',
        value: 'application/json',
        type: 'text',
      });
    }

    if (['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
      const contentType = this.authHandler.isOAuthEndpoint(endpoint.url)
        ? 'application/x-www-form-urlencoded'
        : 'application/json';

      headers.push({
        key: 'Content-Type',
        value: contentType,
        type: 'text',
      });
    }

    return headers;
  }

  _buildUrl(endpoint, convertedUrl) {
    const baseUrl = this.authHandler.shouldUseOAuthBaseUrl(endpoint.url)
      ? this.config.oauthBaseUrl
      : this.config.baseUrl;

    let fullUrl = `${baseUrl}${convertedUrl}`;

    if (endpoint.parameters?.length > 0 && endpoint.url !== '/oauth/token') {
      const queryParams = endpoint.parameters.map(param => `${param.name}=`).join('&');
      fullUrl += `?${queryParams}`;
    }

    return fullUrl;
  }

  _buildRequestBody(endpoint) {
    if (this.authHandler.isOAuthEndpoint(endpoint.url)) {
      return this._buildOAuthBody(endpoint);
    }

    return this._buildJsonBody(endpoint);
  }

  _buildOAuthBody(endpoint) {
    if (endpoint.url === '/oauth/token') {
      return {
        mode: 'urlencoded',
        urlencoded: [
          { key: 'grant_type', value: '{{inat_grant_type}}', type: 'text' },
          { key: 'client_id', value: '{{inat_client_id}}', type: 'text' },
          { key: 'client_secret', value: '{{inat_client_secret}}', type: 'text' },
          { key: 'username', value: '{{inat_username}}', type: 'text' },
          { key: 'password', value: '{{inat_password}}', type: 'text' },
        ],
      };
    }

    return {
      mode: 'urlencoded',
      urlencoded: [],
    };
  }

  _buildJsonBody(endpoint) {
    const payload = endpoint.request?.payload || {};

    return {
      mode: 'raw',
      raw: JSON.stringify(payload, null, 2),
      options: {
        raw: { language: 'json' },
      },
    };
  }
}

class CollectionBuilder {
  constructor() {
    this.endpointGroups = {
      authentication: ['oauth'],
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

    this.priorityCategories = [
      'authentication',
      'observations',
      'annotations',
      'controlled_terms',
      'taxa',
      'identifications',
      'users',
      'projects',
      'posts',
      'project_observations',
      'places',
      'comments',
      'votes',
      'flags',
      'messages',
      'subscriptions',
      'observation_fields',
      'observation_field_values',
      'observation_photos',
      'photos',
      'sounds',
    ];
  }

  buildCollection(endpoints, requestBuilder) {
    const collection = this._createBaseCollection();
    const categorizedEndpoints = this._categorizeEndpoints(endpoints);
    const categoryOrder = this._getCategoryOrder(categorizedEndpoints);

    categoryOrder.forEach(category => {
      if (categorizedEndpoints[category]) {
        const folder = this._buildFolder(category, categorizedEndpoints[category], requestBuilder);
        collection.item.push(folder);
      }
    });

    return collection;
  }

  _createBaseCollection() {
    return {
      info: {
        name: 'iNaturalist API Collection',
        description: `Auto-generated Postman collection for iNaturalist API endpoints.

IMPORTANT: Before using this collection, you MUST configure the following variables in your Postman environment:

- inat_base_url: The iNaturalist API base URL (https://api.inaturalist.org/v1)
- inat_api_token: Your API token for authenticated requests

For OAuth endpoints, you'll also need:
- inat_client_id: Your OAuth application client ID
- inat_client_secret: Your OAuth application client secret
- inat_redirect_uri: Your OAuth application redirect URI

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
      variable: [],
      auth: {
        type: 'bearer',
        bearer: [
          {
            key: 'token',
            value: '{{inat_api_token}}',
            type: 'string',
          },
        ],
      },
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
  }

  _categorizeEndpoints(endpoints) {
    const categorized = {};

    endpoints.forEach(endpoint => {
      const category = this._getEndpointCategory(endpoint);
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push(endpoint);
    });

    return categorized;
  }

  _getEndpointCategory(endpoint) {
    const url = endpoint.url.toLowerCase();
    const pathSegments = url.split('/').filter(segment => segment.length > 0);
    const firstSegment = pathSegments[0];

    if (!firstSegment) return 'other';

    if (
      firstSegment === 'oauth' ||
      endpoint.section === 'Authentication' ||
      endpoint.tags?.includes('Authentication')
    ) {
      return 'authentication';
    }

    for (const [category, patterns] of Object.entries(this.endpointGroups)) {
      for (const pattern of patterns) {
        if (firstSegment === pattern || firstSegment.startsWith(pattern)) {
          return category;
        }
      }
    }

    return firstSegment;
  }

  _getCategoryOrder(categorizedEndpoints) {
    const allCategories = Object.keys(categorizedEndpoints);

    return [
      ...this.priorityCategories.filter(cat => allCategories.includes(cat)),
      ...allCategories.filter(cat => !this.priorityCategories.includes(cat)).sort(),
      'other',
    ].filter(cat => categorizedEndpoints[cat]);
  }

  _buildFolder(category, endpoints, requestBuilder) {
    const folder = {
      name: category
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      item: [],
    };

    endpoints.forEach(endpoint => {
      const item = this._buildFolderItem(endpoint, requestBuilder);
      folder.item.push(item);
    });

    return folder;
  }

  _buildFolderItem(endpoint, requestBuilder) {
    const request = requestBuilder.buildRequest(endpoint);
    const displayName = this._getDisplayName(endpoint);

    const item = {
      name: displayName,
      request: request,
      response: [],
    };

    if (endpoint.url === '/oauth/token' && endpoint.method === 'POST') {
      item.event = [
        {
          listen: 'test',
          script: {
            type: 'text/javascript',
            exec: new AuthenticationHandler().getOAuthTokenScript(),
          },
        },
      ];
    }

    return item;
  }

  _getDisplayName(endpoint) {
    let descriptiveName = endpoint.url.replace(/^\//, '').replace(/\{([^}]+)\}/g, '{$1}');

    let displayName = descriptiveName;
    if (endpoint.summary?.trim()) {
      displayName = `${descriptiveName} - ${endpoint.summary}`;
    }

    return displayName.length > 80 ? displayName.substring(0, 77) + '...' : displayName;
  }
}

const generator = new PostmanCollectionGenerator();
await generator.generate();
