export default {

    '/': (r, s, data) => s.end('index'),

    '/test.js': (r, s, data) => s.end(r.url),

    '/api': {
        GET (r, s, data, server) {
            s.end('get')
        },
        POST (r, s, data, server) {
            s.end('post')
        },
        DELETE (r, s, data, server) {
            s.end('delete')
        }
    }

}
