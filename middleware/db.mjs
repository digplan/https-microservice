import { Supramap } from 'supramap'
import { JWT } from 'jwt-tiny'
const secret = 'your-256-bit-secret';
const jwt = new JWT(secret);

function hashpass(pass) {
    const hash1 = crypto.createHash('sha256').update(pass).digest('hex')
    return crypto.createHash('sha256').update(hash1).digest('hex')
}

function Token(r, s) {
    if (r.headers.authorization) {
        const[type, userpass] = r.headers.authorization.split(' ')
        const [user, pass] = Buffer.from(userpass, 'base64').toString('ascii').split(':')
        console.log(user, pass)

        const exp = new Date().getTime() + (7 * 24 * 60 * 60 * 1000)
        const jwts = jwt.create({
            sub: user,
            iat: new Date().toISOString(),
            exp: new Date(exp).toISOString(),
            ip: r.socket.remoteAddress
        })
        s.setHeader('Set-Cookie', `token=${jwts}; HttpOnly; Secure; Path=/; Expires=${new Date(exp).toUTCString()}`)
        return s.end(jwts)
    }
    return s.writeHead(401).end()
}

function Api(r, s, data) {
    return s.end(r.headers)
    
    const [db, table, record] = r.url.split('/')
    const key = `${table}:${record}`
    switch (r.method) {
        case 'GET':
            return s.end(this.dbs[db].get[key])
        case 'POST':
            return s.end(this.dbs[db].set(body.id, body))
        case 'PATCH':
            return s.end(this.dbs[db].set(body.id, body))
        case 'DELETE':
            return s.end(this.dbs[db].delete(body.id))
        case 'PUT':
        // TODO
        default:
            return s.writeHead(405).end()
    }
}

export default function midfunc(r, s, data) {
    if(!r.server.db) r.server.db = new Supramap()
    switch(r.url) {
        case '/_token':
            return Token(r, s)
        case '/_logout':
            return s.setHeader('Set-Cookie', 'token=; HttpOnly; Secure; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT').end('logged out')
        default:
            return Api(r, s, data)
    }
}