POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`Hello Delete`

HTTP/1.1 201
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "Hello Delete"

DELETE {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404

