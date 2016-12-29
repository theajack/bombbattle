//墙
var WALL={
  "geneTime":1000,
  "initNum":100,
  "maxNum":200,
  "range":range,
  "idNUm":0,
  "size":0,
  "set":[],
  "init":function(){
    for(var i=0;i<blockNum;i++){
      this.set[i]=[];
    }
    for(var i=0;i<this.initNum;i++){
      this.add(getRp(),getRp());
    }
    setInterval(function(){
      if(WALL.size<WALL.maxNum){
        WALL.add(getRp(),getRp());
      }
    },WALL.geneTime);
    for(key in fun){
      this[key]=fun[key];
    }
  },"add":function(x,y){
    var i=getBlockIndexByPos(x,y);
    this.set[i][this.set[i].length]=new Wall(x,y,i);
    this.size++;
  }
};function Wall(x,y,i){
  this.x=x;
  this.y=y;
  this.id=++WALL.idNUm;
  this.posBi=i;//posBlockIndex;
  this.skillType=SKILL.getRandType();
  this.area=getObjAreaIndex(this);//涉及区域
  this.range=0;
};Wall.prototype.ruin=function(){//负责爆出道具或技能，不负责销毁对象
  
};Wall.prototype.getSkillType=function(){//负责爆出道具或技能，不负责销毁对象
  //var t=getRandomNum()
  return 1;
};Wall.prototype.remove=function(){
  
};Wall.prototype.draw=function(){
  if(this.range<WALL.range){
    this.range++;
  }
  if(isObjVisible(this.x,this.y,this.range)){
    var pos=getDrawPos(this.x,this.y);
    ctx.drawImage(wallImg,pos.x-this.range,pos.y-WALL.range,this.range*2,this.range*2);
  }
  map.drawLittle(this.x,this.y,"#ff0");
};Wall.prototype.getRange=function(){
  return this.range;
};Wall.prototype.beBombed=function(bombid){
  SKILL.add(this,bombid);
  WALL.removeObj(this);
}
      