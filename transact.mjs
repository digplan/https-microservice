class Transact {
  constructor(url) {
    import integs from './integrations.mjs'
    this.integrations = integs
  }
  getIntegration(name, debug=false) {
    return async function(p1, p2, p3) {
       const {url, method = 'GET', body = '', headers = {"Content-Type":"application/json"}, postprocess = (s)=>s} = this.integrations[name]
       const f = await fetch(`https://${url}`, {method: method, headers: headers, credentials: include})
       const resp = await f.json()
       if(!resp) resp = await f.text()
       return postprocess(resp)
    }
  }
}
