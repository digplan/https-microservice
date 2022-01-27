# https-microservice

Zero config https server

Total flexibility. Just put your cert and key in ./keys

.use takes an array of middleware functions

Functions run in order and stop when return true

````js
import { HTTPSServer } from "./https-microservice.mjs"

const middleware_debug = (r, s, data) => {
    console.log(`${r.method} ${r.url} ${data}`)
    s.end('okay')
}

const server = new HTTPSServer()
server.use([middleware_debug])
server.listen(3000)
console.log('\x1b[32m%s\x1b[0m', 'Send a POST with json data to https://localhost:3000/')

````