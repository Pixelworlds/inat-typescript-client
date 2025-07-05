# iNaturalist TypeScript SDK

<div align="center">
  <img src="https://github.com/user-attachments/assets/52fe66af-3a88-4ea2-9a14-e9528cfdeec7" alt="iNaturalist TypeScript SDK Logo" width="200">
</div>
<br />

A comprehensive TypeScript SDK for the iNaturalist API, providing type-safe access to all API endpoints for observations, identifications, taxa, and more.

## Documentation

This SDK includes comprehensive documentation and tools:

- [iNaturalist API Documentation](docs/API.md) - Complete API reference with all endpoints
- [TypeScript Client Modules](typescript/) - Generated TypeScript modules for all API categories
- [Postman Collection](postman/iNaturalist_API_Collection.postman_collection.json) - Pre-built collection for API testing

## Installation

```bash
npm install @richard-stovall/inat-typescript-client
# or
yarn add @richard-stovall/inat-typescript-client
# or
bun add @richard-stovall/inat-typescript-client
```

## Quick Start

```typescript
import { INaturalistClient } from '@richard-stovall/inat-typescript-client';

// For public data (no authentication needed)
const client = new INaturalistClient('https://api.inaturalist.org/v1');

// Get public observations
const observations = await client.observations.get_observations();
console.log(observations.data);

// Get specific observation
const observation = await client.observations.get_observations_id(12345);

// For authenticated requests, use OAuth access token
const authenticatedClient = new INaturalistClient('https://api.inaturalist.org/v1', 'your-oauth-access-token');

// Get user-specific data (requires authentication)
const userObservations = await authenticatedClient.observations.get_observations({ 
  user_login: 'your-username' 
});
```

## Features

- **Type-safe**: Full TypeScript support with detailed type definitions
- **Complete Coverage**: Supports all 40+ iNaturalist API endpoints
- **OAuth Support**: Built-in OAuth 2.0 authentication flow
- **Modern**: Built with async/await and modern JavaScript features
- **Tree-shakable**: Import only the modules you need

## Authentication

The iNaturalist API supports multiple authentication methods:

### 1. No Authentication (Public Data Only)

```typescript
const client = new INaturalistClient('https://api.inaturalist.org/v1');

// Access public observations, projects, etc.
const observations = await client.observations.get_observations();
```

### 2. OAuth 2.0 Flow (Recommended for User Data)

**⚠️ Important:** Use different domains for OAuth vs API calls!

```typescript
// Step 1: Get OAuth access token (use main domain)
const authClient = new INaturalistClient('https://www.inaturalist.org');

const formData = new URLSearchParams();
formData.append('grant_type', 'password');
formData.append('username', 'your-username');
formData.append('password', 'your-password');
formData.append('client_id', 'your-client-id');
formData.append('client_secret', 'your-client-secret');

const oauthResponse = await authClient.authentication.http.post('/oauth/token', formData.toString(), {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  }
});

// Step 2: Use OAuth access token for general API calls (use API subdomain)
const apiClient = new INaturalistClient('https://api.inaturalist.org/v1');
apiClient.setApiToken(oauthResponse.data.access_token);

// General API calls work with OAuth token
const observations = await apiClient.observations.get_observations();
const projects = await apiClient.projects.get_projects();

// Step 3: Get JWT token for user profile data
authClient.setApiToken(oauthResponse.data.access_token);
const jwtResponse = await authClient.authentication.http.get('/users/api_token', {
  headers: {
    'Authorization': `Bearer ${oauthResponse.data.access_token}`,
    'Accept': 'application/json'
  }
});

// Step 4: Use JWT token for detailed user profile
const profileClient = new INaturalistClient('https://api.inaturalist.org/v1');
profileClient.setApiToken(jwtResponse.data.api_token);

const userProfile = await profileClient.users.get_users_me();
console.log('User details:', userProfile.data);
```

### 3. Pre-existing API Token

If you already have an OAuth access token:

```typescript
const client = new INaturalistClient('https://api.inaturalist.org/v1', 'your-oauth-access-token');
```

### Token Management

```typescript
// Set OAuth access token (recommended)
client.setApiToken('your-oauth-access-token');

// Remove API token
client.removeApiToken();
```

### ⚠️ Important Notes

1. **Domain Requirements:**
   - OAuth authentication: `https://www.inaturalist.org`
   - API calls: `https://api.inaturalist.org/v1`

2. **Token Types:**
   - **OAuth Access Token** (43 characters): Use for general API calls (observations, projects, etc.)
   - **JWT API Token** (191+ characters): Use specifically for `/users/me` and detailed user profile data
   - **Best Practice**: Use both tokens for different purposes rather than choosing one

3. **Form Encoding:**
   - OAuth requests require `application/x-www-form-urlencoded` content type
   - Use `URLSearchParams` for proper encoding

## API Categories

The SDK organizes endpoints into logical categories:

### Core Data

- **observations** - Submit, search, and manage observations
- **identifications** - Add and manage species identifications
- **users** - User profiles and management
- **places** - Geographic place data

### Project Management

- **projects** - iNaturalist projects and challenges
- **project_observations** - Project-specific observations

### Data Enhancement

- **comments** - Comments on observations
- **observation_fields** - Custom data fields for observations
- **observation_field_values** - Values for custom fields
- **observation_photos** - Photo management for observations

### Authentication

- **authentication** - OAuth and API token management

## Usage Examples

### Working with Observations

```typescript
// Get recent observations
const recent = await client.observations.get_observations();

// Get observations by user
const userObs = await client.observations.get_observations_username('username');

// Get observations from a project
const projectObs = await client.observations.get_observations_project_id(12345);

// Create new observation (requires authentication)
const newObs = await client.observations.post_observations({
  observation: {
    species_guess: 'Mallard',
    observed_on: '2023-12-01',
    latitude: 40.7128,
    longitude: -74.006,
  },
});
```

### Managing Identifications

```typescript
// Add identification (requires authentication)
const identification = await client.identifications.post_identifications({
  identification: {
    observation_id: 12345,
    taxon_id: 6888,
    body: 'This looks like a Mallard duck',
  },
});

// Update identification
await client.identifications.put_identifications_id(identification.id, {
  body: 'Updated identification comment',
});
```

### Project Interaction

```typescript
// Get project details
const project = await client.projects.get_projects_id(12345);

// Join project (requires authentication)
await client.projects.post_projects_id_join(12345);

// Leave project (requires authentication)
await client.projects.delete_projects_id_leave(12345);
```

### User Management

```typescript
// Get user profile (requires authentication)
const profile = await client.users.get_users_edit();

// Update user settings (requires authentication)
await client.users.put_users_id(userId, {
  user: {
    description: 'Updated bio',
  },
});
```

## Error Handling

```typescript
try {
  const observations = await client.observations.get_observations();
  console.log('Success:', observations.data);
} catch (error) {
  if (error.response) {
    // API returned an error response
    console.error('API Error:', error.response.status, error.response.data);
  } else if (error.request) {
    // Network error
    console.error('Network Error:', error.message);
  } else {
    // Other error
    console.error('Error:', error.message);
  }
}
```

## Postman Collection

A pre-built Postman collection is available for testing and exploring the API:

**File**: `postman/iNaturalist_API_Collection.postman_collection.json`

### Usage

1. Import the collection into Postman
2. Set up environment variables:
   - `inat_base_url` - https://api.inaturalist.org/v1
   - `inat_api_token` - Your API token
   - `inat_client_id` - Your OAuth client ID (for OAuth flow)
   - `inat_client_secret` - Your OAuth client secret
   - `inat_username` - Your username (for OAuth flow)
   - `inat_password` - Your password (for OAuth flow)
3. Start making requests

The collection includes automatic OAuth token exchange and API token retrieval.

## TypeScript Support

The SDK provides full TypeScript definitions for all endpoints:

```typescript
import { INaturalistClient, type AxiosResponse } from '@richard-stovall/inat-typescript-client';

const client = new INaturalistClient();

// TypeScript provides autocomplete and type checking
const response: AxiosResponse<any> = await client.observations.get_observations();
```

## Development

To contribute to the SDK or generate updated modules:

```bash
# Install dependencies
bun install

# Generate TypeScript modules from Postman collection
bun run generate:modules

# Generate API documentation
bun run generate:docs

# Generate Postman collection from Swagger specs
bun run generate:postman

# Parse Swagger specifications
bun run parse:swagger

# Build the SDK
bun run build

# Lint code
bun run lint

# Type checking
bun run type-check
```

## Build System

The SDK uses Rollup for building and supports multiple output formats:

- **CommonJS**: `dist/index.cjs` - For Node.js environments
- **ESM**: `dist/index.js` - For modern JavaScript environments
- **TypeScript Definitions**: `dist/index.d.ts` - For TypeScript support

## Requirements

- Node.js 16+ or Bun runtime
- TypeScript 5.0+ (for development)
- Internet access to iNaturalist API

## API Rate Limits

Please be mindful of iNaturalist's API rate limits:

- Authenticated requests: Higher rate limits
- Unauthenticated requests: Lower rate limits
- Consider implementing request throttling for high-volume applications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- [iNaturalist](https://www.inaturalist.org/) for providing the comprehensive API
- Built with [Bun](https://bun.sh) for fast development and building

## About the Author

This SDK was created by [Richard Stovall](https://www.inaturalist.org/people/arctic_mongoose) and iNaturalist member.
