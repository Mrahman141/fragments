# tests/integration/post-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a unsupported fragment
Content-Type: text/non-plain
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
`This is a fragment!`

# 1. We expect to get back an HTTP 415
HTTP/1.1 415
