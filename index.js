const express = require('express')
const { createServer } = require('http')
const WebSocket = require('ws')

const app = express()
const server = createServer(app)
const port = process.env.PORT || 10000

const wss = new WebSocket.Server({ server, path: '/ws' })

function heartbeat() {
  this.isAlive = true
}

wss.on('connection', function connection(ws) {
  ws.isAlive = true
  console.log('connection received')
  ws.on('error', console.error)
  ws.on('pong', heartbeat)

  ws.on('message', (message) => {
    console.log('Received:', message.toString())
    ws.send(message.toString())
    // wss.clients.forEach(function each(client) {
    //   if (client !== ws && client.readyState === WebSocket.OPEN) {
    //     client.send(msgJ);
    //   }
    // });
    // ws.send('Hello over WebSocket!')
  })
})

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate()

    ws.isAlive = false
    ws.ping()
  })
}, 30000)

wss.on('close', function close() {
  clearInterval(interval)
})

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})