# supramap
Lightweight data store

Transactional, basic type system, code-based queries, simple map-like usage

````
const m = new Supramap()

// .types
console.log(m.types)

// .set(object)
m.set({ _type: 'Person', name: 'Chris', upd: 1 })

// .set(array)  // Transactional
m.set([{ _type: 'Person', name: 'Brandon', upd: 2, age: 19 }])

// Invalid type supplied
try {
    m.set([{ _type: 'Person', name: 'Joe', upd: 3, age: 21 }, { _type: 'Person', bad: 'transaction' }])
} catch(e) {
    console.log(e)
}
console.log(m.json())

// .get(id) type:name
const query1 = m.get('Person:Chris')
console.log(query1)

// .query(function) // returns array
const query2 = m.query((e) => { return e.age < 40 })
console.log(query2)

// .json()
console.log(query2[0].json())

// .save(filename)
m.save('data/test.json')

// .load(filename)
const y = new SupraMap()
y.load('data/test.json')
console.log(y.json())
```
