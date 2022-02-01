#!/usr/bin/env node

import { HTTPSServer, HTTPSClient } from "./https-microservice.mjs"
const server = new HTTPSServer()
await server.getMiddleware()
console.log(server.middleware)
server.listen(3000)
console.log('\x1b[32m%s\x1b[0m', 'Listening on https://localhost:3000/')

/*
import { Transact } from './transact.mjs'
const t = new Transact()
const randoms = t.getIntegration('Test', /*{debug: true})
console.log(await randoms())
*/