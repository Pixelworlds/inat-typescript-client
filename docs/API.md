# iNaturalist API Documentation

## Overview

This documentation covers the iNaturalist API endpoints organized by category. There are 16 categories with a total of 56 endpoints.

**Base URL:** `https://api.inaturalist.org/v1`

**Authentication:** Many endpoints require authentication using Bearer tokens. 29 out of 56 endpoints require authentication.

## Table of Contents

- [Authentication](#authentication)
- [Observations](#observations)
- [Annotations](#annotations)
- [Controlled Terms](#controlled-terms)
- [Taxa](#taxa)
- [Identifications](#identifications)
- [Users](#users)
- [Projects](#projects)
- [Project Observations](#project-observations)
- [Places](#places)
- [Comments](#comments)
- [Flags](#flags)
- [Observation Fields](#observation-fields)
- [Observation Field Values](#observation-field-values)
- [Observation Photos](#observation-photos)
- [Search](#search)

## Authentication

**Endpoints:** 3  
**Authentication Required:** 1  
**Authentication Optional:** 2  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/oauth/authorize?client_id=&redirect_uri=&response_type=&code_challenge=&code_challenge_method=&scope=` | 🔓 Optional | OAuth authorization endpoint - redirects user to authoriz... |
| GET | `/users/api_token` | 🔒 Required | Get user API token for authenticated requests |
| POST | `/oauth/token` | 🔓 Optional | OAuth token exchange endpoint - exchange authorization co... |

#### GET /oauth/authorize?client_id=&redirect_uri=&response_type=&code_challenge=&code_challenge_method=&scope=

**Description:** OAuth authorization endpoint - redirects user to authorize your application

**Authentication:** Optional

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| client_id | query | No | Query parameter: client_id |
| redirect_uri | query | No | Query parameter: redirect_uri |
| response_type | query | No | Query parameter: response_type |
| code_challenge | query | No | Query parameter: code_challenge |
| code_challenge_method | query | No | Query parameter: code_challenge_method |
| scope | query | No | Query parameter: scope |

**Headers:**

- `Accept`: application/json


#### GET /users/api_token

**Description:** Get user API token for authenticated requests

**Authentication:** Required

**Headers:**

- `Accept`: application/json


#### POST /oauth/token

**Description:** OAuth token exchange endpoint - exchange authorization code for access token

**Authentication:** Optional

**Request Body:**

- **Content-Type:** `application/x-www-form-urlencoded`
- **Fields:**
  - `grant_type`: {{inat_grant_type}}
  - `client_id`: {{inat_client_id}}
  - `client_secret`: {{inat_client_secret}}
  - `username`: {{inat_username}}
  - `password`: {{inat_password}}

**Headers:**

- `Accept`: application/json
- `Content-Type`: application/x-www-form-urlencoded


---

## Observations

**Endpoints:** 12  
**Authentication Required:** 5  
**Authentication Optional:** 7  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| DELETE | `/observations/:id` | 🔒 Required | Auth required |
| DELETE | `/observations/:id/quality/:metric` | 🔒 Required | Auth required |
| GET | `/observations` | 🔓 Optional | Primary endpoint for retrieving observations. If you're l... |
| GET | `/observations/:id` | 🔓 Optional | Retrieve information about an observation |
| GET | `/observations/:username` | 🔓 Optional | Mostly the same as /observations except filtered by a use... |
| GET | `/observations/project/:id` | 🔓 Optional | Just like /observations except filtered by a project.  :i... |
| GET | `/observations/taxon_stats` | 🔓 Optional | Retrieve some stats about taxa within a range of observat... |
| GET | `/observations/user_stats` | 🔓 Optional | Retrieve some stats about users within a range of observa... |
| POST | `/observations` | 🔒 Required | Auth required |
| POST | `/observations/:id/quality/:metric` | 🔒 Required | Auth required |
| PUT | `/observations/:id` | 🔒 Required | Auth required |
| PUT | `/observations/:id/viewed_updates` | 🔓 Optional | Mark updates associated with this observation (e.g. new c... |

#### DELETE /observations/:id

**Description:** Auth required

**Authentication:** Required

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Headers:**

- `Accept`: application/json


#### DELETE /observations/:id/quality/:metric

**Description:** Auth required

**Authentication:** Required

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |
| metric | path | Yes | Path parameter: metric |

**Headers:**

- `Accept`: application/json


#### GET /observations

**Description:** Primary endpoint for retrieving observations. If you're looking for
pagination info, check the X headers in the response. You should see

**Authentication:** Optional

**Headers:**

- `Accept`: application/json


#### GET /observations/:id

**Description:** Retrieve information about an observation

**Authentication:** Optional

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Headers:**

- `Accept`: application/json


#### GET /observations/:username

**Description:** Mostly the same as /observations except filtered by a username.

**Authentication:** Optional

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| username | path | Yes | Path parameter: username |

**Headers:**

- `Accept`: application/json


#### GET /observations/project/:id

**Description:** Just like /observations except filtered by a project.  :id can be a project ID or slug. CSV response will return some extra project-specific daa.

**Authentication:** Optional

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Headers:**

- `Accept`: application/json


#### GET /observations/taxon_stats

**Description:** Retrieve some stats about taxa within a range of observations.

**Authentication:** Optional

**Headers:**

- `Accept`: application/json


#### GET /observations/user_stats

**Description:** Retrieve some stats about users within a range of observations.
      You must include the

**Authentication:** Optional

**Headers:**

- `Accept`: application/json


#### POST /observations

**Description:** Auth required

**Authentication:** Required

**Request Body:**

- **Content-Type:** `application/json`
- **Example:**
```json
{}
```

**Headers:**

- `Accept`: application/json
- `Content-Type`: application/json


#### POST /observations/:id/quality/:metric

**Description:** Auth required

**Authentication:** Required

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |
| metric | path | Yes | Path parameter: metric |

**Request Body:**

- **Content-Type:** `application/json`
- **Example:**
```json
{}
```

**Headers:**

- `Accept`: application/json
- `Content-Type`: application/json


#### PUT /observations/:id

**Description:** Auth required

**Authentication:** Required

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Request Body:**

- **Content-Type:** `application/json`
- **Example:**
```json
{}
```

**Headers:**

- `Accept`: application/json
- `Content-Type`: application/json


#### PUT /observations/:id/viewed_updates

**Description:** Mark updates associated with this observation (e.g. new comment notifications) as viewed. Response should be NO CONTENT.

**Authentication:** Optional

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Request Body:**

- **Content-Type:** `application/json`
- **Example:**
```json
{}
```

**Headers:**

- `Accept`: application/json
- `Content-Type`: application/json


---

## Annotations

**Endpoints:** 2  
**Authentication Required:** 2  
**Authentication Optional:** 0  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/annotations` | 🔒 Required | Create an annotation |
| DELETE | `/annotations/:id` | 🔒 Required | Delete an annotation |

#### POST /annotations

**Description:** Create an annotation

**Authentication:** Required

**Request Body:**

- **Content-Type:** `application/json`
- **Example:**
```json
{}
```

**Headers:**

- `Accept`: application/json
- `Content-Type`: application/json


#### DELETE /annotations/:id

**Description:** Delete an annotation

**Authentication:** Required

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Headers:**

- `Accept`: application/json


---

## Controlled Terms

**Endpoints:** 2  
**Authentication Required:** 0  
**Authentication Optional:** 2  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/controlled_terms` | 🔓 Optional | Get controlled terms for annotations |
| GET | `/controlled_terms/for_taxon` | 🔓 Optional | Get controlled terms for a specific taxon |

#### GET /controlled_terms

**Description:** Get controlled terms for annotations

**Authentication:** Optional

**Headers:**

- `Accept`: application/json


#### GET /controlled_terms/for_taxon

**Description:** Get controlled terms for a specific taxon

**Authentication:** Optional

**Headers:**

- `Accept`: application/json


---

## Taxa

**Endpoints:** 2  
**Authentication Required:** 0  
**Authentication Optional:** 2  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/taxa` | 🔓 Optional | Search taxa |
| GET | `/taxa/:id` | 🔓 Optional | Get taxon details |

#### GET /taxa

**Description:** Search taxa

**Authentication:** Optional

**Headers:**

- `Accept`: application/json


#### GET /taxa/:id

**Description:** Get taxon details

**Authentication:** Optional

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Headers:**

- `Accept`: application/json


---

## Identifications

**Endpoints:** 9  
**Authentication Required:** 3  
**Authentication Optional:** 6  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/identifications` | 🔓 Optional | Search identifications with various filters |
| GET | `/identifications/:id` | 🔓 Optional | Retrieve identification details |
| DELETE | `/identifications/:id` | 🔒 Required | Auth required |
| GET | `/identifications/categories` | 🔓 Optional | Get identification categories |
| GET | `/identifications/species_counts` | 🔓 Optional | Get species counts for identifications |
| GET | `/identifications/identifiers` | 🔓 Optional | Get identification identifiers |
| GET | `/identifications/observers` | 🔓 Optional | Get identification observers |
| POST | `/identifications` | 🔒 Required | Auth required |
| PUT | `/identifications/:id` | 🔒 Required | Auth required |

#### GET /identifications

**Description:** Search identifications with various filters

**Authentication:** Optional

**Headers:**

- `Accept`: application/json


#### GET /identifications/:id

**Description:** Retrieve identification details

**Authentication:** Optional

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Headers:**

- `Accept`: application/json


#### DELETE /identifications/:id

**Description:** Auth required

**Authentication:** Required

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Headers:**

- `Accept`: application/json


#### GET /identifications/categories

**Description:** Get identification categories

**Authentication:** Optional

**Headers:**

- `Accept`: application/json


#### GET /identifications/species_counts

**Description:** Get species counts for identifications

**Authentication:** Optional

**Headers:**

- `Accept`: application/json


#### GET /identifications/identifiers

**Description:** Get identification identifiers

**Authentication:** Optional

**Headers:**

- `Accept`: application/json


#### GET /identifications/observers

**Description:** Get identification observers

**Authentication:** Optional

**Headers:**

- `Accept`: application/json


#### POST /identifications

**Description:** Auth required

**Authentication:** Required

**Request Body:**

- **Content-Type:** `application/json`
- **Example:**
```json
{}
```

**Headers:**

- `Accept`: application/json
- `Content-Type`: application/json


#### PUT /identifications/:id

**Description:** Auth required

**Authentication:** Required

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Request Body:**

- **Content-Type:** `application/json`
- **Example:**
```json
{}
```

**Headers:**

- `Accept`: application/json
- `Content-Type`: application/json


---

## Users

**Endpoints:** 4  
**Authentication Required:** 3  
**Authentication Optional:** 1  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/edit` | 🔒 Required | Auth required |
| GET | `/users/new_updates` | 🔒 Required | Auth required |
| POST | `/users` | 🔓 Optional | Create a new iNaturalist user |
| PUT | `/users/:id` | 🔒 Required | Auth required |

#### GET /users/edit

**Description:** Auth required

**Authentication:** Required

**Headers:**

- `Accept`: application/json


#### GET /users/new_updates

**Description:** Auth required

**Authentication:** Required

**Headers:**

- `Accept`: application/json


#### POST /users

**Description:** Create a new iNaturalist user

**Authentication:** Optional

**Request Body:**

- **Content-Type:** `application/json`
- **Example:**
```json
{}
```

**Headers:**

- `Accept`: application/json
- `Content-Type`: application/json


#### PUT /users/:id

**Description:** Auth required

**Authentication:** Required

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Request Body:**

- **Content-Type:** `application/json`
- **Example:**
```json
{}
```

**Headers:**

- `Accept`: application/json
- `Content-Type`: application/json


---

## Projects

**Endpoints:** 8  
**Authentication Required:** 4  
**Authentication Optional:** 4  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| DELETE | `/projects/:id/leave` | 🔒 Required | Auth required |
| GET | `/projects` | 🔓 Optional | Retrieve information about projects on iNaturalist. |
| GET | `/projects/:id` | 🔓 Optional | Retrieve information about a single project.  :id is the ... |
| GET | `/projects/:id?iframe=true` | 🔓 Optional | This returns a complete web page without header or footer... |
| GET | `/projects/:id/contributors.widget` | 🔓 Optional | JS widget snippet of the top contributors to a project. |
| GET | `/projects/:id/members` | 🔒 Required | Auth required |
| GET | `/projects/user/:login` | 🔒 Required | Auth required |
| POST | `/projects/:id/join` | 🔒 Required | Auth required |

#### DELETE /projects/:id/leave

**Description:** Auth required

**Authentication:** Required

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Headers:**

- `Accept`: application/json


#### GET /projects

**Description:** Retrieve information about projects on iNaturalist.

**Authentication:** Optional

**Headers:**

- `Accept`: application/json


#### GET /projects/:id

**Description:** Retrieve information about a single project.  :id is the project ID or slug.

**Authentication:** Optional

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Headers:**

- `Accept`: application/json


#### GET /projects/:id?iframe=true

**Description:** This returns a complete web page without header or footer suitable for use in an IFRAME.

**Authentication:** Optional

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| iframe | query | No | Query parameter: iframe |
| id | path | Yes | Path parameter: id |

**Headers:**

- `Accept`: application/json


#### GET /projects/:id/contributors.widget

**Description:** JS widget snippet of the top contributors to a project.

**Authentication:** Optional

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Headers:**

- `Accept`: application/json


#### GET /projects/:id/members

**Description:** Auth required

**Authentication:** Required

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Headers:**

- `Accept`: application/json


#### GET /projects/user/:login

**Description:** Auth required

**Authentication:** Required

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| login | path | Yes | Path parameter: login |

**Headers:**

- `Accept`: application/json


#### POST /projects/:id/join

**Description:** Auth required

**Authentication:** Required

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Request Body:**

- **Content-Type:** `application/json`
- **Example:**
```json
{}
```

**Headers:**

- `Accept`: application/json
- `Content-Type`: application/json


---

## Project Observations

**Endpoints:** 1  
**Authentication Required:** 1  
**Authentication Optional:** 0  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/project_observations` | 🔒 Required | Auth required |

#### POST /project_observations

**Description:** Auth required

**Authentication:** Required

**Request Body:**

- **Content-Type:** `application/json`
- **Example:**
```json
{}
```

**Headers:**

- `Accept`: application/json
- `Content-Type`: application/json


---

## Places

**Endpoints:** 1  
**Authentication Required:** 0  
**Authentication Optional:** 1  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/places` | 🔓 Optional | Retrieve information about places. |

#### GET /places

**Description:** Retrieve information about places.

**Authentication:** Optional

**Headers:**

- `Accept`: application/json


---

## Comments

**Endpoints:** 3  
**Authentication Required:** 3  
**Authentication Optional:** 0  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| DELETE | `/comments/:id` | 🔒 Required | Auth required |
| POST | `/comments` | 🔒 Required | Auth required |
| PUT | `/comments/:id` | 🔒 Required | Auth required |

#### DELETE /comments/:id

**Description:** Auth required

**Authentication:** Required

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Headers:**

- `Accept`: application/json


#### POST /comments

**Description:** Auth required

**Authentication:** Required

**Request Body:**

- **Content-Type:** `application/json`
- **Example:**
```json
{}
```

**Headers:**

- `Accept`: application/json
- `Content-Type`: application/json


#### PUT /comments/:id

**Description:** Auth required

**Authentication:** Required

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Request Body:**

- **Content-Type:** `application/json`
- **Example:**
```json
{}
```

**Headers:**

- `Accept`: application/json
- `Content-Type`: application/json


---

## Flags

**Endpoints:** 3  
**Authentication Required:** 3  
**Authentication Optional:** 0  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/flags` | 🔒 Required | Create a flag |
| PUT | `/flags/:id` | 🔒 Required | Update a flag |
| DELETE | `/flags/:id` | 🔒 Required | Delete a flag |

#### POST /flags

**Description:** Create a flag

**Authentication:** Required

**Request Body:**

- **Content-Type:** `application/json`
- **Example:**
```json
{}
```

**Headers:**

- `Accept`: application/json
- `Content-Type`: application/json


#### PUT /flags/:id

**Description:** Update a flag

**Authentication:** Required

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Request Body:**

- **Content-Type:** `application/json`
- **Example:**
```json
{}
```

**Headers:**

- `Accept`: application/json
- `Content-Type`: application/json


#### DELETE /flags/:id

**Description:** Delete a flag

**Authentication:** Required

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Headers:**

- `Accept`: application/json


---

## Observation Fields

**Endpoints:** 1  
**Authentication Required:** 0  
**Authentication Optional:** 1  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/observation_fields` | 🔓 Optional | List / search observation fields. ObservationFields are b... |

#### GET /observation_fields

**Description:** List / search observation fields. ObservationFields are basically
      typed data fields that users can attach to observation.

**Authentication:** Optional

**Headers:**

- `Accept`: application/json


---

## Observation Field Values

**Endpoints:** 3  
**Authentication Required:** 3  
**Authentication Optional:** 0  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| DELETE | `/observation_field_values/:id` | 🔒 Required | Auth required |
| POST | `/observation_field_values` | 🔒 Required | Auth required |
| PUT | `/observation_field_values/:id` | 🔒 Required | Auth required |

#### DELETE /observation_field_values/:id

**Description:** Auth required

**Authentication:** Required

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Headers:**

- `Accept`: application/json


#### POST /observation_field_values

**Description:** Auth required

**Authentication:** Required

**Request Body:**

- **Content-Type:** `application/json`
- **Example:**
```json
{}
```

**Headers:**

- `Accept`: application/json
- `Content-Type`: application/json


#### PUT /observation_field_values/:id

**Description:** Auth required

**Authentication:** Required

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | path | Yes | Path parameter: id |

**Request Body:**

- **Content-Type:** `application/json`
- **Example:**
```json
{}
```

**Headers:**

- `Accept`: application/json
- `Content-Type`: application/json


---

## Observation Photos

**Endpoints:** 1  
**Authentication Required:** 1  
**Authentication Optional:** 0  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/observation_photos` | 🔒 Required | Auth required |

#### POST /observation_photos

**Description:** Auth required

**Authentication:** Required

**Request Body:**

- **Content-Type:** `application/json`
- **Example:**
```json
{}
```

**Headers:**

- `Accept`: application/json
- `Content-Type`: application/json


---

## Search

**Endpoints:** 1  
**Authentication Required:** 0  
**Authentication Optional:** 1  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/search` | 🔓 Optional | Global search across observations, taxa, projects, etc. |

#### GET /search

**Description:** Global search across observations, taxa, projects, etc.

**Authentication:** Optional

**Headers:**

- `Accept`: application/json


---

## Statistics

| Metric | Value |
|--------|-------|
| Total Categories | 16 |
| Total Endpoints | 56 |
| Endpoints Requiring Auth | 29 |
| Public Endpoints | 27 |
| GET Endpoints | 29 |
| POST Endpoints | 12 |
| DELETE Endpoints | 8 |
| PUT Endpoints | 7 |

