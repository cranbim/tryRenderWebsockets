// websocket server for BLVC demo at Third Thursday bath April 2026

const express = require('express')
const { createServer } = require('http')
const WebSocket = require('ws')

const app = express()
const server = createServer(app)
app.use(express.static('public'))
const port = process.env.PORT || 10000
const path = require('path');
console.log(`path: ${__dirname}`)

let connections=[]
let nextConnection=0
let maxConnections=8
const appIdentifier="blvc26"

app.get("/", (req, res) => res.type('html').redirect("demo.html"));


const wss = new WebSocket.Server({ server, path: '/ws' })

function heartbeat() {
  this.isAlive = true
}

function getNextConnection(ws){
    let allocatedConnection=-99
    if(nextConnection<maxConnections-1){
        allocatedConnection=nextConnection++
    }
    return allocatedConnection
}

wss.on('connection', function connection(ws) {
  let myConnection=getNextConnection(ws)
  ws.isAlive = true
  if(myConnection>-1){
    console.log('connection received, allocating: ',myConnection)
    sendMessage('setID',myConnection)
  } else {
    console.log('all connections allocated')
  }
  ws.on('error', console.error)
//   ws.on('pong', heartbeat)
    
  function sendMessage(type,value){
    let message={
                    appID: appIdentifier,
                    data:{
                        type: type,
                        value: val
                    }
                }
    console.log('I am sending :'+message);
    ws.send(JSON.stringify(message));
  }

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

