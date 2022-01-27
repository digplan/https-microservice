import { HTTPSServer, HTTPSClient } from "./https-microservice.mjs"

const middleware_debug = (r, s, data) => {
    console.log(`${r.method} ${r.url} ${data}`)
    s.end('okay')
}

const server = new HTTPSServer()
server.use([middleware_debug])
server.listen(3000)
console.log('\x1b[32m%s\x1b[0m', 'Send a POST with data to https://localhost:3000/')