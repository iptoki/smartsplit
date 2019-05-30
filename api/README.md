README.md

# Smartsplit API Design 

# URL
https://api.iptoki.com (localhost:8080)

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
| Get | /refreshToken | Refresh existing JWT access token |

profiles

| Operation | Endpoint      | Description    |
| :------------- | :------------- | :----------: |
| Get, Put, Post | /profiles | Get, Update or Create a list of all right holder profiles |
| Get, Delete | /profiles/{id} | Get or Delete a right holder's profile with the given ID |
| Patch | /profiles/{id}/firstName | Update a right holder's first name with the given ID|
| Patch | /profiles/{id}/lastName | Update a right holder's last name with the given ID|
| Patch | /profiles/{id}/email | Update a right holder's email address with given ID|
| Patch | /profiles/{id}/contributorRole | Update a right holder's role or list of roles with the given ID |
| Patch| /profiles/{id}/ipi | Update a right holder's interested party information number with the given ID |
| Patch | /profiles/{id}/media | Update a list of media associated with the given right holder profile ID |
| Patch | /profiles/{id}/wallet | Update the wallet address of a right holder's profile with the given ID |

media

| Operation | Endpoint      | Description    |
| :------------- | :------------- | :----------: |
| Get, Post| /media | Get or Create a list of artworks |
| Get, Put, Delete | /media/{id} | Get, Update or Delete an artwork with the given ID |
| Patch | /media/{id}/title | Update the title of the given media identified by ID |
| Patch | /media/{id}/description |  Update the description of the media with the provided ID |
| Patch | /media/{id}/album |  Update the album of the media with the provided ID |
| Patch* | /media/{id}/rightHolders | Update the list of right holders who collaborated on the given media |
| Patch | /media/{id}/jurisdiction | Update the jurisdiction of the given media |
| Patch* | /media/{id}/rightsType | Update the type of rights of the given media (copyright, performance, recording) |
| Patch | /media/{id}/genre | Update the genre of the media with the given ID |
| Patch | /media/{id}/secondaryGenre | Update the genre of the media with the given ID |
| Patch* | /media/{id}/publishDate | Update the publish date of the media with the given ID |
| Patch | /media/{id}/publisher | Update the publisher name of the media with the given ID |
| Patch* | /media/{id}/rightsSplit | Update the rights holders' percentage split on the media with the given ID |

payments

| Operation | Endpoint      | Description    |
| :------------- | :------------- | :----------: |
| Get, Post | /payments | Get or Create a list of payments' details |
| Get, Put, Delete | /payments/{id} | Get, Update or Delete the payment details of a payment with the given ID |
| Patch| /payments/{id}/transactionId | Get or Update the management societies' transaction ID of a payment with the given ID |
| Patch | /payments/{id}/transactionHash | Get or Update the blockchain transaction hash of a payment with the given ID |

# Parameters
path parameters, query parameters

# JSON Web Token: ?JWT
Scopes: read_profile, write_profile, read_email, write_email,  read_split, write_split, read_media, write_media

# Response Type
JSON

# Tools
http://editor.swagger.io/
https://github.com/Rebilly/ReDoc

# Styling
* https://swagger.io/blog/api-design/api-design-best-practices/
* camelCase
* yaml & JSON
