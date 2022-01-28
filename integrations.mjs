export default {
  "Test": {
    "url": "https://randomuser.me/api?n=5"
    "process": (s) => {
       s.results.map(user => {
          console.log(`user name: ${user.name}`)
       })
    }
  }
}
