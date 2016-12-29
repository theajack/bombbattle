//墙
var SKILL={
  "type":{
    //永久加成类 生命 伤害 范围 速度 炸弹数
    "addHp":0,//需添加可视
    "addDamage":1,//通过炸弹时间条宽度可视 待改进
    "addPower":2,//通过炸弹时间条长度可视 待改进
    "addSpeed":3,//无需可视
    "addBombNum":4,//无需可视
    //定时增益类  无敌 透视道具 穿墙和炸弹 隐身 控制炸弹爆炸
    "invic":6,//通过闪烁可视
    "throth":7,//需添加可视
    "hide":8,
    
    "push":9,
    "seeSkill":10,//需添加可视
    //"bombHide", //有点bug  需考虑
    "bombControl":11,//需要增加一个按键 并且炸弹上要有提示 
    
    "slow":12,//定时减益类
    "stop":13,
    "num":5
  },
  "skillTime":6000,//增益类效果时间
  "aa":1,
  "set":[],
  "size":0,
  "idNum":0,
  "range":range+10,
  "getRandType":function(){
    return getRandomNum(0,this.type.num+2);//this.type.num*2);
  },
  "init":function(){
    for(var i=0;i<blockNum;i++){
      this.set[i]=[];
    }
    for(key in fun){
      this[key]=fun[key];
    }
  },
  "add":function(obj,bombid){
    if(obj.skillType<this.type.num){
      this.set[obj.posBi][this.set[obj.posBi].length]=new Skill(obj.x,obj.y,obj.skillType,bombid);
      this.size++;
    }
  }
};function Skill(x,y,type,bombid){
  this.x=parseFloat(x);//相对于map
  this.y=parseFloat(y);
  this.posBi=getBlockIndexByPos(x,y);;//posBlockIndex;
  this.id=++BOMB.idNum;
  this.area=getObjAreaIndex(this);//涉及区域
  this.type=type;
  this.range=0;
  this.bid=bombid;//被哪一个炸弹炸出来的
};Skill.prototype.draw=function(){
  if(this.range<SKILL.range){
    this.range++;
  }
  if(isObjVisible(this.x,this.y,this.range)){
    var pos=getDrawPos(this.x,this.y);
    ctx.drawImage(skillImg[this.type],pos.x-this.range,pos.y-SKILL.range,this.range*2,this.range*2);
  }
  map.drawLittle(this.x,this.y,"#0E0AC5");
};Skill.prototype.getRange=function(){
  return this.range;
};Skill.prototype.beBombed=function(bombid){
  if(bombid!=this.bid){
    SKILL.removeObj(this);
  }
}