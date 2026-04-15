let rc
let seq1,seq2,brat
// let relDist=0.5
let rels=[10,10,10,10,64,64,64,0]
let stepIndex=0

let rel6CellRadSteps=[25,50,75,100,127,5]
let rel6CellRadStep=0
rels[6]=rel6CellRadSteps[rel6CellRadStep]

let rel7DriftSteps=[0,20,50]
let rel7DriftStep=0
rels[7]=rel7DriftSteps[rel7DriftStep]

function setup() {
  createCanvas(windowWidth, windowHeight);
  rc=new RepelCellsRadial(3)
  // seq1=new Seq1()
  // seq2=new Seq2()
  brat=new Brat()
}

function draw() {
  // rels[3]=floor(map(mouseX,0,width,0,127))
  background(0);
  rc.run(rels[0],rels[1], rels[2], rels[3], rels[4], rels[5], rels[6],rels[7])
  // seq1.run()
  // seq2.run()
  // brat.run()
}

function updateValue(controller,type,value){
    let c=parseInt(controller)
    let v=parseInt(value)
    console.log(c, v)
    if(c>-1 && c <8){
        if(c%2==0 && type=="pot" || c%2==1 && type=="pad"){
            if(c==0){ //pot disturber size
                rels[3]=floor(map(v,0,255,10,127))
            } else if(c==1){ //pad cyle cell size
                actions.pads[0]()
            } else if(c==2){ //pot disturber direction
                rels[1]=floor(map(v,0,255,0,127))
            } else if(c==3){ //pad colour change
                actions.pads[4]()
            } else if(c==4){ //pot disturber speed
                rels[2]=floor(map(v,0,255,3,127))
            } else if(c==5){ //pad change scale
                actions.pads[5]()
            } else if(c==6){ //pot disturber stiff/decay
                rels[4]=floor(map(v,0,255,10,127))
            } else if(c==7){ //pad cycle cell flows
                actions.pads[1]()
            }
        }
    }
}

function mousePressed(){
  // seq1.trigger()
  // brat.trigger()
  // actions.pads[0]()
}

// function mouseMoved(){
//   rc.buildCells()
// }

function Seq1(){
  let ttlMax=30
  let ttl=0
  let relsNom=[...rels]
  let ease=20
  let maxSize=0.5

  this.trigger=function(){
    ttl=ttlMax
    relsNom=[...rels]
    rc.centreDist()
    rels[2]=0
  }

  this.run=function(){
    maxSize=map(rels[0],0,127,0,1)
    if(ttl>0){
      ttl--
      rels[3]=sin(-PI/2+TWO_PI*(1-ttl/ttlMax))*64*maxSize+64*maxSize
      // rels[4]=127//sin(-PI/2+TWO_PI*(1-ttl/ttlMax))*32+64
      // rels[5]=0//sin(-PI/2+TWO_PI*(1-ttl/ttlMax))*32+64
      // console.log(rels[3])
    } else {

      // rels.forEach((rel,i)=>{
      //   rel+=(relsNom[i]-rel)/ease
      // })
    }
  }
}

function Seq2(){
  let ttlMax=30
  let ttl=0
  let relsNom=[...rels]
  let ease=20
  let maxSize=0.5

  this.trigger=function(){
    ttl=ttlMax
    relsNom=[...rels]
    rc.centreDist()
    rels[2]=0
  }

  this.run=function(){
    maxSize=map(rels[0],0,127,0,1)
    if(ttl>0){
      ttl--
      rels[3]=sin(-PI/2+TWO_PI*(1-ttl/ttlMax))*64*maxSize+64*maxSize
      rels[4]=sin(-PI/2+TWO_PI*(1-ttl/ttlMax))*32+64
      rels[5]=sin(-PI/2+TWO_PI*(1-ttl/ttlMax))*32+64
      // console.log(rels[3])
    } else {

      // rels.forEach((rel,i)=>{
      //   rel+=(relsNom[i]-rel)/ease
      // })
    }
  }
}

function Brat(){
  let ttlMax=100
  let ttl=0
  let bratOn=false
  let bgOn=false
  let message=2;
  let numMessages=3;
  let thesholdBg=10
  let thresholdBrat=25
  let alph=0
  let alphF=0
  let ease=5
  
  
  this.trigger=function(){
    ttl=ttlMax
    message=(message+1)%numMessages
  }
  
  this.run=function(){
    if(ttl>0){
      
      ttl--
      if(random(100)<thresholdBrat){
        bratOn=!bratOn
      }
      bratOn=true
      bgOn=true
      alph=sin(frameCount/8)*128+128
      alphF=sin(frameCount/5)*128+128
      // if(random(100)<thesholdBg){
      //   bgOn=!bgOn
      // }
      // if(bgOn){
      //   alph+=(255-alph)/ease
      // } else {
      //   alph+=(0-alph)/ease
      // }
    } else {
      alph+=(0-alph)/ease
      alphF+=(0-alph)/ease
    }
  }
  
  this.showBg=function(){
    if(bgOn && ttl>0){
      background(200,40,0,alph);//'#8ACE00'
    }
  }
  
  this.showFg=function(){
    if(bratOn && ttl>0){
      push()
      if(message==0){
        textSize(height)
        textFont('arial')
        scale(0.35,1)
        textAlign(LEFT,CENTER)
        fill(0,alphF)
        text('Made @',0,height/2)
        
      } else if(message==1){
        textSize(height*0.7)
        textFont('arial')
        translate(width,0)
        scale(-0.35,1)
        textAlign(LEFT,CENTER)
        // fill(80,100-alph/255*100,40-alph/255*40,1)
        fill(0, alphF)
        text('Locksbrook',0,height*0.35)
        // textSize(height*0.15)
        // textFont('arial')
        // translate(width,0)
        // scale(-0.75,1)
        // textAlign(LEFT,TOP)
        // fill(0)
        // text('completely different but also still art',0,height*0,width*0.3,height)
      } else if(message==2){
        textSize(height*0.7)
        textFont('arial')
        translate(width,0)
        scale(-0.5,1)
        textAlign(LEFT,CENTER)
        // fill(80,100-alph/255*100,40-alph/255*40,1)
        fill(0, alphF)
        text('Lates',0,height*0.6)
        // textSize(height*0.15)
        // textFont('arial')
        // translate(width,0)
        // scale(-0.75,1)
        // textAlign(LEFT,TOP)
        // fill(0)
        // text('completely different but also still art',0,height*0,width*0.3,height)
      }
      pop()
    }
  }
}

let rcMode=0;
let numrcModes=2;

function switchModes(){
  rcMode=(rcMode+1)%numrcModes
  stepIndex=rc.getSteps()
  if(rcMode==0){
    rc=new RepelCells(stepIndex)
  } else if(rcMode==1){
    rc=new RepelCellsLinear(stepIndex)
  }
}

let myInput
let controlData={
  pots:[
    0,0,0,0,0,0,0,0
  ],
  pads:{
    lastPad: -1,
    lastVel:0
  }
}
const potsCode=176
const padsCode=185
const noteCode=153

let actions={
  pads:{
    0:function(){
      // rc.randomDist()
      // switchModes();
      rel6CellRadStep=(rel6CellRadStep+1)%rel6CellRadSteps.length
      rels[6]=rel6CellRadSteps[rel6CellRadStep]
    },
    1:function(){
      rel7DriftStep=(rel7DriftStep+1)%rel7DriftSteps.length
      rels[7]=rel7DriftSteps[rel7DriftStep]
      // rc.centreDist()
      // seq2.trigger()
    },
    2:function(){
      seq1.trigger()
    },
    3:function(){
      brat.trigger()
    },
    4:function(){
      rc.changeColMode()
    },
    5:function(){
      rc.buildCells()
    },
    6:function(){
      // switchModes();
    },
    7:function(){
      
    }
  },
  pots:{
    0:function(){
      // rc.buildCells(rels[0])
    },
    1:function(){
      
    },
    2:function(){
      
    },
    3:function(){
      
    },
    4:function(){

    },
    5:function(){
      
    },
    6:function(){
      
    },
    7:function(){
      
    }
  }
}

// WebMidi
//   .enable()
//   .then(onEnabled)
//   .catch(err => alert(err));

// function onEnabled() {
  
//   // Inputs
//   WebMidi.inputs.forEach(input => console.log(input.name));
  
//   // Outputs
//   WebMidi.outputs.forEach(output => console.log(output.manufacturer, output.name));

  
//   myInput = WebMidi.getInputByName("LPD8 mk2");
//   myInput.addListener("noteon", e => {
//     if(e.data[0]==noteCode){
//       controlData.pads.lastPad=e.data[1]-36
//       controlData.pads.lastVel=e.data[2]
//     }
//     padHit(controlData.pads.lastPad)
//   })
  
//   WebMidi.inputs[0].addListener("controlchange", e => {
//     // console.log(e.data[0], e.data[1],e.data[2]);
//     if(e.data[0]==potsCode){
//       controlData.pots[e.data[1]-70]=e.data[2]
//       potTurned(e.data[1]-70,e.data[2])
//     } else if(e.data[0]==padsCode){
//       controlData.pads.lastPad=e.data[1]-12
//       controlData.pads.lastVel=e.data[2]
//       padHit(controlData.pads.lastPad)
//     }
//   });
// }

let pads=[]
let pots=[]


function padHit(n){
  console.log('pad hit:'+n+" = "+(n+4)%8)
  actions.pads[n]()
  if(n>=4){
    // changeSkin((n+4)%8)
  } else {
    // skins[currentSkin].controlPads(n)
  }
}

function potTurned(n,val){
  // console.log('pot '+n+' turned to '+val)
  // skins[currentSkin].controlPots(n,val)
  rels[n]=val
  if(n==4){
    rels[5]=127-val
    console.log(rels[n],rels[5])
  }
  actions.pots[n]()
}