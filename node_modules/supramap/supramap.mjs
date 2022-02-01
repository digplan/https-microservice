import fs from 'node:fs'
import BaseType from './basetype.mjs'
import Types from './types.mjs'

class Supramap extends Map {

    types = Types

    query(q) {
        const arr = []
        for (const [_, v] of this) {
            if(q(v))
                arr.push(v)
        }
        return arr
    }

    set(o) {
        if (!Array.isArray(o))
            o = [o]
        o = o.map(item => {
            const newrec = eval(`new ${Types[item._type]}()`)
            newrec.validate(item)
            if (this.has(newrec._id))
                newrec._created = this.get(newrec._id)._created
            delete newrec._type
            return newrec
        })
        for (const rec of o) {
            super.set(rec._id, rec)
        }
    }

    json() {
        const ret = {}
        for (const [k, v] of this) {
            ret[k] = v
        }
        return JSON.stringify(ret, null, 2)
    }

    save(filename) {
        const fp = new URL(filename, import.meta.url).pathname.slice(1)
        fs.writeFileSync(fp, this.json())
        return { filename: fp, records: this.size }
    }

    load(filename) {
        const fp = new URL(filename, import.meta.url).pathname.slice(1)
        const data = JSON.parse(fs.readFileSync(fp))
        for (let rec in data) {
            super.set(rec, data[rec])
        }
        return { filename: fp, records: this.size }
    }

}

export {Supramap}