# Authentication Guide

This guide provides detailed instructions for authenticating with the iNaturalist API using this TypeScript SDK.

## Overview

The iNaturalist API supports different levels of access:

- **Public data**: No authentication required
- **User data**: OAuth authentication required
- **Write operations**: OAuth authentication required

## Authentication Methods

### 1. No Authentication (Public Data)

For accessing public observations, projects, and other publicly available data:

```typescript
import { INaturalistClient } from '@richard-stovall/inat-typescript-client';

const client = new INaturalistClient('https://api.inaturalist.org/v1');

// Get public observations
const observations = await client.observations.get_observations();

// Get public projects
const projects = await client.projects.get_projects();
```

### 2. OAuth 2.0 Authentication

For accessing user-specific data or performing write operations, you need OAuth authentication.

#### Prerequisites

1. Register your application at: https://www.inaturalist.org/oauth/applications
2. Get your `client_id` and `client_secret`
3. Have your iNaturalist username and password

#### Complete Authentication Flow

```typescript
import { INaturalistClient } from '@richard-stovall/inat-typescript-client';

async function authenticateWithiNaturalist(username, password, clientId, clientSecret) {
  // Step 1: Create auth client (use main domain)
  const authClient = new INaturalistClient('https://www.inaturalist.org');
  
  // Step 2: Get OAuth access token using the convenient method
  // Note: The SDK automatically handles form-encoding for OAuth requests
  const oauthResponse = await authClient.authentication.post_oauth_token({
    grant_type: 'password',
    username: username,
    password: password,
    client_id: clientId,
    client_secret: clientSecret
  });

  // Step 3: Create API client with access token (use API subdomain)
  const apiClient = new INaturalistClient('https://api.inaturalist.org/v1');
  apiClient.setApiToken(oauthResponse.data.access_token);

  return {
    client: apiClient,
    accessToken: oauthResponse.data.access_token,
    tokenType: oauthResponse.data.token_type,
    scope: oauthResponse.data.scope
  };
}

// Usage
const auth = await authenticateWithiNaturalist('your-username', 'your-password', 'your-client-id', 'your-client-secret');

// Now you can make authenticated requests
const userObservations = await auth.client.observations.get_observations({ 
  user_login: 'your-username' 
});
```

#### Simplified Flow (If You Have a Token)

If you already have an OAuth access token:

```typescript
const client = new INaturalistClient('https://api.inaturalist.org/v1', 'your-oauth-access-token');

// Make authenticated requests
const userData = await client.observations.get_observations({ user_login: 'username' });
```

## Important Notes

### Domain Requirements

- **OAuth endpoint**: `https://www.inaturalist.org/oauth/token`
- **API endpoints**: `https://api.inaturalist.org/v1/*`

You **must** use different domains for OAuth vs API calls!

### Token Types

The iNaturalist API has two types of tokens with different use cases:

1. **OAuth Access Token** (43 characters)
   - ✅ Use for **general API calls**
   - Format: Random string like `t6N7mfJqZw...`
   - Works with: observations, projects, identifications, etc.
   - ❌ Does NOT work with `/users/me` endpoint

2. **JWT API Token** (191+ characters)
   - ✅ Use for **user profile endpoints**
   - Format: JWT like `eyJhbGciOiJIUzUxMiJ9...`
   - Works with: `/users/me`, user-specific observations, some projects
   - ❌ Causes 500 errors with general observations endpoint

**Best Practice**: Use both tokens for different purposes!

### Content Type Requirements

OAuth requests must use form encoding. The SDK's `post_oauth_token` method automatically handles this for you:

```typescript
// Using the SDK method (recommended) - form encoding is automatic
const response = await client.authentication.post_oauth_token({
  grant_type: 'password',
  username: 'your-username',
  password: 'your-password',
  client_id: 'your-client-id',
  client_secret: 'your-client-secret'
});

// If making raw HTTP calls, you must set the headers manually:
headers: {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept': 'application/json'
}
```

## Error Handling

```typescript
async function safeAuthentication(username, password, clientId, clientSecret) {
  try {
    const authClient = new INaturalistClient('https://www.inaturalist.org');
    
    // The SDK automatically handles form-encoding for OAuth requests
    const oauthResponse = await authClient.authentication.post_oauth_token({
      grant_type: 'password',
      username: username,
      password: password,
      client_id: clientId,
      client_secret: clientSecret
    });

    return {
      success: true,
      accessToken: oauthResponse.data.access_token,
      client: new INaturalistClient('https://api.inaturalist.org/v1', oauthResponse.data.access_token)
    };
    
  } catch (error) {
    if (error.response) {
      // OAuth server returned an error
      console.error('OAuth Error:', error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        return { success: false, error: 'Invalid credentials' };
      } else if (error.response.status === 400) {
        return { success: false, error: 'Invalid request parameters' };
      }
    }
    
    return { success: false, error: error.message };
  }
}
```

## Common Issues and Solutions

### Issue: 500 Internal Server Error

**Cause**: Using JWT token instead of OAuth access token

**Solution**: Make sure you're using the OAuth access token (43 chars), not the JWT token (191+ chars)

### Issue: 404 Not Found on OAuth

**Cause**: Using wrong domain for OAuth request

**Solution**: Use `https://www.inaturalist.org` for OAuth, not the API subdomain

### Issue: 422 Unprocessable Entity

**Cause**: Incorrect parameter format or missing required fields

**Solution**: Check API documentation for required parameters and proper formatting

### Issue: 401 Unauthorized

**Cause**: Invalid credentials or expired token

**Solution**: Verify username/password and client credentials; re-authenticate if token expired

## Complete Authentication Example

Here's a complete example showing how to use both OAuth and JWT tokens:

```typescript
class INaturalistAuth {
  private apiClient: INaturalistClient;
  private profileClient: INaturalistClient;
  private accessToken: string | null = null;
  private jwtToken: string | null = null;

  constructor() {
    this.apiClient = new INaturalistClient('https://api.inaturalist.org/v1');
    this.profileClient = new INaturalistClient('https://api.inaturalist.org/v1');
  }

  async login(username: string, password: string, clientId: string, clientSecret: string) {
    // Step 1: Get OAuth access token
    const authClient = new INaturalistClient('https://www.inaturalist.org');
    
    // The SDK automatically handles form-encoding for OAuth requests
    const oauthResponse = await authClient.authentication.post_oauth_token({
      grant_type: 'password',
      username: username,
      password: password,
      client_id: clientId,
      client_secret: clientSecret
    });

    this.accessToken = oauthResponse.data.access_token;
    this.apiClient.setApiToken(this.accessToken);

    // Step 2: Get JWT token for user profile endpoints
    authClient.setApiToken(this.accessToken);
    const jwtResponse = await authClient.authentication.http.get('/users/api_token', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/json'
      }
    });

    this.jwtToken = jwtResponse.data.api_token;
    this.profileClient.setApiToken(this.jwtToken);
    
    return {
      accessToken: this.accessToken,
      jwtToken: this.jwtToken
    };
  }

  logout() {
    this.accessToken = null;
    this.jwtToken = null;
    this.apiClient.removeApiToken();
    this.profileClient.removeApiToken();
  }

  // Get client for general API calls (observations, projects, etc.)
  getApiClient() {
    return this.apiClient;
  }

  // Get client for user profile calls (/users/me)
  getProfileClient() {
    return this.profileClient;
  }

  isAuthenticated() {
    return this.accessToken !== null && this.jwtToken !== null;
  }

  // Convenience methods
  async getUserProfile() {
    if (!this.jwtToken) throw new Error('Not authenticated');
    return this.profileClient.users.http.get('/users/me');
  }

  async getObservations(params = {}) {
    if (!this.accessToken) throw new Error('Not authenticated');
    return this.apiClient.observations.get_observations(params);
  }
}

// Usage
const auth = new INaturalistAuth();
await auth.login('username', 'password', 'client-id', 'client-secret');

// Use appropriate client for different calls
const apiClient = auth.getApiClient();
const profileClient = auth.getProfileClient();

// General API calls with OAuth token
const observations = await apiClient.observations.get_observations();
const projects = await apiClient.projects.get_projects();

// User profile with JWT token
const userProfile = await profileClient.users.http.get('/users/me');
console.log('User details:', userProfile.data);

// Or use convenience methods
const profile = await auth.getUserProfile();
const userObs = await auth.getObservations({ user_login: 'username' });
```

## Security Best Practices

1. **Never commit credentials**: Store credentials in environment variables or secure configuration
2. **Use HTTPS**: Always use HTTPS endpoints
3. **Token storage**: Store tokens securely, don't log them
4. **Token expiration**: Handle token expiration gracefully
5. **Rate limiting**: Respect API rate limits

```typescript
// Environment variables example
const credentials = {
  username: process.env.INAT_USERNAME,
  password: process.env.INAT_PASSWORD,
  clientId: process.env.INAT_CLIENT_ID,
  clientSecret: process.env.INAT_CLIENT_SECRET
};
```