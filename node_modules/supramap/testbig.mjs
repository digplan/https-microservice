setInterval(() => {
    console.log(process.memoryUsage())
}, 1000);

import {SuperMap} from 'supermap'
const m = new SuperMap()

let i = 1000000
while(i--) {
    m.set({_type: 'Person', name: i, upd: 'sdfsdfsdfsdfsdfsdfsdfsdfs', age: 'asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdas'})
}

console.log(m.size)
