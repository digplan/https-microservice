import { readFileSync, readdirSync } from 'node:fs';
import { Server, get } from 'node:https';

class HTTPSServer extends Server {
    middleware = [];
    constructor() {
        let dirname = new URL(import.meta.url).pathname.split('/').slice(0, -1).join('/').slice(1)
        if (process.platform !== 'win32')
            dirname = '/' + dirname
        super({
            key: readFileSync(`${dirname}/keys/key.pem`),
            cert: readFileSync(`${dirname}/keys/cert.pem`),
        });
        this.on('request', (r, s) => {
            let data = '';
            r.on('data', (s) => {
                data += s.toString();
            });
            r.on('end', () => {
                try {
                    data = JSON.parse(data);
                } catch (e) { }
                r.server = this
                this.middleware.some((f) => {
                    const stop = f(r, s, data);
                    console.log(f, stop)
                    return stop;
                });
            });
        });
    }
    use(farr) {
        this.middleware = [...farr, (r, s) => s.writeHead(404).end()];
    }
    async getMiddleware() {
        let dirname = new URL(import.meta.url).pathname.split('/').slice(0, -1).join('/').slice(1)
        if (process.platform !== 'win32')
            dirname = '/' + dirname
        for (const model of readdirSync(dirname + '/middleware')) {
            if (!model.endsWith('.mjs')) continue
            let furl = 'file://' + dirname + '/middleware/' + model
            let f = await import(furl);
            this.middleware.unshift(f.default);
        }
        let NotFound = (r, s) => s.writeHead(404).end()
        this.middleware.push(NotFound)
    }
}

class HTTPSClient {
    fetch(url, options = {}) {
        return new Promise((resolve, reject) => {
            get(url, options, (res, socket) => {
                let data = '';
                res.on('connect', (res, socket, head) => {
                    socket.write('okay');
                });
                res.on('data', (d) => {
                    data += d;
                });
                res.on('end', () => {
                    resolve(data);
                });
            });
        });
    }
}

export { HTTPSServer, HTTPSClient };