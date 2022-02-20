#!/usr/bin/env node

import { HTTPSServer } from "./https-microservice.mjs"
const server = new HTTPSServer()
await server.getMiddlewareFolders()
await server.getMiddlewareFile()

console.log(server.middleware, server.routes)
server.listen(3000)
console.log('Server listening on port 3000')
