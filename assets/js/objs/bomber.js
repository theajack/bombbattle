 
//由服务器主动发的动作：
//      生成墙 新玩家加入时所有数据都要发送
//需要发送给服务器群发的动作：
//      位置改变  放置炸弹  离开游戏
//其他动作有Rival完成，也可与其他玩家同步，因为位置始终同步
//      捡到道具 炸弹爆炸 被炸到
//这样可以减少需要发送的数据，提高效率与同步度
//玩家 
var BOMBER={
  "statuTime":2000
};function Bomber(){
  this.id=0;
  this.x=0;
  this.y=0;
  this.tx=0;//相对于map
  this.ty=0;
  this.dis=0;
  this.range=range;//半径
  this.img=playerImg;
  this.color="#f00";
  this.time=0;
  this.alp=2;
  this.isInvici=true;
  this.isTargetChange=false;
  this.isPosChange=false;
  this.posBi=0;
  this.area=[];//涉及区域
  this.name=names[getRandomNum(0,nameNum-1)];
  this.statuText="";
  this.textStyle="";
  this.showStatu=false;
  this.showStatuTime=0;
  this.bombNum=0;//已放置炸弹数
  this.bombMaxNum=2;
  this.speed=1.5;//速度
  this.hp=5;//生命值
  this.power=8;//炸弹范围
  this.damage=1;//伤害
  addProtoFun(Bomber,playerFun);
};Bomber.prototype.getPosJson=function(){
  return {
    "id":this.id,
    "x":parseInt(this.x),
    "y":parseInt(this.y)
  };
};Bomber.prototype.init=function(data){
  this.id=data.id;
  this.x=data.x;
  this.y=data.y;
  this.resetArea();
  this.resetPbi();
  this.tx=data.x;
  this.ty=data.y;
  map.resetMap(data.x,data.y);
};Bomber.prototype.setTarget=function(x,y){
  this.isTargetChange=true;
  var pos=getMapPos(x,y);
  this.tx=pos.x;
  this.ty=pos.y;
};Bomber.prototype.setTargetDxy=function(dx,dy){
  this.isTargetChange=true;
  this.tx=this.x+dx;
  this.ty=this.y+dy;
};Bomber.prototype.resetTarget=function(dx,dy){
  this.tx+=dx;
  this.ty+=dy;
};Bomber.prototype.draw=function(){
  var pos=getDrawPos(this.x,this.y);
	if(this.isInvici){
		this.countInviciTime(true);
	}else{
		ctx.drawImage(this.img,pos.x-this.range,pos.y-this.range,this.range*2,this.range*2);
	}
  if(this.showStatu){
    this.drawStatu();
  }
  getNameTextStyle();
  //ctx.fillText(this.name+"  "+this.hp,pos.x,pos.y);
  ctx.fillText(this.name,pos.x,pos.y-this.range-25);
  ctx.fillText("HP:"+this.hp+" D:"+this.damage,pos.x,pos.y-this.range-10);
  map.drawLittle(this.x,this.y,"#fff");
};Bomber.prototype.act=function(){
  this.dis=countDis(this.x,this.y,this.tx,this.ty);
  this.isPosChange=false;
  if(this.dis>this.range/2){
    var dx=(this.tx-this.x)*this.speed/this.dis;
    var dy=(this.ty-this.y)*this.speed/this.dis;
    this.move(dx,dy);
  }
  this.testObj(dx,dy);
  if(this.isPosChange){
    this.resetPbi();
    this.resetArea();
    if(!RIVAL.isAi)
      mySocket.sendPlayerPos();
  }
  return this.isPosChange;
};Bomber.prototype.testObj=function(dx,dy){
  var p=this;
  RIVAL.eachByPosArray(this.area,function(rival){
    p.testRival(rival);
  });
	WALL.eachByPosArray(this.area,function(wall){
    p.testStillObj(wall,dx,dy);
  });
	BOMB.eachByPosArray(this.area,function(bomb){
    if(bomb.pid!=p.id||!bomb.canTouch){
      p.testStillObj(bomb,dx,dy);
    }
  });
  SKILL.eachByPosArray(this.area,function(skill){
    p.testSkill(skill);
  });
};Bomber.prototype.testStillObj=function(obj,mdx,mdy){
	var d=countDis(this.x,this.y,obj.x,obj.y);
  var sd=d-(this.range + obj.getRange());
  if(sd<0){
    var r=sd/d;
    var dx=r*(obj.x-this.x);
    var dy=r*(obj.y-this.y);
    if(!this.addxy(dx,dy)){
      this.addxy(-mdx,-mdy);
      this.isPosChange=false;
    }
  }
};Bomber.prototype.testSkill=function(skill){
  if(countDis(this.x,this.y,skill.x,skill.y)-skill.getRange()<0){
    switch(skill.type){
      case SKILL.type.addHp:this.hp++;break;
      case SKILL.type.addDamage:this.damage++;break;
      case SKILL.type.addPower:this.power++;break;
      case SKILL.type.addSpeed:this.speed+=0.1;break;
      case SKILL.type.addBombNum:this.bombMaxNum++;break;
      default:break;
    }
    if(skill.type<SKILL.type.num){
      if(!RIVAL.isAi){
        mySocket.send({
          "pid":this.id,
          "id":skill.id,
          "posBi":skill.posBi,
          "skillType":skill.type
        },method.getSkill);
      }
    }
    SKILL.removeObj(skill);
  }
};Bomber.prototype.testRival=function(obj){
	var d=countDis(this.x,this.y,obj.x,obj.y);
  var sd=d-(this.range + obj.getRange());
  if(sd<0){
    var r=sd/d;
    var dx=r*(obj.x-this.x)/2;
    var dy=r*(obj.y-this.y)/2;
    if(this.addxy(dx,dy)){
      obj.x-=dx;
      obj.y-=dy;
    }else{
      if(this.addx(dx)){
        obj.x-=dx;
      }else if(this.addy(dy)){
        obj.y-=dy;
      }else{
        this.isPosChange=false;
      }
    }
  }
};Bomber.prototype.move=function(dx,dy){
  if(!this.addxy(dx,dy)){
    if(!this.addx(dx)){
      if(!this.addy(dy)){
        this.isPosChange=false;
      }
    }
  }
};Bomber.prototype.addx=function(dx){
  if(isInMapx(this.x+dx)){
    this.x+=dx;
    this.isPosChange=true;
    map.act(dx,0);
    return true;
  }
  return false;
};Bomber.prototype.addy=function(dy){
  if(isInMapy(this.y+dy)){
    this.y+=dy;
    this.isPosChange=true;
    map.act(0,dy);
    return true;
  }
  return false;
};Bomber.prototype.addxy=function(dx,dy){
  if(isInMap(this.x+dx,this.y+dy)){
    this.x+=dx;
    this.y+=dy;
    this.isPosChange=true;
    map.act(dx,dy);
    return true;
  }
  return false;
};Bomber.prototype.isTouched=function(obj){
	if(!this.isInvici){
    if(countDis(this.x,this.y,obj.x,obj.y)<(this.range + obj.range)){
      return true;
    }
	}
  return false;
};Bomber.prototype.resetPbi=function(){
  this.posBi=getBlockIndexByPos(this.x,this.y);
};Bomber.prototype.placeBomb=function(){
  if(this.bombNum<this.bombMaxNum){
    var pb={
      "x":parseInt(this.x),
      "y":parseInt(this.y),
      "posBi":this.posBi,
      "pid":this.id,
      "power":this.power,
      "damage":this.damage
    };
    if(!RIVAL.isAi){
      mySocket.send(pb,method.addBomb);
    }
    this.bombNum++;
  }
}