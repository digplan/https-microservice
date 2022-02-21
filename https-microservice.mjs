import { NoFoodRounded } from '@mui/icons-material';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { Server } from 'node:https';

let dir = process.cwd()
let dir_key = `${dir}/../keys/key.pem`
let dir_cert = `${dir}/../keys/cert.pem`
let dir_middleware = `file://${dir}/middleware`
let dir_routes = `file://${dir}/routes`
const routes_file = `${dir}/server/routes.mjs`

const jsn = (s, data) => {
    s.endJSON = (obj) => {
        s.end(JSON.stringify(obj))
    }
    try { data = JSON.parse(data) } catch (e) { }
    return data
}

const found = (routes, url) => {
    const sroute = '/' + url.split('/')[1]
    return routes[sroute] || routes['/404'] || false
}

class HTTPSServer extends Server {
    middleware = []
    routes = {}
    debug = process.env.debug || false
    constructor(key, cert) {
        super({
            key: readFileSync(dir_key),
            cert: readFileSync(dir_cert),
        })
        this.on('request', (r, s) => {
            try {
                if (this.debug) console.log(`${r.method} ${r.url}`)
                let data = ''
                r.on('data', (s) => {
                    data += s.toString()
                })
                r.on('end', () => {
                    data = jsn(s, data)
                    this.middleware.some((f) => f(r, s, data))
                    let route = found(this.routes, r.url)
                    if (!route) return s.writeHead(404).end()
                    if (typeof route === 'function')
                        return route(r, s, data, this)
                    else if(route[r.method])
                        return route[r.method](r, s, data, this)
                    else
                        return s.writeHead(405).end()
                })
            } catch (e) {
                console.log(e)
                s.writeHead(500).end()
            }
        }
        )
    }
    async getMiddlewareFolders() {
        const mfiles = []
        if (existsSync('./middleware')) {
            for (const model of readdirSync('./middleware'))
                mfiles.push(model)
            mfiles.sort((a, b) => a.localeCompare(b))
            for (const model of mfiles) {
                if (!model.endsWith('.mjs')) continue
                let f = await import(`${dir_middleware}/${model}`)
                this.middleware.unshift(f.default)
            }
        }
        if (existsSync('./routes')) {
            for (const model of readdirSync('./routes')) {
                if (!model.endsWith('.mjs')) continue
                const name = model.split('.')[0]
                let f = (await import(`${dir_routes}/${model}`)).default
                this.routes[`/${name}`] = f
            }
        }
    }
    async getMiddlewareFile() {
        if (!existsSync(routes_file)) return console.log('no routes.mjs file: ' + routes_file)
        const routesf = (await import(`file://${routes_file}`)).default
        for (let name of Object.keys(routesf)) {
            if (name.startsWith('_')) {
                this.middleware.unshift(routesf[name])
            } else {
                this.routes[name] = routesf[name]
            }
        }
    }
}

export { HTTPSServer }
