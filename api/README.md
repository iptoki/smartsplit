README.md

# Smartsplit API Design 

# URL
https://api.iptoki.com

# Description
Provides a RESTful API for interacting with Smartsplit

# Specification
swagger 2.0, openAPI 3.0.0*
https://swagger.io/docs/specification/about/
https://github.com/OAI/OpenAPI-Specification/blob/OpenAPI.next/versions/3.0.0.md

# Authorization (authentication)
HTTP Basic
JWT

# Type
apiKey

# Redirect URI
https://api.iptoki.com/callback

# Permissions (scope) 

profiles
read_profile, write_profile (general)

read_email, write_email, read_split (priveledged)

media (metadata)
read_media, write_media (general)

# Paths & Operations

authentication

| Operation | Endpoint      | Description    |
| :------------- | :------------- | :----------: |
| Post | /auth | Request and get a JWT access token |
| Get | /refresh-token | Refresh existing JWT access token |

profiles

| Operation | Endpoint      | Description    |
| :------------- | :------------- | :----------: |
| Get, Post | /profiles | Get or Create a list of all right holder profiles |
| Get, Delete | /profiles/{id} | Get or Delete a right holder's profile with the given ID |
| Get, Put | /profiles/{id}/name | Get or Update a right holder's full name with the given ID|
| Get, Put | /profiles/{id}/email | Get or Update a right holder's email address with given ID|
| Get, Put | /profiles/{id}/role | Get or Update a right holder's role or list of roles with the given ID (includes copyright, performance, and/or recording) |
| Get, Put| /profiles/{id}/ipi | Get or Update a right holder's interested party information number with the given ID |
| Get, Put | /profiles/{id}/media | Get or Update a list of media associated with the given right holder profile ID |
| Get, Put | /profiles/{id}/wallet | Get or Update the wallet address of a right holder's profile with the given ID |

media

| Operation | Endpoint      | Description    |
| :------------- | :------------- | :----------: |
| Get, Post*| /media | Get or Create a list of artworks |
| Get, Delete | /media/{id} | Get or Delete an artwork with the given ID |
| Get, Put | /media/{id}/title | Get or Update the title of the given media identified by ID |
| Get, Put | /media/{id}/description |  Get or Update the description of the media with the provided ID |
| Get, Put* | /media/{id}/right-holders | Get or Update the list of right holders who collaborated on the given media |
| Get, Put | /media/{id}/jurisdiction | Get or Update the jurisdiction of the given media |
| Get, Put* | /media/{id}/rights-type | Get or Update the type of rights of the given media (copyright, performance, recording) |
| Get, Put | /media/{id}/genre | Get or Update the genre of the media with the given ID |
| Get | /media/{id}/creation-date | Get the creation date of the media with the given ID |
| Get, Put | /media/{id}/publisher | Get or Update the publisher name of the media with the given ID |
| Get, Put* | /media/{id}/split | Get or Update the rights holders' percentage split on the media with the given ID |

payments

| Operation | Endpoint      | Description    |
| :------------- | :------------- | :----------: |
| Get, Post | /payments | Get or Create a list of payments' details |
| Get, Delete | /payments/{id} | Get or Delete the payment details of a payment with the given ID |
| Get, Put| /payments/{id}/transaction-id | Get or Update the management societies' transaction ID of a payment with the given ID |
| Get, Put | /payments/{id}/transaction-hash | Get or Update the blockchain transaction hash of a payment with the given ID |

# Parameters
path parameters, query parameters, header parameters, cookie parameters

# JSON Web Token: ?JWT
Scopes: read_profile, write_profile, read_email, write_email,  read_split, write_split, read_media, write_media

# Response Type
JSON

# Tools
http://editor.swagger.io/
https://github.com/Rebilly/ReDoc

# Styling
* https://swagger.io/blog/api-design/api-design-best-practices/
* spinal case
* yaml & JSON
