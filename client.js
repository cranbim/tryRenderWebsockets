const WebSocket = require('ws')

const wsUrl = 'wss://example-app.onrender.com/ws'
let ws = null
let reconnectAttempts = 0
const maxReconnectAttempts = 10
const baseBackoffDelay = 1000
let pingInterval = null
let pongTimeout = null

function connect() {
  ws = new WebSocket(wsUrl)

  ws.on('open', () => {
    console.log('Connected to server')
    reconnectAttempts = 0
    startPinging()
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

function startPinging() {
  pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping()

      pongTimeout = setTimeout(() => {
        console.log('No pong received, terminating stale connection')
        ws.terminate()
      }, 10000)
    }
  }, 30000)
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