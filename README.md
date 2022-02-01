# https-microservice
[![npm version](https://badge.fury.io/js/https-microservice.svg)](https://badge.fury.io/js/https-microservice)
![size](http://img.badgesize.io/digplan/https-microservice/master/https-microservice.mjs)

Zero config https server

Total flexibility. Just put your cert and key in ./keys

.use takes an array of middleware functions

Functions run in order and stop when return true

Try
> npx https-microservice

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