// Things to control parametrically
//distirbLen the diameter of the distruber
//in Cell:
//stiffness and decay
//maxDist
//change er - radius of the cells
//in liquidblob
//relSW stroke
//invert velocity effect on stroke
//change number of cells across/up but will need to drop cells per blob for performance as this gets high low 5 hi 35
//strength and decay on distAcc for distruber motion
//stiffness of cell springs
// creating disturbers randomly and for short durations
//changing the origins of teh liquid blobs to drift over time and then to head back home
//color changes
//number/resolution of cells rc.buildCells

//on press
//drop roving disturber and create a disturber in a random spot
// cretae a growing disturber from the center.

// To DO
/*
Refactor to tidy up
Refactor to expose all the control points
Get midi input from other sketch
*/



function RepelCellsRadial(stepInd=0){
  var lBlobs=[];
  var numLBlobs=10;
  var disturbers=[];
  var numDisturbers=1;
  var disturbLen=20;
  var disturbA=0
  var ox=0, oy=0;
  var wp;
  var ts=200;
  let relDist=0.5

  let distA=-PI/4
  let distSp=0
  // let distRot=0.01
  // let distRA=-PI/4
  // let distRRot=0.007
  // let distR=0
  let distX=0
  let distY=0
  // let distRotA=PI/3
  // let distRotRot=0.003
  let distRotVel=-PI/2
  // let distRotMax=0.03
  let distAcc=createVector(0,0)
  let distDir=0
  let distVel=createVector(0,0)
  let distPos=createVector(width/2, height/2)
  let centre=createVector(width/2, height/2)
  let mPos=createVector(0,0)
  let stepRel=12
  disturbLen=height/stepRel;
  var offX=width/2//height/(stepRel*2);//width/2-8*height/25;
  var offY=height/2//height/(stepRel*2);//height/2-8*height/25;
  let step=height/stepRel
  let wSteps=floor(width/step)
  let colMode=0
  let numColModes=5
  let stepRels=[3,8,12,20]//,25,32]
  let cellsPerRad=[[5,10,15],[5,10,15,20,25,30,35,40],[3,5,9,15,21,27,35,42,49,60,72,81],[3,5,9,15,21,27,35,42,49,60,72,81,90,102,115,130,150,180,200,230]]//,[5,15,25],[5,15,25]]//[3,8,12,20,25,32]
  let blobCells=[100,100,50,50]
  let cellSizeRels=[5,10,20,40]
  let radRels=[0.65,0.7,0.85,1.2]
  let stepRelInd=(stepInd-1+stepRels.length)%stepRels.length//stepRels.length-1
  let cellsPerBlob=30
  
  
  // for(var j=0; j<wSteps; j++){
  //   for(var i=0; i<stepRel; i++){
  //     lBlobs.push(new LiquidBlob(offX+j*height/stepRel, offY+i*height/stepRel, height/(stepRel*2), 0.1, 0.95));
  //   }
  // }
  
  this.changeColMode=function(){
    colMode=(colMode+1)%numColModes
  }

  this.getSteps=function(){
    return stepRelInd;
  }

  this.buildCells=function(val){
    stepRelInd=(stepRelInd+1)%stepRels.length
    stepRel=stepRels[stepRelInd]//map(val,0,127,5,35)
    cellsPerBlob=blobCells[stepRelInd]
    disturbLen=0;//height/stepRel;
    step=height/stepRel
    wSteps=floor(width/step)+1
    let eWidth=wSteps*step
    offX=width/2//(width-eWidth)/2//height/(stepRel*2);//width/2-8*height/25;
    offY=height/2//step/2//height/(stepRel*2);//height/2-8*height/25;
    
    lBlobs=[]
    console.log(offX, offY,stepRel)
    let radCells=cellsPerRad[stepRelInd]
    let cellSizeRel=cellSizeRels[stepRelInd]*0.6
    let radRel=radRels[stepRelInd]
    for(var j=0; j<stepRel; j++){
      let cellsForThisRad=radCells[j]
      let rad=j*radRel*width/stepRel*pow(0.95,j)
      let aStep=TWO_PI/cellsForThisRad
      let cellsPerBlobThisRad=floor(cellsPerBlob*pow(0.9,j))
      for(var i=0; i<cellsForThisRad; i++){
        lBlobs.push(new LiquidBlob(offX+cos(i*aStep)*rad, offY+sin(i*aStep)*rad, cellSizeRel*height/(stepRel*10)*pow(0.8,j), 0.1, 0.95, cellsPerBlobThisRad));
      }
    }
  }

  this.buildCells()
  
  this.randomDist=function(){
      // numDisturbers=2
      distX=random(width)//mouseX
      distY=random(height)//mouseY
      distVel.mult(0)
      distAcc.mult(0)
      distPos.x=distX
      distPos.y=distY
    
      // disturbLen=height/5
  }
  
  this.centreDist=function(){
      // numDisturbers=2
      distX=width/2
      distY=height/2
      distVel.mult(0)
      distAcc.mult(0)
      distPos.x=distX
      distPos.y=distY
      // disturbLen=height/5
  }
  
  this.run=function(rel0,rel1,rel2,rel3,rel4,rel5,rel6,rel7){
    if(colMode==0){
      background(0);
    } else if(colMode==1){
      background(0);
    } else if(colMode==2){
      background(10,10,60);
    } else if(colMode==3){
      background(0);
    } else if(colMode==4){
      background(0);
    }
    brat.showBg()
    relDist=map(rel3,0,127,0.1,3)
    
    colorMode(HSB)
    distA=map(rel1,0,127,-PI,PI)
    distSp=map(rel2,0,127,0,20)
    // distR=sin(distRA)*width/4+width/4
    // distRA+=distRRot
    // distX=width/2+cos(distA)*distR
    // distY=height/2+sin(distA)*distR
    // distRotVel=sin(distRotA)*distRotMax
    // distRotA+=distRotRot
    // mPos.x=mouseX
    // mPos.y=mouseY
    // distAcc=mPos.copy()
    distAcc=p5.Vector.fromAngle(distA-PI/2).mult(distSp)
    // distAcc.sub(centre).mult(0.01)
    distVel.add(distAcc)
    distVel.mult(0.9)
    distPos.add(distVel)
    distPos.x=(distPos.x+width)%width
    distPos.y=(distPos.y+height)%height
    distX=distPos.x
    distY=distPos.y
    
//     if(mouseIsPressed){
//       numDisturbers=2
//       distX=random(width)//mouseX
//       distY=random(height)//mouseY
//       // disturbLen=height/5
//     } else {
//       numDisturbers=0
//     }
    
//     if(mouseIsPressed){
//       numDisturbers=2
      
//       relDist=0.1
//       // disturbLen=height/5
//     } else {
//       numDisturbers=2
//       if(relDist<2){
//         relDist+=0.05
//       }
//     }
    
    // if(distPos.x>width) distPos.x-=width
    // if(distPos.Y>height) distY-=height
    // if(distX<0) distX+=width
    // if(distY<0) distY+=height
    // if(mouseIsPressed){
    //   console.log(distX, distY)
    // }

    distA+=distRotVel
    lBlobs.forEach(function(lBlob){
      lBlob.show(relDist,rel0,rel4,rel5,rel6,rel7,colMode);
    });
    disturbA+=0.01;
    updateDisturbers();
    textAlign(CENTER);
    textSize(height/16);
    fill(30,80,100,0.4);
    noStroke();
    colorMode(RGB)
    brat.showFg()
  }
  
  function updateDisturbers(){
    disturbers=[]
    // disturbLen=5
    for(var i=0; i<numDisturbers; i++){
    // for(var i=0; i<1; i++){
      disturbers[i]={
        x:distX+cos(disturbA+TWO_PI/numDisturbers*i)*disturbLen/2,
        y:distY+sin(disturbA+TWO_PI/numDisturbers*i)*disturbLen/2
      };
    }
  }
  
  function LiquidBlob(x,y,r,s,d,n){
    var cells=[];
    var numCells=n;
    var verts=[];

   for(var i=0; i<numCells; i++){
      // cells[i]=new Cell(i*width/numCells,y+(y-r),s,d);
     let a=TWO_PI*i/numCells
      cells[i]=new Cell(i, x, y, a,r, s, d);
      if(i>0){
        cells[i].prevCell=cells[i-1];
        cells[i].setPrevDist();
        cells[i-1].nextCell=cells[i];
        cells[i-1].setNextDist();
      }
    }
    cells[numCells-1].nextCell=cells[0];
    cells[numCells-1].setNextDist();
    cells[0].prevCell=cells[numCells-1];
    cells[0].setPrevDist();

    this.show=function(relDist,rel0,rel4,rel5,rel6,rel7, colMode){
      verts=[];
      var velAgg=0;
      cells.forEach(function(cell){
        // cell.show();
        // cell.repel();
        cell.repelMany();
        cell.neighbourTension();
        cell.run(relDist,rel4,rel5,rel6,rel7);
        verts.push(cell.getVertex());
        velAgg+=cell.getVertex().v;
      });
      var velMean=velAgg/cells.length;
      // stroke((360-160*velMean)%360,40+60*velMean,60+40*velMean,0.75-0.25*velMean);
      // RGB 138,206,0
      // HSL 80,100,40
      if(colMode==2){
        fill(200+velMean*60,20+80*velMean,50+50*velMean,1-0.25*velMean);
        // fill((map(rel0,0,127,360,0)+360-160*velMean)%360,10+80*velMean,20+70*velMean,0.75-0.25*velMean);
        noStroke();
      } else if(colMode==3){
        fill((map(rel0,0,127,360,0)+360-160*velMean)%360,10+80*velMean,20+70*velMean,0.75-0.25*velMean);
        noStroke();
      } else if(colMode==0){
        stroke(5+velMean*30,100,60+40*velMean,0.75-0.25*velMean);
        noFill();
      } else if(colMode==1){
        stroke(40+velMean*180,100,60+40*velMean,0.75-0.25*velMean);
        noFill();
      // } else if(colMode==2){
      //   fill(0,0,100-95*velMean,0.25+0.5*velMean);
      //   noStroke()
      }

      // if(colMode==3){
      //   fill((map(rel0,0,127,360,0)+360-160*velMean)%360,10+80*velMean,20+70*velMean,0.75-0.25*velMean);
      //   noStroke();
      // } else if(colMode==0){
      //   stroke(0,10,60+40*velMean,0.75-0.25*velMean);
      //   noFill();
      // } else if(colMode==1){
      //   stroke(0,0,90-80*velMean,0.75-0.25*velMean);
      //   noFill();
      // } else if(colMode==2){
      //   fill(0,0,70-65*velMean,0.25+0.5*velMean);
      //   noStroke()
      // }
      
      let relSW=2;//(sin(frameCount/30)+1)*5
      strokeWeight(relSW+velMean*width*0.01);
      // if(invertStroke){
      //   strokeWeight(relSW+5-velMean*15);
      // }
      strokeCap(ROUND)
      
      beginShape();
      verts.forEach(function(v){
        vertex(v.x, v.y);
      });
      endShape(CLOSE);
    };
  }

  function Cell(id,x,y,a,r, s, d){
    let ex=x
    let ey=y
    var stiffness=s;
    var decay=d;
    var maxDistNom=height/4;
    var maxDist=maxDistNom/2
    var repelStiffness=0.001;
    var origin=createVector(x+cos(a)*r,y+sin(a)*r);
    var pos=createVector(0,0);
    var vel=createVector(0,0);
    var velMax=maxDist*stiffness;
    var absPos=origin.copy();
    var repel=createVector(0,0);
    var repelMag=maxDist;
    var acc=createVector(0,0);
    var zero=createVector(0,0);
    let er=1;
    let xShift=1
    let yShift=1


    this.prevCell=null;
    this.nextCell=null;
    var prevDist=0;
    var nextDist=0;
    var neighbourStiffness=0.1*s/(width/r);
    var prevTension=createVector(0,0);
    var nextTension=createVector(0,0);

    this.setNextDist=function(){
      nextDist=p5.Vector.sub(absPos, this.nextCell.getPos()).mag();
    };

    this.setPrevDist=function(){
      prevDist=p5.Vector.sub(absPos, this.prevCell.getPos()).mag();
    };

    this.getPos=function(){
      return absPos;
    }

    this.show=function(){
      noStroke();
      push();
      translate(origin.x, origin.y);
      translate(pos.x, pos.y);
      fill(0,100,100,1);
      ellipse(0,0,5);
      pop();
    };

    this.repel=function(){
      repel=p5.Vector.sub(absPos,createVector(mouseX, mouseY));
      repelMag=repel.mag();
      if(repelMag<maxDist){
        repel.mult((maxDist-repelMag)*repelStiffness);
      } else {
        repelMag=maxDist;
        repel.mult(0);
      }
    };

    this.repelMany=function(){
      repel.mult(0);
      // maxDist=(sin(frameCount/100)+1)*30
      disturbers.forEach(function(d){
        var repelThis=p5.Vector.sub(absPos,createVector(d.x, d.y));
        repelMag=repelThis.mag();
        if(repelMag<maxDist){
          repelThis.mult((maxDist-repelMag)*repelStiffness);
        } else {
          repelMag=maxDist;
          repelThis.mult(0);
        }
        repel.add(repelThis);
      });
    }

    this.neighbourTension=function(){
      var prevTarget=p5.Vector.sub(absPos, this.prevCell.getPos());
      prevTarget.setMag(prevDist).add(this.prevCell.getPos());
      prevTension=p5.Vector.sub(prevTarget, absPos);
      var prevDistNow=prevTension.mag();
      // if(id===0) console.log(id+" "+prevDistNow);
      if(prevDistNow>0){
        prevTension.mult(neighbourStiffness);
      } else {
        prevDistNow=0;
        prevTension.mult(0);
      }

      var nextTarget=p5.Vector.sub(absPos, this.nextCell.getPos());
      nextTarget.setMag(nextDist).add(this.nextCell.getPos());
      nextTension=p5.Vector.sub(nextTarget, absPos);
      var nextDistNow=nextTension.mag();
      // if(id===0) console.log(id+" "+prevDistNow);
      if(nextDistNow>0){
        nextTension.mult(neighbourStiffness);
      } else {
        nextDistNow=0;
        nextTension.mult(0);
      }
    }

    function runPrevTension(){

    }
    


    this.run=function(relDist,rel4,rel5,rel6,rel7){
      maxDist=maxDistNom*relDist
      // stiffness=map(mouseY,0, height, 0.05,5)*s
      // decay=map(mouseX,0, width, 0.8,0.99)
      // console.log(decay)
      // er=r*2+sin(frameCount/100)*r*1.8
      // neighbourStiffness=map(rel6,0,127,s/1,s/100)
      er=map(rel6,0,127,r*0.01,r*2)
      stiffness=map(rel5,0,127,0.01,2)*s
      decay=map(rel4,0,127,0.6,0.99)
      // er=r
      origin.x=ex+cos(a)*er
      origin.y=ey+sin(a)*er;
      acc.add(p5.Vector.sub(zero,pos).mult(stiffness));
      acc.add(repel);
      acc.add(nextTension);
      acc.add(prevTension);
      vel.add(acc);
      vel.mult(decay);
      pos.add(vel);
      acc.mult(0);
      absPos=p5.Vector.add(origin, pos);
      let relShiftX=sin(frameCount/100)*(abs(ey-height/2)/(height/2))
      let relShiftY=cos(frameCount/100)*(abs(ex-width/2)/(width/2))
      let relBend=map(rel7,0,127,0,50)
      
      ex=(ex+xShift*relShiftX*relBend+width)%width
      ey=(ey+yShift*relShiftY*relBend+height)%height
      if(rel7==0){
        ex=x//+=(x-ex)/8
        ey=y//+=(y-ey)/8
      }
    };

    this.getVertex=function(){
      return {
        x:absPos.x,
        y:absPos.y,
        v:vel.mag()/velMax
      };
    };
  }
}


 