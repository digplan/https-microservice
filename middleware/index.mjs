import { Supramap } from 'supramap'
import { JWT } from 'jwt-tiny'
const secret = 'your-256-bit-secret';
const jwt = new JWT(secret);

function hashpass(pass) {
    const hash1 = crypto.createHash('sha256').update(pass).digest('hex')
    return crypto.createHash('sha256').update(hash1).digest('hex')
}

function api(r,s, data, map, key) {
    switch (r.method) {
        case 'GET':
            if (map.has(key))
                return s.end(map.get[key])
            if (map.functions[key])
                return s.end(map.functions[key](map))
        case 'POST':
            if (map.has(data.id))
                return s.writeHead(500).end('record exists')
            return s.end(map.set(data.id, data))
        case 'PATCH':
            if (!map.has(data.id))
                return s.writeHead(500).end('record exists')
            return s.end(map.set(data.id, data))
        case 'DELETE':
            return s.end(map.delete(data.id))
        case 'PUT':
        // TODO
        default:
            return s.writeHead(405).end()
    }
}

export default function f(r, s, data) {
    if (!r.url.startsWith('/f/')) return false

    if (!r.headers.cookie)
        return s.writeHead(401).end()
    let cookie = ''
    for (const c of r.headers.cookie.split(';')) {
        if (c.startsWith('token=')) {
            cookie = c.replace('token=', '')
        }
    }
    if (!jwt.verify(cookie))
        return s.writeHead(401).end()

    /*
      https://<endpoint> PUT {name: ...} (Create new db)
      https://<endpoint>/<table:id> GET (single record)
      https://<endpoint>/<func> GET (func or all table records)
      https://<endpoint>/<table:id> [POST, PATCH, DELETE] {id:'someid', field1:'val1'}
    */
    if (!r.server.db) {
        const map = new Supramap()
        map.loadFunctions()
        r.server.db = map
    }
    let map = r.server.db
    const [, f, key] = r.url.split('/')
    return api(r, s, data, map, key)
}