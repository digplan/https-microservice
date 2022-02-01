export default function _debug(r, s, data) {
    console.log(`Headers: ${JSON.stringify(r.headers, null, 2)}`)
    console.log(`Method: ${r.method}`)
    console.log(`URL: ${r.url}`)
    console.log(`Data: ${JSON.stringify(data)}`)
    if(r.server.db)
        console.log(r.server.db.functions)
}