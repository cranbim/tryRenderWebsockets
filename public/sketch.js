let controlledBlocks=[]

function setup(){
    createCanvas(windowWidth, windowHeight*0.8)
    setupBlocks(8)
}

function setupBlocks(numBlocks){
    let step=width/numBlocks
    for(let i=0; i<numBlocks; i++){
        controlledBlocks[i]=new Controlled((i+0.1)*step,0.1*step,0.8*step,height-0.2*step,i%2==0?'pot':'pad')
    }
}

function draw(){
    background(83,0,135)
    controlledBlocks.forEach(cb=>{
        cb.show()
        cb.run()
    })
    fill(0)
    noStroke()
    circle(mouseX, mouseY, height*0.1)
}

function updateValue(controller,type,value){
    let c=parseInt(controller)
    let v=parseInt(value)
    console.log(c, v)
    if(c>-1 && c <8){
        if(c%2==0 && type=="pot" || c%2==1 && type=="pad"){
            controlledBlocks[c].update(v)
        }
    }
}

class Controlled{
    constructor(x,y,w,h,type){
        this.w=w
        this.h=h
        this.x=x
        this.y=y
        this.value=0.5
        this.rel=1
        this.type=type
    }

    run(){
        if(this.type=="pot"){
            this.runPot()
        } else if(this.type=="pad"){
            this.runPad()
        }
    }

    show(){
        if(this.type=="pot"){
            this.showPot()
        } else if(this.type=="pad"){
            this.showPad()
        }
    }

    update(val){
        this.value=val/255
        this.rel=1
    }

    runPot(){
        this.rel+=(0-this.rel/25)
    }

    runPad(){
        this.rel+=(0-this.rel/10)
    }

    showPot(){
        push()
        translate(this.x, this.y)
        fill(128)
        noStroke()
        rectMode(CORNER)
        rect(0,0,this.w, this.h)
        translate(0,this.h)
        fill(50,30,100+155*this.rel)
        rect(0,0,this.w,-(this.h-10)*this.value-10)
        pop()
    }

    showPad(){
        push()
        translate(this.x, this.y)
        fill(128)
        noStroke()
        rectMode(CORNER)
        rect(0,0,this.w, this.h)
        translate(this.w/2,this.h/2)
        fill(50,30,100+155*this.rel)
        rectMode(CENTER)
        rect(0,0,this.w*this.rel,this.h*this.rel)
        pop()
    }

}
