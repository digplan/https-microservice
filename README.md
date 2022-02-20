# https-microservice
[![npm version](https://badge.fury.io/js/https-microservice.svg)](https://badge.fury.io/js/https-microservice)
![size](http://img.badgesize.io/digplan/https-microservice/master/https-microservice.mjs)

Zero config https server

####npx https-microservice
Add middleware and routes folders OR routes.mjs, to you current directory

Then just do,
> npx https-microservice

more info
> debug=true node start.mjs

````
// routes.mjs

export default {
    '/index': (r, s, data) => {
        // r = request
        // s = response
        // data = json body data
        // r.server = server

        // examples
        s.writeHead(404).end()
        s.end('this is a reponse')
        s.endJSON( { message: 'this is also a response' } )
    }
}
````

Another option is to use middleware and routes folders instead of routes.mjs

Each file in a middleware folder runs on every request

showRequest.mjs
````
export default function(r, s, data) {
  console.log('URL: ' + r.url)
}
````

Each file in a routes folder runs when match the first path in url

api.mjs
````
export default function(r, s, data) {
   // insert to a db..  
   if(r.method === 'POST') r.server.db.insert(data)
}

or use classes:

export default class {

    GET (r, s, data) {
        s.endJSON(r.server.db[r.url])
    }

    POST (r, s, data) {
        r.server.db.insert(data)
    }

}
````
