# 1. POST a JSON fragment as an authorized user
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
`{ "service": "DynamoDB" }`


# 2. Server returns a 201 and capture location header and fragment id
HTTP/1.1 201
[Captures]
fragment1_url : header "Location"
fragment1_id : jsonpath "$.fragments.id"

# 3. GET the fragment info (i.e., metadata) 
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"

# 4. POST a markdown fragment as an authorized user
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`DynamoDB is **great**`

# 5. Server returns a 201 and capture location header and fragment id
HTTP/1.1 201
[Captures]
fragment2_url : header "Location"
fragment2_id : jsonpath "$.fragments.id"

# 6. GET the fragment info (i.e., metadata) 
GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"


# 7. Retrieve all fragment ids and confirm that they matches
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" isCollection
jsonpath "$.fragments[0]" includes "{{fragment1_id}}"
jsonpath "$.fragments[0]" includes "{{fragment2_id}}"


# 8. DELETE the JSON fragment as an authorized user
DELETE {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

# 9. Server returns a 200
HTTP/1.1 200

# 10. GET the JSON fragment
GET {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

# 11. Server returns a 404
HTTP/1.1 404


# 12. Retrieve all fragment ids and confirm that they matches
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.fragments[0]" not includes "{{fragment1_id}}"
jsonpath "$.fragments[0]" includes "{{fragment2_id}}"
