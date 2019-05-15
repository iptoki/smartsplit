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

| Operation | Endpoint      | Description    |
| :------------- | :------------- | :----------: |
| Get | /auth | Request a JWT access token |

profile or users or creators or artists

| Operation | Endpoint      | Description    |
| :------------- | :------------- | :----------: |
| Get | /profiles | Request a list of all right holder profiles |
| Get, Post, Delete | /profiles/{id} | Request a right holder's profile with the given ID |
| Get, Put | /profiles/{id}/name | Request a right holder's full name with the given ID|
| Get, Put | /profiles/{id}/email | Request a right holder's email address with given ID|
| Get, Put | /profiles/{id}/role | Request a right holder's role or list of roles with the given ID (includes copyright, performance, and/or recording) |
| Get, Put| /profiles/{id}/ipi | Request a right holder's interested party information number with the given ID |
| Get, Post | /profiles/{id}/media | equest a list of media associated with the given right holder profile ID |
| Get, Put, Post | /profiles/{id}/wallet | Request the wallet address of a right holder's profile with the given ID |

artwork or metadata or media or agreement

| Operation | Endpoint      | Description    |
| :------------- | :------------- | :----------: |
| Get | /media | Request a list of artworks |
| Get, Post, Delete | /media/{id} | Request an artwork with the given ID |
| Get, Put | /media/{id}/title | Request the title of the given media identified by ID |
| Get, Put | /media/{id}/description |  Request the description of the media with the provided ID |
| Get, Put | /media/{id}/right-holders | Request the list of right holders who collaborated on the given media |
| Get, Put | /media/{id}/jurisdiction | Request the jurisdiction of the given media |
| Get, Put | /media/{id}/rights-type | Request the type of rights of the given media (copyright, performance, recording) |
| Get, Put | /media/{id}/genre | Request the genre of the media with the given ID |
| Get, Put | /media/{id}/creation-date | Request the creation date of the media with the given ID |
| Get, Put | /media/{id}/publisher | Request the publisher name of the media with the given ID |
| Get | /media/{id}/split | Request the rights holders' percentage split on the media with the given ID |

payments

| Operation | Endpoint      | Description    |
| :------------- | :------------- | :----------: |
| Get | /payments | Request a list of all payments' details |
| Get, Post, Delete | /payments/{id} | Request the payment details of a payment with the given ID |
| Get, Put, Post | /payments/{id}/transaction-id | Request the management societies' transaction ID of a payment with the given ID |
| Get, Put, Post | /payments/{id}/transaction-hash | Request the blockchain transaction hash of a payment with the given ID |


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
