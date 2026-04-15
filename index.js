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
let unallocatedControls=[0,1,2,3,4,5,6,7]
let allocatedControls=[]
const appIdentifier="blvc26"

app.get("/", (req, res) => res.type('html').redirect("demo.html"));
app.get("/live", (req, res) => res.type('html').redirect("live.html"));
app.get("/blvc", (req, res) => res.type('html').redirect("blvc.html"));


const wss = new WebSocket.Server({ server, path: '/ws' })

function heartbeat() {
  this.isAlive = true
}

function getNextConnection(ws){
    let allocatedConnection=-99
    if(true){
        allocatedConnection=nextConnection++
    }
    return allocatedConnection
}

function getControl(ws){
    let allocatedControl=-99
    if(unallocatedControls.length>0){
        let aControl=unallocatedControls.shift()
        allocatedControls.push(aControl)
        allocatedControl=aControl
    }
    console.log(unallocatedControls,allocatedControls)
    return allocatedControl
}

// function releaseControl(c){
//     let ci=allocatedControls.findIndex(c)
//     if(ci>-1){
//         allocatedControls.splice(ci,1)
//         unallocatedControls.push(c)
//     }
//     console.log(unallocatedControls,allocatedControls)
// }
let liveClientDemo=null //demo showing live response to inputs
let liveClient=null //active control driven visuals

wss.on('connection', function connection(ws) {
  let myConnection=getNextConnection(ws)
  let myContol=getControl(ws)
  ws.isAlive = true
  if(myConnection>-1){
    console.log('connection received, allocating: ',myConnection)
    sendMessage('setID',myConnection)
  } else {
    console.log('connection not allocated')
  }
  if(myContol>-1){
    console.log('control allocated: ',myContol)
    sendMessage('setControl',myContol)
  } else {
    console.log('control not allocated')
  }

  ws.on('error', console.error)
//   ws.on('pong', heartbeat)
    
  function sendMessage(type,val){
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

  function deallocateControl(){
    console.log("deallocate control",myContol)
    let ci=allocatedControls.findIndex(i => i==myContol)
    if(ci>-1){
        allocatedControls.splice(ci,1)
        unallocatedControls.push(myControl)
    }
    console.log(unallocatedControls,allocatedControls)
    myContol=-99
    // let message={
    //     appID: appIdentifier,
    //     data:{
    //         type: "setControl",
    //         value: -99
    //     }
    // }
    // ws.send(JSON.stringify(message));
  }

  ws.on('message', (message) => {
    console.log('Received:', message.toString())
    let parsed=JSON.parse(message)
    if(parsed.appID==appIdentifier){
        if(parsed.data.type=="live" && parsed.data.value=="0"){
            liveClientDemo=ws
            sendData("youAreLiveDemo",0)
            deallocateControl()
        }
        if(parsed.data.type=="live" && parsed.data.value=="1"){
            liveClient=ws
            sendData("youAreLive",1)
            deallocateControl()
        }
        if(parsed.data.type=="resetControls"){
            unallocatedControls=[0,1,2,3,4,5,6,7]
            allocatedControls=[]
            wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                let message={
                    appID: appIdentifier,
                    data:{
                        type: "setControl",
                        value: -99
                    }
                }
                client.send(JSON.stringify(message));
            }
            });
        }
    }
    if(liveClientDemo !== null){
        liveClientDemo.send(message.toString())
    }
    if(liveClient !== null){
        liveClient.send(message.toString())
    }
    ws.send(message.toString()) //debug, echo back to sender
    // wss.clients.forEach(function each(client) {
    //   if (client !== ws && client.readyState === WebSocket.OPEN) {
    //     client.send(msgJ);
    //   }
    // });
    // ws.send('Hello over WebSocket!')
  })

  function sendData(type, val){
        if(ws.readyState === WebSocket.OPEN){
            // connection.send(val.toString())
            let message={
                appID: appIdentifier,
                data:{
                    type: type,
                    value: val
                }
            }
            console.log('I am sending :'+message);
            ws.send(JSON.stringify(message));
        } else {
            console.log('I am not connected')
        }
    }

//   ws.on('close', function (){
//     let ci=allocatedControls.findIndex(myContol)
//     if(ci>-1){
//         allocatedControls.splice(ci,1)
//         unallocatedControls.push(c)
//     }
//     console.log(unallocatedControls,allocatedControls)
//     myContol=-99
//   })
})

// const interval = setInterval(function ping() {
//   wss.clients.forEach(function each(ws) {
//     if (ws.isAlive === false) return ws.terminate()

//     ws.isAlive = false
//     ws.ping()
//   })
// }, 30000)

// wss.on('close', function close() {
//   clearInterval(interval)
// })

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

