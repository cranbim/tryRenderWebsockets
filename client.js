const WebSocket = require('ws')

// const wsUrl = 'wss://example-app.onrender.com/ws'
const wsUrl = 'wss://tryrenderwebsockets.onrender.com/ws'
let ws = null
let reconnectAttempts = 0
const maxReconnectAttempts = 10
const baseBackoffDelay = 1000
let pingInterval = null
let pongTimeout = null
let messageInterval=null
let messageCount=0;

function connect() {
  ws = new WebSocket(wsUrl)

  ws.on('open', () => {
    console.log('Connected to server')
    reconnectAttempts = 0
    // startPinging()
    startMessages()
  })

  ws.on('message', (data) => {
    console.log('Received:', data.toString())
  })

  ws.on('pong', () => {
    clearTimeout(pongTimeout)
  })

  ws.on('close', (code, reason) => {
    console.log(`Connection closed: ${code} ${reason}`)
    cleanup()
    handleReconnect()
  })

  ws.on('error', (error) => {
    console.error('WebSocket error:', error.message)
  })
}

function startMessages(){
  console.log('start messages')
  messageInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(`message ${messageCount++}`)
    } else {
        console.log('no longer connected')
    }
  }, 5000)
}

function startPinging() {
  console.log('start pings')
  pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping()

      pongTimeout = setTimeout(() => {
        console.log('No pong received, terminating stale connection')
        ws.terminate()
      }, 10000)
    } else {
        console.log('not connected')
    }
  }, 1000)
}

function handleReconnect() {
  if (reconnectAttempts >= maxReconnectAttempts) {
    console.error('Max reconnection attempts reached')
    return
  }

  reconnectAttempts++
  const delay = Math.min(baseBackoffDelay * Math.pow(2, reconnectAttempts - 1), 60000)

  console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts})`)
  setTimeout(connect, delay)
}

function cleanup() {
  clearInterval(pingInterval)
  clearTimeout(pongTimeout)
}

connect()