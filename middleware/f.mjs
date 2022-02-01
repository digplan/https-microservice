import { Supramap } from 'supramap'
import { JWT } from 'jwt-tiny'
const secret = 'your-256-bit-secret';
const jwt = new JWT(secret);

function hashpass(pass) {
    const hash1 = crypto.createHash('sha256').update(pass).digest('hex')
    return crypto.createHash('sha256').update(hash1).digest('hex')
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

    let map = r.server.db
    const [, f, key] = r.url.split('/')
    if (map.functions[key])
        return s.end(map.functions[key](map))
    else
        return s.writeHead(404).end()
}