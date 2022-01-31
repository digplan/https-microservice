function hashpass(pass) {
    const hash1 = crypto.createHash('sha256').update(pass).digest('hex')
    return crypto.createHash('sha256').update(hash1).digest('hex')
}

function StoreAuth(r, s) {
    if (r.url !== '/auth') return false
    const [type, userpass] = r.headers.Authorization.split(' ')
    if (type !== 'Basic') return false
    const [user, pass] = Buffer.from(userpass, 'base64').toString('ascii').split(':')

    const userrecord = this.map.get(`user:${user}`)
    if (!userrecord) return false
    if (userrecord.pass !== this.hashpass(pass)) return false
    r.authenticated = true
    return true
}

function StoreHandler(r, s, data) {
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

export default function (r, s, data) {
    if(r.url == '/_token') {
        return StoreAuth(r, s, data)
    }
    if(r.url == '/_logout') {
        return s.writeHead(200, {
            'Set-Cookie': 'cb=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }).end()
    }
    const jwtstring = r.headers.cookie.replace('cb=', '');
    if (!jwt.verify(jwtstring)) {
        return s.writeHead(401).end();
    }   
    return StoreHandler(r, s, data)
}