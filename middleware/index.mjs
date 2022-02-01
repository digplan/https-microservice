import { Supramap } from 'supramap'
import { JWT } from 'jwt-tiny'
const secret = 'your-256-bit-secret';
const jwt = new JWT(secret);

function hashpass(pass) {
    const hash1 = crypto.createHash('sha256').update(pass).digest('hex')
    return crypto.createHash('sha256').update(hash1).digest('hex')
}

export default function f(r, s, data) {
    if (!r.url.startsWith('/q/')) return false

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

    let map = r.server.db
    const [, q, key] = r.url.split('/')
    switch (r.method) {
        case 'GET':
            return s.end(map.has(key) ? map.get(key).json() : '{}')
        case 'POST':
            if (map.has(data.id))
                return s.writeHead(500).end('record exists')
            return s.end(map.set(data.id, data))
        case 'PATCH':
            if (!map.has(data.id))
                return s.writeHead(500).end('record exists')
            return s.end(map.set(data.id, data))
        case 'DELETE':
            if (!map.has(data.id))
                return s.writeHead(500).end('record not found')
            return s.end(map.delete(data.id))
        case 'PUT':
        // TODO
        default:
            return s.writeHead(405).end()
    }
}