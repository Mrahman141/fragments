# 1. POST a text fragment as an authorized user
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`Hello S3!`

# 2. Server returns a 201 and capture location header
HTTP/1.1 201
[Captures]
url: header "Location"

# 3. GET the fragment as an authorized user
GET {{url}}
[BasicAuth]
user1@email.com:password1

# 4. Server returns a 200 and type is text/plain and body is "Hello S3!"
HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "Hello S3!"

# 3. DELETE the fragment as an authorized user
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# 4. Server returns a 200
HTTP/1.1 200

# 3. GET the fragment as an authorized user
GET {{url}}
[BasicAuth]
user1@email.com:password1

# 4. Server returns a 404
HTTP/1.1 404

