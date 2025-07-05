# iNaturalist API Documentation

## Overview

# https://api.inaturalist.org/v1/

[iNaturalist](https://www.inaturalist.org/) is a global community of
naturalists, scientists, and members of the public sharing over a million
wildlife sightings to teach one another about the natural world while
creating high quality citizen science data for science and conservation.

These API methods return data in JSON/JSONP and PNG response formats. They
are meant to supplement the existing [iNaturalist
API](https://www.inaturalist.org/pages/api+reference), implemented in Ruby
on Rails, which has more functionality and supports more write operations,
but tends to be slower and have less consistent response formats. Visit our
[developers page](https://www.inaturalist.org/pages/developers) for more
information. Write operations that expect and return JSON describe a single
`body` parameter that represents the request body, which should be specified
as JSON. See the "Model" of each body parameter for attributes that we
accept in these JSON objects.

Multiple values for a single URL parameter should be separated by commas,
e.g. `taxon_id=1,2,3`.

Map tiles are generated using the
[node-mapnik](https://github.com/mapnik/node-mapnik) library, following the
XYZ map tiling scheme. The "Observation Tile" methods accept nearly all the
parameters of the observation search APIs, and will generate map tiles
reflecting the same observations returned by searches. These
"Observation Tile" methods have corresponding
[UTFGrid](https://github.com/mapbox/utfgrid-spec) JSON
responses which return information needed to make interactive maps.

Authentication in the Node API is handled via JSON Web Tokens (JWT). To
obtain one, make an [OAuth-authenticated
request](http://www.inaturalist.org/pages/api+reference#auth) to
https://www.inaturalist.org/users/api_token. Each JWT will expire after 24
hours. Authentication required for all PUT and POST requests. Some GET
requests will also include private information like hidden coordinates if
the authenticated user has permission to view them.

Photos served from https://static.inaturalist.org and
https://inaturalist-open-data.s3.amazonaws.com have multiple size
variants and not all size variants are returned in responses. To access
other sizes, the photo URL can be modified to replace only the size
qualifier (each variant shares the exact same extension). The domain a photo
is hosted under reflects the license under which the photo is being shared,
and the domain may change over time if the license changes. Photos in
the `inaturalist-open-data` domain are shared under open licenses. These can
be accessed in bulk in the [iNaturalist AWS Open Dataset](
https://registry.opendata.aws/inaturalist-open-data/). Photos in the
`static.inaturalist.org` domain do not have open licenses.

The available photo sizes are:
* original (max 2048px in either dimension)
* large (max 1024px in either dimension)
* medium (max 500px in either dimension)
* small (max 240px in either dimension)
* thumb (max 100px in either dimension)
* square (75px square)

iNaturalist Website: https://www.inaturalist.org/

Open Source Software: https://github.com/inaturalist/

## Terms of Use

Use of this API is subject to the iNaturalist
[Terms of Service](https://www.inaturalist.org/terms) and
[Privacy Policy](https://www.inaturalist.org/privacy). We will block any
use of our API that violates our Terms or Privacy Policy without notice.
The API is intended to support application development, not data scraping.
For pre- generated data exports, see
https://www.inaturalist.org/pages/developers.

Please note that we throttle API usage to a max of 100 requests per minute,
though we ask that you try to keep it to 60 requests per minute or lower,
and to keep under 10,000 requests per day. If we notice usage that has
serious impact on our performance we may institute blocks without
notification.

Terms of Service: https://www.inaturalist.org/terms

Privacy Policy: https://www.inaturalist.org/privacy


This documentation covers the iNaturalist API endpoints organized by category. There are 20 categories with a total of 105 endpoints.

**Version:** 1.3.0

**Base URL:** `http://api.inaturalist.org/v1`

**Authentication:** Many endpoints require authentication using Bearer tokens. 62 out of 105 endpoints require authentication.

## Table of Contents

- [Annotations](#annotations) (4 endpoints)
- [Comments](#comments) (3 endpoints)
- [Controlled Terms](#controlled-terms) (2 endpoints)
- [Flags](#flags) (3 endpoints)
- [Identifications](#identifications) (11 endpoints)
- [Messages](#messages) (5 endpoints)
- [Observation Field Values](#observation-field-values) (3 endpoints)
- [Observation Photos](#observation-photos) (3 endpoints)
- [Observation Tiles](#observation-tiles) (4 endpoints)
- [Observations](#observations) (24 endpoints)
- [Photos](#photos) (1 endpoints)
- [Places](#places) (3 endpoints)
- [Polygon Tiles](#polygon-tiles) (3 endpoints)
- [Posts](#posts) (5 endpoints)
- [Project Observations](#project-observations) (3 endpoints)
- [Projects](#projects) (11 endpoints)
- [Search](#search) (1 endpoints)
- [Taxa](#taxa) (3 endpoints)
- [Users](#users) (9 endpoints)
- [UTFGrid](#utfgrid) (4 endpoints)

## Annotations

**Total Endpoints:** 4  
**Requires Authentication:** 4  
**Public Access:** 0  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/annotations` | 🔒 Required | Annotation Create |
| DELETE | `/annotations/{id}` | 🔒 Required | Annotation Delete |
| POST | `/votes/vote/annotation/{id}` | 🔒 Required | Annotation Vote |
| DELETE | `/votes/unvote/annotation/{id}` | 🔒 Required | Annotation Unvote |

### Endpoint Details

#### POST /annotations

**Annotation Create**

Create an annotation


**Authentication:** Required (Bearer token)

**Parameters:**

**Request Body:**

- **Content-Type:** `application/json`
- **Required:** No
- **Schema:** [PostAnnotation](#schemas)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### DELETE /annotations/{id}

**Annotation Delete**

Delete an annotation


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### POST /votes/vote/annotation/{id}

**Annotation Vote**

Vote on an annotation


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### DELETE /votes/unvote/annotation/{id}

**Annotation Unvote**

Remove a vote from annotation


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


---

## Comments

**Total Endpoints:** 3  
**Requires Authentication:** 3  
**Public Access:** 0  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/comments` | 🔒 Required | Comment Create |
| PUT | `/comments/{id}` | 🔒 Required | Comment Update |
| DELETE | `/comments/{id}` | 🔒 Required | Comment Delete |

### Endpoint Details

#### POST /comments

**Comment Create**

Create a comment


**Authentication:** Required (Bearer token)

**Parameters:**

**Request Body:**

- **Content-Type:** `application/json`
- **Required:** No
- **Schema:** [PostComment](#schemas)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### PUT /comments/{id}

**Comment Update**

Update a comment


**Authentication:** Required (Bearer token)

**Parameters:**

**Request Body:**

- **Content-Type:** `application/json`
- **Required:** No
- **Schema:** [PostComment](#schemas)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### DELETE /comments/{id}

**Comment Delete**

Delete a comment


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


---

## Controlled Terms

**Total Endpoints:** 2  
**Requires Authentication:** 0  
**Public Access:** 2  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/controlled_terms` | 🔓 Optional | Terms Index |
| GET | `/controlled_terms/for_taxon` | 🔓 Optional | Terms for Taxon |

### Endpoint Details

#### GET /controlled_terms

**Terms Index**

List all attribute controlled terms


**Authentication:** Not required

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### GET /controlled_terms/for_taxon

**Terms for Taxon**

Returns attribute controlled terms relevant to a taxon


**Authentication:** Not required

**Parameters:**

*Query Parameters:*

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `taxon_id` | Yes | integer | Filter by this taxon |

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


---

## Flags

**Total Endpoints:** 3  
**Requires Authentication:** 3  
**Public Access:** 0  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/flags` | 🔒 Required | Flag Create |
| PUT | `/flags/{id}` | 🔒 Required | Flag Update |
| DELETE | `/flags/{id}` | 🔒 Required | Flag Delete |

### Endpoint Details

#### POST /flags

**Flag Create**

Create a flag. To create a custom flag beyond the standard `spam` and
`inappropriate` flags, set `flag` to `other` and include a `flag_explanation`


**Authentication:** Required (Bearer token)

**Parameters:**

**Request Body:**

- **Content-Type:** `application/json`
- **Required:** No
- **Schema:** [PostFlag](#schemas)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### PUT /flags/{id}

**Flag Update**

Update a flag. Generally only used to resolve the flag.


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### DELETE /flags/{id}

**Flag Delete**

Delete a flag


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


---

## Identifications

**Total Endpoints:** 11  
**Requires Authentication:** 3  
**Public Access:** 8  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/identifications/{id}` | 🔓 Optional | Identification Details |
| PUT | `/identifications/{id}` | 🔒 Required | Identification Update |
| DELETE | `/identifications/{id}` | 🔒 Required | Identification Delete |
| POST | `/identifications` | 🔒 Required | Identification Create |
| GET | `/identifications` | 🔓 Optional | Identification Search |
| GET | `/identifications/categories` | 🔓 Optional | Identification Categories |
| GET | `/identifications/species_counts` | 🔓 Optional | Identification Species Counts |
| GET | `/identifications/identifiers` | 🔓 Optional | Identification Identifiers |
| GET | `/identifications/observers` | 🔓 Optional | Identification Observers |
| GET | `/identifications/recent_taxa` | 🔓 Optional | Identification Recent Taxa |
| GET | `/identifications/similar_species` | 🔓 Optional | Identification Similar Species |

### Endpoint Details

#### GET /identifications/{id}

**Identification Details**

Given an ID, or an array of IDs in comma-delimited format, returns
corresponding identifications. A maximum of 30 results will be returned


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### PUT /identifications/{id}

**Identification Update**

Update an identification. Note that to "withdraw" an observation you
send a `PUT` request to this endpoint and set the `current`
attribute to false. To "restore" it you do the same but set
`current` to `true`. Only one identification by a given user can be
`current` for a given observation, so if you "restore" one all the other
identifications by the authenticated user for the given observation will
be withdrawn.


**Authentication:** Required (Bearer token)

**Parameters:**

**Request Body:**

- **Content-Type:** `application/json`
- **Required:** No
- **Schema:** [PostIdentification](#schemas)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### DELETE /identifications/{id}

**Identification Delete**

Delete an identification. See description of `PUT /identifications/{id}
for notes on withdrawing and restoring identifications.


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### POST /identifications

**Identification Create**

Create an identification

**Authentication:** Required (Bearer token)

**Parameters:**

**Request Body:**

- **Content-Type:** `application/json`
- **Required:** No
- **Schema:** [PostIdentification](#schemas)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### GET /identifications

**Identification Search**

Given zero to many of following parameters, returns identifications
matching the search criteria


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### GET /identifications/categories

**Identification Categories**

Given zero to many of following parameters, return counts of the
categories of identifications matching the search criteria


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### GET /identifications/species_counts

**Identification Species Counts**

Given zero to many of following parameters, returns `leaf taxa`
associated with identifications matching the search criteria and the
count of identifications they are associated with, ordered by count
descending. `Leaf taxa` are the leaves of the taxonomic tree containing
only the taxa associated with observations matching the search criteria.


**Authentication:** Not required

**Parameters:**

*Query Parameters:*

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `taxon_of` | No | string | Source of the taxon for counting |
| `order` | No | string | Sort order |

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with metadata and an array of taxa
 |
| default | Unexpected error |


#### GET /identifications/identifiers

**Identification Identifiers**

Given zero to many of following parameters, returns creators of
identifications matching the search criteria and the count of
matching identifications, ordered by count descending. A
maximum of 500 results will be returned


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with metadata and an array of identifiers
 |
| default | Unexpected error |


#### GET /identifications/observers

**Identification Observers**

Given zero to many of following parameters, returns creators of
observations of identifications matching the search criteria and
the count of matching observations, ordered by count descending


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with metadata and an array of observers
 |
| default | Unexpected error |


#### GET /identifications/recent_taxa

**Identification Recent Taxa**

Returns an array of objects each containing an identification and a
taxon. Returns IDs representing the earliest occurrence of taxa
associated with identifications in the filtered set of results


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### GET /identifications/similar_species

**Identification Similar Species**

Returns species attached to IDs of observations of this taxon, or
attached to observations identified as this species, ordered by combined
frequency descending. This will only return species in the same iconic
taxon, and will never return descendants of the chosen taxon


**Authentication:** Not required

**Parameters:**

*Query Parameters:*

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `taxon_id` | Yes | integer | Only show observations of these taxa and their descendants |

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


---

## Messages

**Total Endpoints:** 5  
**Requires Authentication:** 5  
**Public Access:** 0  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/messages` | 🔒 Required | Retrieve messages for the authenticated user. This does n... |
| POST | `/messages` | 🔒 Required | Create a new message |
| GET | `/messages/{id}` | 🔒 Required | Retrieve messages in a thread |
| DELETE | `/messages/{id}` | 🔒 Required | Delete a message / thread |
| GET | `/messages/unread` | 🔒 Required | Gets a count of messages the authenticated user has not read |

### Endpoint Details

#### GET /messages

**Retrieve messages for the authenticated user. This does not mark them as read.**

Show the user's inbox or sent box

**Authentication:** Required (Bearer token)

**Parameters:**

*Query Parameters:*

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `box` | No | string | Whether to view messages the user has received (default) or messages the user has sent |
| `q` | No | string | Search query for subject and body |
| `user_id` | No | string | User ID or username of correspondent to filter by |
| `threads` | No | boolean | Groups results by `thread_id`, only shows the latest message per
thread, and includes a `thread_messages_count` attribute showing the
total number of messages in that thread. Note that this will not
work with the `q` param, and it probably should only be used with
`box=any` because the `thread_messages_count` will be inaccurate when
you restrict it to `inbox` or `sent`.
 |

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |
| default | Returns an object with metadata and an array of messages
 |


#### POST /messages

**Create a new message**

Create and deliver a new message to another user

**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns the message just created
 |
| default | Unexpected error |


#### GET /messages/{id}

**Retrieve messages in a thread**

Retrieves all messages in the thread the specified message belongs to
and marks them all as read.


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with metadata and an array of messages
 |
| default | Unexpected error |


#### DELETE /messages/{id}

**Delete a message / thread**

This will all of the authenticated user's copies of the messages in tha
thread to which the specified message belongs.


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | No return data, 200 just means deletion was successful
 |
| 404 | Specified message doesn't exist
 |
| default | Unexpected error |


#### GET /messages/unread

**Gets a count of messages the authenticated user has not read**

**Authentication:** Required (Bearer token)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Number of unread messages |
| default | Unexpected error |


---

## Observation Field Values

**Total Endpoints:** 3  
**Requires Authentication:** 3  
**Public Access:** 0  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/observation_field_values/{id}` | 🔒 Required | Observation Field Value Update |
| DELETE | `/observation_field_values/{id}` | 🔒 Required | Observation Field Value Delete |
| POST | `/observation_field_values` | 🔒 Required | Observation Field Value Create |

### Endpoint Details

#### PUT /observation_field_values/{id}

**Observation Field Value Update**

Update an observation field value


**Authentication:** Required (Bearer token)

**Parameters:**

**Request Body:**

- **Content-Type:** `application/json`
- **Required:** No
- **Schema:** [PostObservationFieldValue](#schemas)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### DELETE /observation_field_values/{id}

**Observation Field Value Delete**

Delete an observation field value


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### POST /observation_field_values

**Observation Field Value Create**

Create an observation field value


**Authentication:** Required (Bearer token)

**Parameters:**

**Request Body:**

- **Content-Type:** `application/json`
- **Required:** No
- **Schema:** [PostObservationFieldValue](#schemas)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


---

## Observation Photos

**Total Endpoints:** 3  
**Requires Authentication:** 3  
**Public Access:** 0  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/observation_photos/{id}` | 🔒 Required | Observation Photo Update |
| DELETE | `/observation_photos/{id}` | 🔒 Required | Observation Photo Delete |
| POST | `/observation_photos` | 🔒 Required | Observation Photo Create |

### Endpoint Details

#### PUT /observation_photos/{id}

**Observation Photo Update**

Update an observation photo

**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### DELETE /observation_photos/{id}

**Observation Photo Delete**

Delete an observation photo


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### POST /observation_photos

**Observation Photo Create**

Create an observation photo


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


---

## Observation Tiles

**Total Endpoints:** 4  
**Requires Authentication:** 0  
**Public Access:** 4  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/colored_heatmap/{zoom}/{x}/{y}.png` | 🔓 Optional | Colored Heatmap Tiles |
| GET | `/grid/{zoom}/{x}/{y}.png` | 🔓 Optional | Grid Tiles |
| GET | `/heatmap/{zoom}/{x}/{y}.png` | 🔓 Optional | Heatmap Tiles |
| GET | `/points/{zoom}/{x}/{y}.png` | 🔓 Optional | Points Tiles |

### Endpoint Details

#### GET /colored_heatmap/{zoom}/{x}/{y}.png

**Colored Heatmap Tiles**

Given zero to many of following parameters, returns a PNG image
representing the matching observations within a map tile, following
the XYZ tiling scheme


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns a PNG map tile image
 |


#### GET /grid/{zoom}/{x}/{y}.png

**Grid Tiles**

Given zero to many of following parameters, returns a PNG image
representing the matching observations within a map tile, following
the XYZ tiling scheme


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns a PNG map tile image
 |


#### GET /heatmap/{zoom}/{x}/{y}.png

**Heatmap Tiles**

Given zero to many of following parameters, returns a PNG image
representing the matching observations within a map tile, following
the XYZ tiling scheme


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns a PNG map tile image
 |


#### GET /points/{zoom}/{x}/{y}.png

**Points Tiles**

Given zero to many of following parameters, returns a PNG image
representing the matching observations within a map tile, following
the XYZ tiling scheme


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns a PNG map tile image
 |


---

## Observations

**Total Endpoints:** 24  
**Requires Authentication:** 16  
**Public Access:** 8  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/observations/{id}` | 🔓 Optional | Observation Details |
| PUT | `/observations/{id}` | 🔒 Required | Observation Update |
| DELETE | `/observations/{id}` | 🔒 Required | Observation Delete |
| POST | `/observations/{id}/fave` | 🔒 Required | Observations Fave |
| DELETE | `/observations/{id}/unfave` | 🔒 Required | Observations Unfave |
| POST | `/observations/{id}/review` | 🔒 Required | Observations Review |
| DELETE | `/observations/{id}/review` | 🔒 Required | Observations Unreview |
| GET | `/observations/{id}/subscriptions` | 🔒 Required | Observation Subscriptions |
| POST | `/observations/{id}/quality/{metric}` | 🔒 Required | Quality Metric Set |
| DELETE | `/observations/{id}/quality/{metric}` | 🔒 Required | Quality Metric Delete |
| GET | `/observations/{id}/taxon_summary` | 🔓 Optional | Observation Taxon Summary |
| POST | `/subscriptions/observation/{id}/subscribe` | 🔒 Required | Observation Subscribe |
| POST | `/votes/vote/observation/{id}` | 🔒 Required | Observation Vote |
| DELETE | `/votes/unvote/observation/{id}` | 🔒 Required | Observation Unvote |
| GET | `/observations` | 🔓 Optional | Observation Search |
| POST | `/observations` | 🔒 Required | Observation Create |
| GET | `/observations/deleted` | 🔒 Required | Observations Deleted |
| GET | `/observations/histogram` | 🔓 Optional | Observation Histogram |
| GET | `/observations/identifiers` | 🔓 Optional | Observation Identifiers |
| GET | `/observations/observers` | 🔓 Optional | Observation Observers |
| GET | `/observations/popular_field_values` | 🔓 Optional | Observation Popular Field Values |
| GET | `/observations/species_counts` | 🔓 Optional | Observation Species Counts |
| GET | `/observations/updates` | 🔒 Required | Observation User Updates |
| PUT | `/observations/{id}/viewed_updates` | 🔒 Required | Observation Field Value Update |

### Endpoint Details

#### GET /observations/{id}

**Observation Details**

Given an ID, or an array of IDs in comma-delimited format, returns
corresponding observations. A maximum of 200 results will be returned


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with metadata and an array of observations
 |
| default | Unexpected error |


#### PUT /observations/{id}

**Observation Update**

Update an observation


**Authentication:** Required (Bearer token)

**Parameters:**

**Request Body:**

- **Content-Type:** `application/json`
- **Required:** No
- **Schema:** [PostObservation](#schemas)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### DELETE /observations/{id}

**Observation Delete**

Delete an observation


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### POST /observations/{id}/fave

**Observations Fave**

Fave an observation


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### DELETE /observations/{id}/unfave

**Observations Unfave**

Unfave an observation


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### POST /observations/{id}/review

**Observations Review**

Review an observation


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### DELETE /observations/{id}/review

**Observations Unreview**

Unreview an observation


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### GET /observations/{id}/subscriptions

**Observation Subscriptions**

Fetches any subscriptions the current user has to this observation
or the observer


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### POST /observations/{id}/quality/{metric}

**Quality Metric Set**

Set the value of a quality metric


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### DELETE /observations/{id}/quality/{metric}

**Quality Metric Delete**

Delete a quality metric


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### GET /observations/{id}/taxon_summary

**Observation Taxon Summary**

Fetches information about this observation's taxon, within the context
of this observation's location


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### POST /subscriptions/observation/{id}/subscribe

**Observation Subscribe**

Toggles current user's subscription to this observation. If the logged-in
user is not subscribed, POSTing here will subscribe them. If they are already
subscribed, this will remove the subscription


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### POST /votes/vote/observation/{id}

**Observation Vote**

Vote on an observation. A vote with an empty `scope` is recorded as a
`fave` of the observation. A vote with scope `needs_id` is recorded as a
vote on the Quality Grade criterion "can the Community ID still be
confirmed or improved?", and can be an up or down vote


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### DELETE /votes/unvote/observation/{id}

**Observation Unvote**

Remove a vote from an observation

**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### GET /observations

**Observation Search**

Given zero to many of following parameters, returns observations
matching the search criteria. The large size of the observations index
prevents us from supporting the `page` parameter when retrieving records
from large result sets. If you need to retrieve large numbers of
records, use the `per_page` and `id_above` or `id_below` parameters
instead.


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with metadata and an array of observations
 |
| default | Unexpected error |


#### POST /observations

**Observation Create**

Create an observation


**Authentication:** Required (Bearer token)

**Parameters:**

**Request Body:**

- **Content-Type:** `application/json`
- **Required:** No
- **Schema:** [PostObservation](#schemas)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### GET /observations/deleted

**Observations Deleted**

Given a starting date, return an array of IDs of the authenticated
user's observations that have been deleted since that date. Requires
authentication


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### GET /observations/histogram

**Observation Histogram**

Given zero to many of following parameters, returns histogram data about
observations matching the search criteria


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with metadata and an array of histogram data
 |
| default | Unexpected error |


#### GET /observations/identifiers

**Observation Identifiers**

Given zero to many of following parameters, returns identifiers of
observations matching the search criteria and the count of
observations they have identified, ordered by count descending. A
maximum of 500 results will be returned


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with metadata and an array of identifiers
 |
| default | Unexpected error |


#### GET /observations/observers

**Observation Observers**

Given zero to many of following parameters, returns observers of
observations matching the search criteria and the count of
observations and distinct taxa of rank `species` they have observed. A
maximum of 500 results will be returned


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with metadata and an array of observers
 |
| default | Unexpected error |


#### GET /observations/popular_field_values

**Observation Popular Field Values**

Given zero to many of following parameters, returns an array of
relevant controlled terms values and a monthly histogram


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### GET /observations/species_counts

**Observation Species Counts**

Given zero to many of following parameters, returns `leaf taxa`
associated with observations matching the search criteria and the count of
observations they are associated with, ordered by count descending.
`Leaf taxa` are the leaves of the taxonomic tree containing only the
taxa associated with observations matching the search criteria.


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with metadata and an array of taxa
 |
| default | Unexpected error |


#### GET /observations/updates

**Observation User Updates**

Given zero to many of following parameters, returns an array of objects
representing new comments and identifications on observations the authenticated
user has subscribed to. Requires authentication


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### PUT /observations/{id}/viewed_updates

**Observation Field Value Update**

Mark all updates associated with this observation as viewed by logged-in user


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


---

## Photos

**Total Endpoints:** 1  
**Requires Authentication:** 1  
**Public Access:** 0  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/photos` | 🔒 Required | Photo Create |

### Endpoint Details

#### POST /photos

**Photo Create**

Create a photo


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


---

## Places

**Total Endpoints:** 3  
**Requires Authentication:** 0  
**Public Access:** 3  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/places/{id}` | 🔓 Optional | Place Details |
| GET | `/places/autocomplete` | 🔓 Optional | Place Autocomplete |
| GET | `/places/nearby` | 🔓 Optional | Nearby Places |

### Endpoint Details

#### GET /places/{id}

**Place Details**

Given an ID, or an array of IDs in comma-delimited format, returns
corresponding places. A maximum of 500 results will be returned


**Authentication:** Not required

**Parameters:**

*Query Parameters:*

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `admin_level` | No | array | Admin level of a place, or an array of admin levels
in comma-delimited format. Supported admin levels are: -10
(continent), 0 (country), 10 (state), 20 (county), 30 (town),
100 (park) |

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with metadata and an results array of places
 |
| default | Unexpected error |


#### GET /places/autocomplete

**Place Autocomplete**

Given an string, returns places with names starting with the search
term.


**Authentication:** Not required

**Parameters:**

*Query Parameters:*

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `order_by` | No | string | Sort field |

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with metadata and an results array of places
 |
| default | Unexpected error |


#### GET /places/nearby

**Nearby Places**

Given an bounding box, and an optional name query, return `standard`
iNaturalist curator approved and `community` non-curated places nearby


**Authentication:** Not required

**Parameters:**

*Query Parameters:*

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `name` | No | string | Name must match this value |

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with metadata and an results object containing
`standard` and `community` places
 |
| default | Unexpected error |


---

## Polygon Tiles

**Total Endpoints:** 3  
**Requires Authentication:** 0  
**Public Access:** 3  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/places/{place_id}/{zoom}/{x}/{y}.png` | 🔓 Optional | Place Tiles |
| GET | `/taxon_places/{taxon_id}/{zoom}/{x}/{y}.png` | 🔓 Optional | Taxon Place Tiles |
| GET | `/taxon_ranges/{taxon_id}/{zoom}/{x}/{y}.png` | 🔓 Optional | Taxon Range Tiles |

### Endpoint Details

#### GET /places/{place_id}/{zoom}/{x}/{y}.png

**Place Tiles**

Returns a PNG map tile representing the boundary of this place,
following the XYZ tiling scheme


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns a PNG map tile image
 |


#### GET /taxon_places/{taxon_id}/{zoom}/{x}/{y}.png

**Taxon Place Tiles**

Returns a PNG map tile representing the boundaries of places this taxon
is known to occur, following the XYZ tiling scheme


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns a PNG map tile image
 |


#### GET /taxon_ranges/{taxon_id}/{zoom}/{x}/{y}.png

**Taxon Range Tiles**

Returns a PNG map tile representing the range of this taxon, following
the XYZ tiling scheme


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns a PNG map tile image
 |


---

## Posts

**Total Endpoints:** 5  
**Requires Authentication:** 5  
**Public Access:** 0  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/posts` | 🔒 Required | Posts Search |
| POST | `/posts` | 🔒 Required | Post Create |
| PUT | `/posts/{id}` | 🔒 Required | Post Update |
| DELETE | `/posts/{id}` | 🔒 Required | Post Delete |
| GET | `/posts/for_user` | 🔒 Required | Posts For User |

### Endpoint Details

#### GET /posts

**Posts Search**

Return journal posts from the iNaturalist site


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### POST /posts

**Post Create**

Create a post


**Authentication:** Required (Bearer token)

**Parameters:**

**Request Body:**

- **Content-Type:** `application/json`
- **Required:** No
- **Schema:** [PostPost](#schemas)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### PUT /posts/{id}

**Post Update**

Update a post


**Authentication:** Required (Bearer token)

**Parameters:**

**Request Body:**

- **Content-Type:** `application/json`
- **Required:** No
- **Schema:** [PostPost](#schemas)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### DELETE /posts/{id}

**Post Delete**

Delete a post


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### GET /posts/for_user

**Posts For User**

Return journal posts from the iNaturalist site. If the user is logged-in,
also return posts from projects the user is subscribed to


**Authentication:** Required (Bearer token)

**Parameters:**

*Query Parameters:*

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `newer_than` | No | string | returns posts newer than the post with this ID |
| `older_than` | No | string | returns posts older than the post with this ID |

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


---

## Project Observations

**Total Endpoints:** 3  
**Requires Authentication:** 3  
**Public Access:** 0  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/project_observations/{id}` | 🔒 Required | Project Observation Update |
| DELETE | `/project_observations/{id}` | 🔒 Required | Project Observation Delete |
| POST | `/project_observations` | 🔒 Required | Project Observation Create |

### Endpoint Details

#### PUT /project_observations/{id}

**Project Observation Update**

Update a project observation

**Authentication:** Required (Bearer token)

**Parameters:**

**Request Body:**

- **Content-Type:** `application/json`
- **Required:** No
- **Schema:** [UpdateProjectObservation](#schemas)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### DELETE /project_observations/{id}

**Project Observation Delete**

Delete a project observation

**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### POST /project_observations

**Project Observation Create**

Add an observation to a project

**Authentication:** Required (Bearer token)

**Parameters:**

**Request Body:**

- **Content-Type:** `application/json`
- **Required:** No
- **Schema:** [PostProjectObservation](#schemas)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


---

## Projects

**Total Endpoints:** 11  
**Requires Authentication:** 7  
**Public Access:** 4  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/projects` | 🔓 Optional | Project Search |
| GET | `/projects/{id}` | 🔓 Optional | Project Details |
| POST | `/projects/{id}/join` | 🔒 Required | Projects Join |
| DELETE | `/projects/{id}/leave` | 🔒 Required | Projects Leave |
| GET | `/projects/{id}/members` | 🔓 Optional | Project Members |
| GET | `/projects/{id}/membership` | 🔒 Required | Membership of current user |
| GET | `/projects/{id}/subscriptions` | 🔒 Required | Project Subscriptions |
| POST | `/projects/{id}/add` | 🔒 Required | Project Add |
| DELETE | `/projects/{id}/remove` | 🔒 Required | Project Add |
| GET | `/projects/autocomplete` | 🔓 Optional | Project Autocomplete |
| POST | `/subscriptions/project/{id}/subscribe` | 🔒 Required | Project Subscribe |

### Endpoint Details

#### GET /projects

**Project Search**

Given zero to many of following parameters, returns projects
matching the search criteria


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with metadata and an array of projects
 |
| default | Unexpected error |


#### GET /projects/{id}

**Project Details**

Given an ID, or an array of IDs in comma-delimited format, returns
corresponding projects. A maximum of 100 results will be returned


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with metadata and an array of projects
 |
| default | Unexpected error |


#### POST /projects/{id}/join

**Projects Join**

Join a project


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### DELETE /projects/{id}/leave

**Projects Leave**

Leave a project


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### GET /projects/{id}/members

**Project Members**

Given an ID, return members of the project


**Authentication:** Not required

**Parameters:**

*Query Parameters:*

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `role` | No | string | Membership role |

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with metadata and an results array of projects
 |
| default | Unexpected error |


#### GET /projects/{id}/membership

**Membership of current user**

Given an ID, or an array of IDs in comma-delimited format, return the details of the
authenticated user's membership in these projects


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### GET /projects/{id}/subscriptions

**Project Subscriptions**

[Deprecated] Subscriptions to projects are managed through joining and
leaving projects, so this will not return any useful information.

Given an ID, return subscription of the current user


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### POST /projects/{id}/add

**Project Add**

Add an observation to a project

**Authentication:** Required (Bearer token)

**Parameters:**

**Request Body:**

- **Content-Type:** `application/json`
- **Required:** No
- **Schema:** [PostProjectAdd](#schemas)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### DELETE /projects/{id}/remove

**Project Add**

Remove an observation from a project

**Authentication:** Required (Bearer token)

**Parameters:**

**Request Body:**

- **Content-Type:** `application/json`
- **Required:** No
- **Schema:** [PostProjectAdd](#schemas)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### GET /projects/autocomplete

**Project Autocomplete**

Given an string, returns projects with titles starting with the search term


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with metadata and an results array of places
 |
| default | Unexpected error |


#### POST /subscriptions/project/{id}/subscribe

**Project Subscribe**

Toggles current user's subscription to this project. If the logged-in
user is not subscribed, POSTing here will subscribe them. If they are already
subscribed, this will remove the subscription


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


---

## Search

**Total Endpoints:** 1  
**Requires Authentication:** 0  
**Public Access:** 1  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/search` | 🔓 Optional | Site Search |

### Endpoint Details

#### GET /search

**Site Search**

Given zero to many of following parameters, returns object matching the search criteria


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


---

## Taxa

**Total Endpoints:** 3  
**Requires Authentication:** 0  
**Public Access:** 3  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/taxa/{id}` | 🔓 Optional | Taxon Details |
| GET | `/taxa` | 🔓 Optional | Taxon Search |
| GET | `/taxa/autocomplete` | 🔓 Optional | Taxon Autocomplete |

### Endpoint Details

#### GET /taxa/{id}

**Taxon Details**

Given an ID, or an array of IDs in comma-delimited format, returns
corresponding taxa. A maximum of 30 results will be returned


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with metadata and a results array of taxa
 |
| default | Unexpected error |


#### GET /taxa

**Taxon Search**

Given zero to many of following parameters, returns taxa matching the search criteria


**Authentication:** Not required

**Parameters:**

*Query Parameters:*

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `is_active` | No | boolean | Taxon is `active` |

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with search metadata and a results array of taxa
 |
| default | Unexpected error |


#### GET /taxa/autocomplete

**Taxon Autocomplete**

Given an string, returns taxa with names starting with the search term


**Authentication:** Not required

**Parameters:**

*Query Parameters:*

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `is_active` | No | boolean | Taxon is `active` |
| `per_page` | No | string | Number of results to return in a `page`. The maximum value is 30 for this endpoint |

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an object with search metadata and a results array of taxa
 |
| default | Unexpected error |


---

## Users

**Total Endpoints:** 9  
**Requires Authentication:** 6  
**Public Access:** 3  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/{id}` | 🔓 Optional | User Details |
| PUT | `/users/{id}` | 🔒 Required | User Update |
| GET | `/users/{id}/projects` | 🔓 Optional | User Projects |
| GET | `/users/autocomplete` | 🔓 Optional | User Autocomplete |
| GET | `/users/me` | 🔒 Required | Users Me |
| POST | `/users/{id}/mute` | 🔒 Required | Mute a User |
| DELETE | `/users/{id}/mute` | 🔒 Required | Unmute a User |
| POST | `/users/resend_confirmation` | 🔒 Required | User Resend Confirmation |
| PUT | `/users/update_session` | 🔒 Required | User Update Session |

### Endpoint Details

#### GET /users/{id}

**User Details**

Given an ID, returns corresponding user

**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### PUT /users/{id}

**User Update**

Update a user


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### GET /users/{id}/projects

**User Projects**

Return projects as user has joined / followed


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### GET /users/autocomplete

**User Autocomplete**

Given an string, returns users with names or logins starting with the search term


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### GET /users/me

**Users Me**

Fetch the logged-in user

**Authentication:** Required (Bearer token)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### POST /users/{id}/mute

**Mute a User**

Make it so the authenticated user stops receiving notifications about
activity by the user specified by {id}.


**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an empty 200 response on success |
| 404 | Specified user does not exist |


#### DELETE /users/{id}/mute

**Unmute a User**

Remove a mute on the user specified by {id}

**Authentication:** Required (Bearer token)

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns an empty 200 response on success |
| 404 | Specified user does not exist |


#### POST /users/resend_confirmation

**User Resend Confirmation**

Resend an email confirmation

**Authentication:** Required (Bearer token)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


#### PUT /users/update_session

**User Update Session**

Update the logged-in user's session

**Authentication:** Required (Bearer token)

**Parameters:**

**Request Body:**

- **Content-Type:** `application/json`
- **Required:** No
- **Schema:** [PostUserUpdateSession](#schemas)

**Responses:**

| Code | Description |
|------|-------------|
| 200 | OK |


---

## UTFGrid

**Total Endpoints:** 4  
**Requires Authentication:** 0  
**Public Access:** 4  

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/colored_heatmap/{zoom}/{x}/{y}.grid.json` | 🔓 Optional | Colored Heatmap Tiles UTFGrid |
| GET | `/grid/{zoom}/{x}/{y}.grid.json` | 🔓 Optional | Grid Tiles UTFGrid |
| GET | `/heatmap/{zoom}/{x}/{y}.grid.json` | 🔓 Optional | Heatmap Tiles UTFGrid |
| GET | `/points/{zoom}/{x}/{y}.grid.json` | 🔓 Optional | Points Tiles UTFGrid |

### Endpoint Details

#### GET /colored_heatmap/{zoom}/{x}/{y}.grid.json

**Colored Heatmap Tiles UTFGrid**

Given zero to many of following parameters, returns a JSON file
following the UTFGrid spec, representing observations matching
the search criteria


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns a UTFGrid
 |
| default | Unexpected error |


#### GET /grid/{zoom}/{x}/{y}.grid.json

**Grid Tiles UTFGrid**

Given zero to many of following parameters, returns a JSON file
following the UTFGrid spec, representing observations matching
the search criteria


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns a UTFGrid
 |
| default | Unexpected error |


#### GET /heatmap/{zoom}/{x}/{y}.grid.json

**Heatmap Tiles UTFGrid**

Given zero to many of following parameters, returns a JSON file
following the UTFGrid spec, representing observations matching
the search criteria


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns a UTFGrid
 |
| default | Unexpected error |


#### GET /points/{zoom}/{x}/{y}.grid.json

**Points Tiles UTFGrid**

Given zero to many of following parameters, returns a JSON file
following the UTFGrid spec, representing observations matching
the search criteria


**Authentication:** Not required

**Parameters:**

**Responses:**

| Code | Description |
|------|-------------|
| 200 | Returns a UTFGrid
 |
| default | Unexpected error |


---

## API Statistics

### Summary

| Metric | Value |
|--------|-------|
| Total Categories | 20 |
| Total Endpoints | 105 |
| Authenticated Endpoints | 62 |
| Public Endpoints | 43 |
| Auth Percentage | 59.0% |

### Endpoints by Method

| Method | Count | Percentage |
|--------|-------|------------|
| POST | 22 | 21.0% |
| DELETE | 18 | 17.1% |
| PUT | 11 | 10.5% |
| GET | 54 | 51.4% |

### Categories by Size

| Category | Endpoints | Auth Required |
|----------|-----------|---------------|
| Observations | 24 | 16 |
| Identifications | 11 | 3 |
| Projects | 11 | 7 |
| Users | 9 | 6 |
| Messages | 5 | 5 |
| Posts | 5 | 5 |
| Annotations | 4 | 4 |
| Observation Tiles | 4 | 0 |
| UTFGrid | 4 | 0 |
| Comments | 3 | 3 |
| Flags | 3 | 3 |
| Observation Field Values | 3 | 3 |
| Observation Photos | 3 | 3 |
| Places | 3 | 0 |
| Polygon Tiles | 3 | 0 |
| Project Observations | 3 | 3 |
| Taxa | 3 | 0 |
| Controlled Terms | 2 | 0 |
| Photos | 1 | 1 |
| Search | 1 | 0 |

