import { readFileSync, readdirSync } from 'node:fs';
import { Server } from 'node:https';

let dir = process.cwd()
let dir_key = `${dir}/../keys/key.pem`
let dir_cert = `${dir}/../keys/cert.pem`
let dir_middleware = `file://${dir}/middleware`
let dir_routes = `file://${dir}/routes`
let routes_file = `${dir}/routes.mjs`

class HTTPSServer extends Server {
    middleware = []
    routes = {}
    constructor(key, cert) {
        super({
            key: readFileSync(dir_key),
            cert: readFileSync(dir_cert),
        })
        this.on('request', (r, s) => {
            try {
                let data = ''
                r.on('data', (s) => {
                    data += s.toString()
                })
                r.on('end', () => {
                    s.endJSON = (obj) => {
                        s.end(JSON.stringify(obj))
                    }
                    try { data = JSON.parse(data) } catch (e) { }
                    r.server = this
                    if(!this.usesFolders){
                        
                    }
                    this.middleware.some((f) => {
                        return f(r, s, data)
                    })
                    if(r.url == '/') r.url = '/index.mjs'
                    const route = this.routes[r.url]
                    if (!route)
                        return this.routes['/404'](r, s, data)
                    if (route.toString().startsWith('class')) {
                        const f = new route(), method = r.method.toLowerCase()
                        if (!f[method])
                            return s.writeHead(405).end()
                        return f[method](r, s, data)
                    }
                    return route(r, s, data)
                })
            } catch (e) {
                console.log(e)
                s.writeHead(500).end()
            }
        }
        )
    }
    async getMiddleware() {
        for (const model of readdirSync('./middleware')) {
            if (!model.endsWith('.mjs')) continue
            let f = await import(`${dir_middleware}/${model}`)
            this.middleware.unshift(f.default)
        }
        for (const model of readdirSync('./routes')) {
            if (!model.endsWith('.mjs')) continue
            const name = model.split('.')[0]
            let f = (await import(`${dir_routes}/${model}`)).default
            this.routes[`/${name}`] = f
        }
        this.usesFolders = true
    }
    async getRouteMjs() {
        const routes = await import(routes_file)
        for (const middleware of Object.keys(routes).filter(n => n.match(/^_/))) {
            this.middleware[middleware](r, s, data)
        }
        return routes[r.url] ? routes[r.url](r, s, data, server) : s.writeHead(404).end()
    }
}

class Route {
    constructor(r, s, data) { }
    route(r, s, data) {
        this[r.method](r, s, data)
    }
}

export { HTTPSServer, Route }
