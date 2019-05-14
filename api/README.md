README.md

# Smartsplit API Design 

# URL
https://api.iptoki.com

# Description
Provides a RESTful API for interacting with Smartsplit

# Specification
openAPI 3.0, swagger 2.0
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

creators
read_full_name
read_role
read_percentage_split
or 
read_profile, write_profile (general)
or 
read_email, write_email,  read_split (priveledged)

artwork (metadata)
read_media, write_media (general)

# Paths

### Questions
* Add IPI under profiles (rights holder) ??
* Differentiate copyright,performance,recording in media/profiles ??
* Should rights-type be an endpoint on profiles?
* Should agreement be an endpoint??
* Should profiles include a wallet address ??

authorization

| Endpoint      | Description    |
| :------------- | :----------: |
| /auth | Request a JWT access token |

profile or users or creators or artists

| Endpoint      | Description    |
| :------------- | :----------: |
| /profiles | Request a list of creator profiles |
| /profiles/{id} | Request a creator profile with the given uuid |
| /profiles/{id}/name | Request a creators full name with given uuid |
| /profiles/{id}/email | Request a creators email address with the given uuid |
| /profiles/{id}/role | Request a creators role or list of roles with the given id (includes copyright, performance, and/or recording) |
| /profiles/{id}/ipi | Request a creators interested party information number given id |
| /profiles/{id}/media | Request a list of media associated with the given creator profile |
| /profiles/{id}/wallet | Request the wallet address of a creator profile with the given uuid |

artwork or metadata or media or agreement

| Endpoint      | Description    |
| :------------- | :----------: |
| /media | Request a list of artworks |
| /media/{id} | Request an artwork with the given uuid |
| /media/{id}/title | Request a title of the given media identified by id |
| /media/{id}/description | Request a written description of the media with the given id |
| /media/{id}/creators | Request the list of creators who collaborated on the given media |
| /media/{id}/jurisdiction | Request the jurisdiction on the given media |
| /media/{id}/rights-type | Request the type of rights on the given media (copyright,performance,recording) |
| /media/{id}/genre | Request the genre of the media with the given id |
| /media/{id}/creation-date | Request the creation date of the media with the given id |
| /media/{id}/publisher | Request the publisher name of the media with the given id |
| /media/{id}/split | Request the creator’s percentage split on a given piece of media |

payments

| Endpoint      | Description    |
| :------------- | :----------: |
| /payments | Request a list of payments |
| /payments/{id} | Request a payment with the given id |
| /payments/{id}/transaction-id | Request the management societies' transaction ID of a payment with the given ID |
| /payments/{id}/transaction-hash | Request the blockchain transaction hash of a payment with the given ID |


# Operations (requests)
Get, Put, Post, Delete

get /auth

get /profiles
get, post, delete /profiles/{id}
get, put /profiles/{id}/name
get, put /profiles/{id}/email 
get, put /profiles/{id}/role 
get, put /profiles/{id}/ipi 
get, post /profiles/{id}/media
get, put, post /profiles/{id}/wallet

get /media
get, post, delete /media/{id} 
get, put, post /media/{id}/title 
get, put, post /media/{id}/description
get. put, post /media/{id}/rights-holders 
get, put, post /media/{id}/jurisdiction
get, put, post /media/{id}/genre 
get, post /media/{id}/creation-date 
get, put, post /media/{id}/publisher
get media/{id}/split 

get /payments
get, post, delete /payments/{id}
get, put, post /payments/{id}/transaction-id
get, put, post /payments/{id}/transaction-hash

# Parameters
path parameters, query parameters, header parameters, cookie parameters

# JSON Web Token: ?JWT
Scopes: read_profile, write_profile, read_email, write_email,  read_split, read_media, write_media

# Response Type
JSON

# Tools
http://editor.swagger.io/
https://github.com/Rebilly/ReDoc

# Styling
* https://swagger.io/blog/api-design/api-design-best-practices/
* spinal case
* yaml & JSON
