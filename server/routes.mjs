
//const { JWT } = import('jwt-tiny')
//const jwt = new JWT('your-256-bit-secret')
export default {
    '/api': {
        GET (r, s, data, server) {
            s.end('get')
        },
        POST (r, s, data, server) {
            if (this.has(`${o.type}:${o.name}`))
                s.writeHead(400).end('already exists')
            this.set(data)
            s.writeHead(201).end(JSON.stringify(data))
        },
        DELETE (r, s, data, server) {
            if (!this.has(`${o.type}:${o.name}`))
                s.writeHead(400).end('does not exist')
            this.set(data)
            s.writeHead(200).end(JSON.stringify(data))
        }
    }
}
