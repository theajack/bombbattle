var winHeight = document.body.offsetHeight,
    winWidth = document.body.offsetWidth;
var mapLen=3000;
var lmapLen=300;
var objLSize=4;
var objHSize=objLSize/2;
var rate=lmapLen/mapLen;
var range=26;//所有元素大小一致
var cx=winWidth/2;
var cy=winHeight/2;

var DEG=Math.PI / 180;
var pi=3.1416;
var actt=10;
var drawt=10;
var sendt=10;

var cwLen=100;
var cwRange=cwLen/2;
var cbLen=cwLen/2;
var cbRange=cbLen/2;
var controlCx=10+cwLen/2;
var controlCy=winHeight-controlCx;

function isMobile(){
  if((/AppleWebKit.*Mobile/i).test(navigator.userAgent)){
    return true;
  }else{
    return false;
  }
}
function resetLittleMap(){
  var min=(winHeight<winWidth)?winHeight:winWidth;
  if(min<600){
    lmapLen=min/2
  }
  rate=lmapLen/mapLen;
}
function getRandomNum(Min,Max){  
  return (Min + Math.round(Math.random() * (Max - Min)));   
}
function countDis(x1,y1,x2,y2){
  return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}
function countDeg(x1,y1,x2,y2){//返回值(-180,180]
  return countDegByDxy(x2-x1,y2-y1);
}

function countDegByDxy(dx,dy){//返回值(-180,180]
  if(dx==0){
    return fit(dy)*pi/2;
  }else{
    var d=parseFloat((Math.atan((dy)/(dx))));
    if(dx>0){
      return d;
    }else{
      return d+fit(dy)*pi;
    }
  }
}
function fit(n){//取符号
  if(n>=0){
    return 1;
  }
  return -1;
}
function countMoveDis(deg,speed){//返回值(-180,180]
  return {
    "dx":parseFloat((speed*Math.cos(deg))),
    "dy":parseFloat((speed*Math.sin(deg))),
  };
}
function isObjVisible(x,y,r){
  return isInRect(x+map.x,y+map.y,-r,-r,winWidth+r*2,winHeight+r*2);
}
function isInMap(x,y){
  return isInRect(x,y,0,0,mapLen,mapLen);
}
function isInMapx(x){
  return isInLine(x,0,mapLen);
}
function isInMapy(y){
  return isInLine(y,0,mapLen);
}
function isInRect(x,y,sx,sy,w,h){
  return (x>=sx&&y>=sy)&&(x<=sx+w&&y<=sy+h);
}
function isInLine(a,b,l){
  return (a>b&&a<b+l);
}
function getDrawPos(x,y){
  return map.mapToScreenPos(x,y);
}
function getMapPos(x,y){
  return map.screenToMapPos(x,y);
}


//把地图划分为n*n块 依次标记为 0，1...，n*n-1，
var size=5;
var blockNum=size*size;
var blockLen=mapLen/size;
function getBlockIndex(obj){//得出某元素的块位置 （唯一）
  return getBlockIndexByPos(obj.x,obj.y);
}

function getBombAreaIndex(bomb){//计算炸弹能涉及的块id
  var os=range*2;//短的偏移量
  var ol=bomb.getMaxWidth()/2;//长的偏移量
  var x=bomb.x;
  var y=bomb.y;
  return getBlockIndexByPoints([x-os,y-ol,x+os,y-ol,x-os,y+ol,x+os,y+ol,x-ol,y-os,x-ol,y+os,x+ol,y-os,x+ol,y+os]);
}
function removeSameIndex(indexs){
  for(var i=0;i<indexs.length-1;i++){
    for(var j=i+1;j<indexs.length;j++){
      if(indexs[i]==indexs[j]){
        indexs[j]=indexs[indexs.length-1];
        indexs.length--;
        j--;
      }
    }
  }
  return indexs;
}
function getObjAreaIndex(obj){//计算出炸弹外的元素能涉及的块id
  var o=obj.getRange()+range;
  var x=obj.x;
  var y=obj.y;
  return getBlockIndexByPoints([x-o,y-o,x-o,y+o,x+o,y-o,x+o,y+o]);
}
function getBlockIndexByPos(x,y){//得出某元素的块位置 （唯一）
  if(x>=mapLen){x=mapLen-1;}
  if(y>=mapLen){y=mapLen-1;}
  return Math.floor(x/blockLen)+(Math.floor(y/blockLen)*size);
}
function getBlockIndexByPoints(points){//得出某元素的块位置 （唯一）
  //var points=[x-os,y-ol,x+os,y-ol,x-os,y+ol,x+os,y+ol,x-ol,y-os,x-ol,y+os,x+ol,y-os,x+ol,y+ol];
  var indexs=[];
  for(var i=0;i<points.length;i+=2){
    if(points[i]<=0){points[i]=1;}
    if(points[i+1]<=0){points[i+1]=1;}
    indexs[indexs.length]=getBlockIndexByPos(points[i],points[i+1]);
  }
  if(points.length==16){
    indexs=dealArray(indexs);
  }
  return removeSameIndex(indexs);
}
function dealArray(a){
  var b=[];
  var n1=(a[2]-a[0])/size;
  var n2=(a[6]-a[4]);
  for(var i=0;i<=n1;i++){
    b[b.length]=a[0]+i*size;
    b[b.length]=a[1]+i*size;
  }
  for(var i=0;i<=n2;i++){
    b[b.length]=a[4]+i;
    b[b.length]=a[5]+i;
  }
  return b;
}
function getRp(){
  return getRandomNum(1,mapLen-1);
}
function getStatuTextStyle(){
  ctx.font = "bold 30px Arial"; 
}
function getNameTextStyle(){
  ctx.fillStyle="#000";
  ctx.font = "normal 15px Arial"; 
}
function setTextSize(size){
  ctx.font = "normal "+size+"px Arial"; 
}
function addFun(obj,fun){
  for(key in fun){
    obj[key]=fun[key];
  }
}
function addProtoFun(obj,fun){
  for(key in fun){
    obj.prototype[key]=fun[key];
  }
}

















