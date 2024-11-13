POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`Hello PUT`

HTTP/1.1 201
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "Hello PUT"


PUT {{url}}
Content-Type: text/html
[BasicAuth]
user1@email.com:password1
`<p>test</p>`

HTTP/1.1 400
