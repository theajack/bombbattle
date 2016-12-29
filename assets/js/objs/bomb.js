//炸弹
var BOMB={//公用数据
  "maxTime":3000,//炸弹等待时间
  "maxIndex":40,//数值越小，爆炸越快
  "range":range,
  "height":range*2,//炸弹宽度
  "idNum":0,//炸弹id
  "size":0,
  "set":[],
  "init":function(){
    for(var i=0;i<blockNum;i++){
      this.set[i]=[];
    }
    for(key in fun){
      this[key]=fun[key];
    }
  },
  "add":function(obj){
    this.set[obj.posBi][this.set[obj.posBi].length]=new Bomb(obj);
    this.size++;
  }
};function Bomb(obj){
  this.x=obj.x;
  this.y=obj.y;
  this.power=obj.power;
  this.damage=obj.damage;
  this.posBi=getBlockIndexByPos(obj.x,obj.y);//posBlockIndex;
  this.id=++BOMB.idNum;
  this.owner=obj;//玩家id
  this.img=null;
  this.color="#000";
  this.time=0;
  this.bombIndex=0;
  this.width=range*2;
  this.addLen=(this.power*this.width*2-this.width)/BOMB.maxIndex;
  this.area=getBombAreaIndex(this);//爆炸涉及区域
  this.pid=obj.id;
  this.canTouch=true;
  this.range=0;
  this.textStyle="";
  this.statuText="";
  this.showStatu=true;
  this.isBombed=false;
};Bomb.prototype.act=function(){
  if(this.time>=BOMB.maxTime){
    this.bomb();
  }else{
    this.tick();
  }
};Bomb.prototype.bomb=function(){//计算爆炸尺寸
  this.bombIndex++;
  if(this.bombIndex==BOMB.maxIndex){
    this.remove();//爆炸结束
  }else{
    if(!this.isBombed){
      this.owner.bombNum--;
      this.isBombed=true;
    }
    if(this.bombIndex<=BOMB.maxIndex/2){//伸
      this.width+=this.addLen;
    }else if(this.bombIndex>BOMB.maxIndex/2&&this.bombIndex<BOMB.maxIndex){//缩
      this.width-=this.addLen;
    }
    this.checkObj();//查找命中目标
  }
};Bomb.prototype.draw=function(){
  if(this.bombIndex==0){//未爆炸
    if(isObjVisible(this.x,this.y,this.range)){
      var pos=getDrawPos(this.x,this.y);
      /*ctx.fillStyle="#000";
      ctx.beginPath();
      ctx.arc(pos.x,pos.y,BOMB.range,0,Math.PI*2,true);
      ctx.closePath();
      ctx.fill();*/
      ctx.drawImage(bombImg,pos.x-this.range,pos.y-this.range,this.range*2,this.range*2);
      getStatuTextStyle();
      ctx.fillStyle = "#f00";
      var w=((1-this.time/BOMB.maxTime)*(BOMB.range+this.power))*2
      ctx.fillRect(pos.x-w/2, pos.y-BOMB.range-this.damage*2-8,w,this.damage*2+4);
      //setTextSize(20);
      //ctx.fillText("r"+thispower+"|d"+this.damage,pos.x, pos.y-BOMB.range-this.damage*3-10);
    }
  }else{
    if(isObjVisible(this.x,this.y,this.width)){
      var pos=getDrawPos(this.x-this.width/2,this.y-BOMB.height/2);
      ctx.drawImage(fireImgw,pos.x,pos.y,this.width,BOMB.height);
      var len=(this.width-BOMB.height)/2;
      ctx.drawImage(fireImgh,pos.x+len,pos.y-len,BOMB.height,this.width);
    }
  }
  map.drawLittle(this.x,this.y,"#000");
};Bomb.prototype.tick=function(){
  if(this.time>=1000&&this.canTouch){
    this.canTouch=false;
  }
  if(this.range<BOMB.range){
    this.range++;
  }
  this.time+=actt;
};Bomb.prototype.remove=function(){
  BOMB.removeObj(this);
};Bomb.prototype.beBombed=function(){//被引爆
  this.time=BOMB.maxTime;//跳过等待时间
};Bomb.prototype.checkObj=function(){
  var b=this;
  BOMB.eachByPosArray(this.area,function(bomb){
    if(b.testObj(bomb)){
      bomb.beBombed();
    }
  });
  if(this.pid==player.id){
    RIVAL.eachByPosArray(this.area,function(obj){
      if(b.testObj(obj)){
        if(obj.behurt(b.damage)){
          RIVAL.removeObj(obj);
          killRival();
          /*RIVAL.add({
            "x":getRp(),
            "y":getRp()
          })*/
        };
      }
    });
  }
  WALL.eachByPosArray(this.area,function(obj){
    if(b.testObj(obj)){
      obj.beBombed(b.id);
    }
  });
  /*SKILL.eachByPosArray(this.area,function(obj){
    if(b.testObj(obj)){
      obj.beBombed(b.id);
    }
  });*/
  if(this.testObj(player)){
    if(player.behurt(this.damage)){
      gameLoose();
    }
  }
};Bomb.prototype.testObj=function(obj){
  var r=obj.getRange();
  var x=this.x-this.width/2-r;
  var y=this.y-BOMB.height/2-r;
  if(isInRect(obj.x,obj.y,x,y,this.width+r*2,BOMB.height+r*2)){
    return true;
  }
  var len=(this.width-BOMB.height)/2;
  if(isInRect(obj.x,obj.y,x+len,y-len,BOMB.height+r*2,this.width+r*2))  {
    return true;
  }
  return false;
};Bomb.prototype.getRange=function(){
  return this.range;
};Bomb.prototype.getMaxWidth=function(){
  return this.power*BOMB.range*2*2;
}
