// code away!
const server = require("./server.js")

const port = 5000

server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})