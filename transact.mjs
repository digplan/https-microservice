const Integrations = {
  "Test": {
    "url": "https://randomuser.me/api?n=5",
    "process": (resp) => {
      // return an array of objects
      return resp.results.map(user => {
        return `${user.name.first} ${user.name.last}`
      })
    },
    "schema": 'Person'
  }
}

import fetch from 'node-fetch'
class Transact {
  getIntegration(name, options= {}) {
    if (!Integrations[name]) throw Error(`Integration ${name} not found`)
    const { debug } = options
    return async function(p1, p2, p3) {
       const {url, method = 'GET', body, headers = {"Content-Type":"application/json"}, process = (s)=>s} = Integrations[name]
       const params = { method: method, headers: headers, credentials: 'include' }
       if(body) params.body = JSON.stringify(body)
       if(debug) console.log(`----> fetching ${method} ${url} ${JSON.stringify(params)}`)
       const f = await fetch(url, params)
       if(debug) console.log(f)
       const resp = await f.json()
       if(!resp) resp = await f.text()
       return await process(resp)
    }
  }
}

export { Transact }