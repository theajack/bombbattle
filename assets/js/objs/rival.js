var RIVAL={
  "aiNum":60,
  "statuTime":2000,
  "isAi":true,
  "size":0,
  "set":[],
  "idNum":0,//id
  "init":function(){
    for(var i=0;i<blockNum;i++){
      this.set[i]=[];
    }
    addFun(this,fun);
  },
  "add":function(data){
    var i=getBlockIndexByPos(data.x,data.y);
    this.set[i][this.set[i].length]=new Rival(data,i);
    this.size++;
  },
  "changeSet":function(rival,index){
    var n=rival.posBi;
    for(var i=0;i<this.set[n].length;i++){
      if(this.set[n][i].id==rival.id){
        this.set[n][i]=this.set[n][this.set[n].length-1];
        this.set[n].length--;
        break;
      }
    }
    this.set[index][this.set[index].length]=rival;
  }
};function Rival(data,i){
  this.id=++RIVAL.idNum;
  this.x=parseFloat(data.x);//相对于map
  this.y=parseFloat(data.y);
  this.posBi=i;//posBlockIndex;
  if(RIVAL.isAi){
    this.tx=this.x;
    this.ty=this.y;
  }
  this.time=0;
  this.alp=2;
  this.range=range;//半径
  this.color="#0f0";
  this.name=names[getRandomNum(0,nameNum-1)];//"doge"+this.id;
  
  this.isInvici=true;
  
  this.statuText="";
  this.textStyle="";
  this.showStatu=false;
  this.showStatuTime=0;
  this.img=aiImg;
  this.speed=1.5;//速度
  this.hp=3;//生命值
  this.power=8;//炸弹范围
  this.damage=1;//伤害
  this.bombNum=0;//已放置炸弹数
  this.bombMaxNum=2;
  
  addProtoFun(Rival,playerFun);
  this.area=getObjAreaIndex(this);//涉及区域
  
  this.bombTime=0;
  this.bombTimeMax=5500+getRandomNum(-2000,2000);
  
  this.isPosChange=true;
}Rival.prototype.draw=function(){
  var isVis=isObjVisible(this.x,this.y,this.range);
  var pos=getDrawPos(this.x,this.y);
  if(this.isInvici){
    this.countInviciTime(isVis);
  }else{
    if(isVis){
      ctx.drawImage(this.img,pos.x-this.range,pos.y-this.range,this.range*2,this.range*2);
    }
  }
  getNameTextStyle();
  //ctx.fillText(this.name+"  "+this.hp,pos.x,pos.y);
  ctx.fillText(this.name,pos.x,pos.y-this.range-25);
  ctx.fillText("HP:"+this.hp+" D:"+this.damage,pos.x,pos.y-this.range-10);
  if(this.showStatu){
    this.drawStatu();
  }
  map.drawLittle(this.x,this.y,"#f00");
};Rival.prototype.modAttr=function(data){
  this.x=parseFloat(data.x);
  this.y=parseFloat(data.y);
  this.resetPbi();
  this.resetArea();
};Rival.prototype.act=function(data){
  if(RIVAL.isAi){
    this.bombTime+=actt;
    if(this.bombTime>this.bombTimeMax){
      this.placeBomb();
      this.bombTime=0;
    }
  }
  this.testObj();
  this.dis=countDis(this.x,this.y,this.tx,this.ty);
  if(this.dis>1){//1为防抖动参数
    this.x+=(this.tx-this.x)*this.speed/this.dis;
    this.y+=(this.ty-this.y)*this.speed/this.dis;
    this.resetPbi();
    this.resetArea();
  }else{
    if(RIVAL.isAi){
      this.tx=getRp();
      this.ty=getRp();
    }
    return false;
  }
};Rival.prototype.remove=function(){
  RIVAL.removeObj(this);
};Rival.prototype.resetPbi=function(){
  var i=getBlockIndexByPos(this.x,this.y);
  if(this.posBi!=i){
    RIVAL.changeSet(this,i);
    this.posBi=i;
  }
};Rival.prototype.placeBomb=function(){//人机
  var pb={
    "x":parseInt(this.x),
    "y":parseInt(this.y),
    "posBi":this.posBi,
    "pid":this.id,
    "power":this.power,
    "damage":this.damage
  };
};Rival.prototype.testObj=function(dx,dy){
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
};Rival.prototype.testStillObj=function(obj,mdx,mdy){
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
};Rival.prototype.testSkill=function(skill){
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
};Rival.prototype.testRival=function(obj){
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
};Rival.prototype.move=function(dx,dy){
  if(!this.addxy(dx,dy)){
    if(!this.addx(dx)){
      if(!this.addy(dy)){
        this.isPosChange=false;
      }
    }
  }
};Rival.prototype.addx=function(dx){
  if(isInMapx(this.x+dx)){
    this.x+=dx;
    this.isPosChange=true;
    return true;
  }
  return false;
};Rival.prototype.addy=function(dy){
  if(isInMapy(this.y+dy)){
    this.y+=dy;
    this.isPosChange=true;
    return true;
  }
  return false;
};Rival.prototype.addxy=function(dx,dy){
  if(isInMap(this.x+dx,this.y+dy)){
    this.x+=dx;
    this.y+=dy;
    this.isPosChange=true;
    return true;
  }
  return false;
}
