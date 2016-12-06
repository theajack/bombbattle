var RIVAL={
  "aiNum":30,
  "statuTime":2000,
  "isAi":true,
  "size":0,
  "set":[],
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
  this.id=parseInt(data.id);
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
  this.name=data.id;
  
  this.isInvici=true;
  
  this.statuText="";
  this.textStyle="";
  this.showStatu=false;
  this.showStatuTime=0;
  this.img=aiImg;
  this.speed=1.5;//速度
  this.hp=3;//生命值
  this.power=6;//炸弹范围
  this.damage=1;//伤害
  this.bombNum=0;//已放置炸弹数
  this.bombMaxNum=2;
  
  addProtoFun(Rival,playerFun);
  this.area=getObjAreaIndex(this);//涉及区域
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
  ctx.fillText(this.name,pos.x,pos.y);
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
};
