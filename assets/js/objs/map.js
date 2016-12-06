
var MAP={
  "textRed":"#f00",
  "textGreen":"#0f0"
};function Map(){//只有一张大地图
  this.len=mapLen;
  this.x=0;//实际位置 相对于screen
  this.y=0;
  this.drawx=0;//绘制的位置
  this.drawy=0;
  this.draww=0;
  this.drawh=0;
  this.bgc="#fff";
  this.space=600;
};Map.prototype.drawMap=function(){
	ctx.clearRect(0,0,winWidth,winHeight);
	mctx.clearRect(0,0,lmapLen,lmapLen);
  mctx.strokeStyle="#fff";
	mctx.strokeRect((player.x-cx)*rate,(player.y-cy)*rate,winWidth*rate,winHeight*rate);
	ctx.fillStyle=this.bgc;
	ctx.fillRect(this.drawx,this.drawy,this.draww,this.drawh);
  ctx.fillStyle="#aaa";
  for(var i=1;i<(this.len/this.space);i++){
    var lx=this.x+i*this.space;
    var ly=this.y+i*this.space;
    if(lx>0&&lx<winWidth){
      ctx.fillRect(lx,this.drawy,1,this.drawh);//画竖线
    }
    if(ly>0&&ly<winHeight){
      ctx.fillRect(this.drawx,ly,this.draww,1);//画横线
    }
    //if(>0&&)
  }
  //ctx.stroke();
  /*for(var i=1;i<this.len/this.space;i++){
    if(i*this.space>this.draww){
      break;
    }else{
      ctx.moveTo(this.drawx+i*this.space,this.drawy);
      ctx.lineTo(this.drawx+i*this.space,this.drawy+this.drawh);
    }
  }
  for(var i=1;i<this.len/this.space;i++){
    if(i*this.space>this.drawh){
      break;
    }else{
      ctx.moveTo(this.drawx,this.drawy+i*this.space);
      ctx.lineTo(this.drawx+this.draww,this.drawy+i*this.space);
    }
  }
  ctx.stroke();*/
  /*ctx.strokeWidth=10;
  for(var d=this.space;d<this.mapLen;d+=this.space){
    ctx.moveTo(this.drawx+d,this.drawy);
    ctx.lineTo(this.drawx+d,this.drawy+this.drawh);
    ctx.moveTo(this.drawx,this.drawy+d);
    ctx.lineTo(this.drawx+this.draww,this.drawy+d);
  }*/
  //ctx.drawImage(playerImg,0,0,this.range*2,this.range*2);
};Map.prototype.resetMap=function(px,py){//根据玩家位置重置地图
  this.x=cx-px;
  this.y=cy-py;
  this.setDrawPara();
};Map.prototype.act=function(dx,dy){//根据玩家位置重置地图
  this.x-=dx;
  this.y-=dy;
  player.resetTarget(dx,dy);
  this.setDrawPara();
};Map.prototype.setDrawPara=function(){
  this.drawx=(this.x<=0)?0:this.x;//绘制的位置
  this.drawy=(this.y<=0)?0:this.y;
  this.draww=((this.x>=winWidth-this.len)?winWidth:this.len+this.x)-this.drawx;
  this.drawh=((this.y>=winHeight-this.len)?winHeight:this.len+this.y)-this.drawy;
};Map.prototype.mapToScreenPos=function(mx,my){
  return {"x":mx+this.x,"y":my+this.y};
};Map.prototype.screenToMapPos=function(sx,sy){
  return {"x":sx-this.x,"y":sy-this.y};
};Map.prototype.drawLittle=function(x,y,color){
  mctx.fillStyle=color;
  mctx.fillRect(x*rate-objHSize,y*rate-objHSize,objLSize,objLSize);
}