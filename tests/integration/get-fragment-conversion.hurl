POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`**Testing converting fragment**`

HTTP/1.1 201
[Captures]
url: header "Location"

GET {{url}}.html
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
body == "<p><strong>Testing converting fragment</strong></p>\n"
