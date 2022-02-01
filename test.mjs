#!/usr/bin/env node

import { HTTPSServer, HTTPSClient } from "./https-microservice.mjs"

const middleware_debug = (r, s, data) => {
    console.log(`${JSON.stringify(r.headers)} ${r.method} ${r.url} ${data}`)
}

const server = new HTTPSServer()
await server.getMiddleware()
console.log(server.middleware)
server.listen(3000)
console.log('\x1b[32m%s\x1b[0m', 'Send a POST with data to https://localhost:3000/')


/*
import { Transact } from './transact.mjs'
const t = new Transact()
const randoms = t.getIntegration('Test', /*{debug: true})
console.log(await randoms())
*/