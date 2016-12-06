
var canvas,ctx,mapCanvas,mctx;
var map,player;//objs
var isPause=false;
var isOver=false;
var playerImg,aiImg,bombImg,fireImgw,fireImgh,wallImg,skillImg;//img
var time=0;
var score=0;
var socket;
$(function(){
  if(isMobile()){
	  $(".change").addClass("phone");
	  $(".show-set-btn").click(showSet);
    resetLittleMap();
  }else{
    
  }
  init();
  exeGame();
});
function init(){
  initSource();
  initObjs();
  if(!RIVAL.isAi){
    socket=new Socket();
  }else{
    player.init({
      "id":"1",
      "x":getRp(),
      "y":getRp()
    });
  }
  initEvent();
  
}
function handleData(data){
  var d=$.parseJSON(data);
  if(d.state=="act"){
    //RIVAL.selectByIdAndPos(d.x,d.y,d.id).modAttr(d);
    RIVAL.selectById(d.id).modAttr(d);
   }else if(d.state=="add"){//加载新来的单个玩家
     addRival(d);
   }else if(d.state=="new"){
     player.init(d);
   }else if(d.state=="del"){
     RIVAL.removeById(d.id);
   }else{//加载已有的玩家
    $.each(d,function(i,one){
      addRival(one);
    });
   }
}
function addRival(data){
  RIVAL.add(data);
  //rivals[rivals.length]=new Rival(data);
}
 
function initSource(){
  initImg();
  canvas=document.getElementById("gameCanvas");
  canvas.width=winWidth;
  canvas.height=winHeight;
  mapCanvas=document.getElementById("mapCanvas");
  mapCanvas.width=lmapLen;
  mapCanvas.height=lmapLen;
  ctx=canvas.getContext("2d");
  ctx.textBaseline = 'middle';//设置文本的垂直对齐方式
  ctx.textAlign = 'center';
  mctx=mapCanvas.getContext("2d");
  //ctx.fillStyle="#FF0000";
}
function initImg(){
  playerImg=new Image();
  playerImg.src = 'assets/images/normal.png';
  aiImg=new Image();
  aiImg.src = 'assets/images/enemy.png';
  bombImg=new Image();
  bombImg.src = 'assets/images/bomb.png';
  fireImgw=new Image();
  fireImgw.src = 'assets/images/firew.png';
  fireImgh=new Image();
  fireImgh.src = 'assets/images/fireh.png';
  wallImg=new Image();
  wallImg.src = 'assets/images/wall2.png';
  var imgName=['addhp','adddamage','addpower','addspeed','addbombnum']
  skillImg=new Array();
  for(var i=0;i<imgName.length;i++){
    skillImg[i]=new Image();
    skillImg[i].src = 'assets/images/'+imgName[i]+".png";
  }
}
function initObjs(){
  player=new Bomber();
  map=new Map();
  WALL.init();
  RIVAL.init();
  BOMB.init();
  SKILL.init();
  if(RIVAL.isAi){
    geneRivals();
  }
  //player.isInvici=true;
  //player.range=30;
}
function geneRivals(){
  for(var i=0;i<RIVAL.aiNum;i++){
    addRival({
      "id":i,
      "x":getRp(),
      "y":getRp()
    });
  }
}
var startX=cx;
var startY=cy;

//http://www.cnblogs.com/iamlilinfeng/p/4239957.html
function initEvent(){
  if(isMobile()){
    new Hammer($("#controlCover")[0]).on("pan", setPhoneTarget);
    new Hammer(canvas).on("tap",placeBomb);
  }else{
    canvas.onmousemove=setTarget;
    $("#wrapper").mousemove(setTarget);
    canvas.onclick=placeBomb;
    $("#wrapper").click(placeBomb);
  }
  //canvas.onmouseup=speeddown;
  //$("#wrapper").mouseup(speeddown);
  $("#pauseBtn").click(pause);
  $("#restartBtn").click(restart);
  $(".set-item-btn").click(geneNewGame);
  window.onresize=resize;
}

var isFirst=true;
function setPhoneTarget(e){
  if(e.isFinal){
    isFirst=true;
    $("#controlWrapper").css({
      "left":(10)+"px",
      "top":(winHeight-10-cwLen)+"px"
    });
    $("#controlBtn").css({
      "left":cbRange+"px",
      "top":cbRange+"px"
    });
  }else{
    if(isFirst){
      $("#controlWrapper").css({
        "left":(e.pointers[0].clientX-cwRange)+"px",
        "top":(e.pointers[0].clientY-cwRange)+"px"
      })
      isFirst=false;
    }
  }
  if(e.distance<range/2){
    $("#controlBtn").css({
      "left":(cbRange)+"px",
      "top":(cbRange)+"px"
    })
  }else{
    var d = countDegByDxy(e.deltaX,e.deltaY);
    var x=cwRange*Math.cos(d)+cbRange;
    var y=cwRange*Math.sin(d)+cbRange;
    $("#controlBtn").css({
      "left":(x)+"px",
      "top":(y)+"px"
    })
  }
  player.setTargetDxy(e.deltaX,e.deltaY);
}
function placeBomb(){
  player.placeBomb();
}
function geneNewGame(){
	/*var data=getFormVal("set");
  pause();
  //geneAis(data.aiNum);
  //rivals[0].changeAiPara(data.aiRange,data.aiSpeed);
  pause();
  restart();*/
}
/*function speeddown(){
	player.speed=parseFloat($("[data-name='playerSpeed']").val());
}
function speedup(){
	player.speed=parseFloat($("[data-name='playerSpeed']").val())*2;
}*/
function setTarget(event){
  player.setTarget(event.clientX,event.clientY);
}
function resize(){
  winHeight = document.body.offsetHeight;
  winWidth = document.body.offsetWidth;
  cx=winWidth/2;
  cy=winHeight/2;
  map.resetMap(player.x,player.y);
  canvas.width=winWidth;
  canvas.height=winHeight;
}
  var i=1;
function exeGame(){
  setInterval(function(){
    act();
  },actt);
  setInterval(function(){
    draw();
  },drawt);
  //if(!RIVAL.isAi){
  //  setInterval(function(){
  //    socket.sendPlayerPos();
  //  },sendt);
  //}
  /*setInterval(function(){
    if(!isPause&&!isOver){
		this.time+=0.1;
		$("#time").text(time.toFixed(1));
    }
  },100);*/
}
function act(){
  if(!isPause&&!isOver){
    player.act();
    if(RIVAL.isAi){
      RIVAL.each(function(rival){
        rival.act();
      });
    }
    BOMB.each(function(bomb){
      if(bomb==undefined){
        var a=1;
        a++;
      }
      bomb.act();
    });
  }
}
function draw(){
  if(!isPause&&!isOver){
    map.drawMap();
    WALL.each(function(wall){
      wall.draw();
    });
    BOMB.each(function(bomb){
      bomb.draw();
    });
    SKILL.each(function(skill){
      skill.draw();
    });
    RIVAL.each(function(rival){
      rival.draw();
    });
    player.draw();
  }
}
function gameOver(){
  //isOver=true;
  
  /*for(i in ais){
    ais[i].drawAi();
  }*/
  $("#showInfo").slideDown();
}
function pause(){
	/*if(!isOver){
    if(!isPause){
      isPause=true;
      $("#pauseBtn").removeClass("glyphicon-play").addClass("glyphicon-pause");
    }else{
      isPause=false;
      $("#pauseBtn").removeClass("glyphicon-pause").addClass("glyphicon-play");
    }
	}*/
}
function restart(){
	/*isOver=false;
	player.restart();
	$("#showInfo").slideUp();
	time=0;*/
}
document.onkeydown=function(event){
	var e = event || window.event || arguments.callee.caller.arguments[0];
	if(e && e.keyCode==32){ // 空格
		 //pause();
	   }            
	 if(e && e.keyCode==13){ // enter 键
		 //restart();
	}
}; 

/*  获取表单的值  */
function getFormVal(formId){
  var dataObj = getElemsObj(formId,"data-name");
  return(dataObj);
}
function getElemsObj(formId,name){
  $inputs = $("#"+formId).find('['+name+']');
  var dataObj = {};  //json对象  键值对
  //data["name"]="shi";
  $.each($inputs,function(i,input){
    var property = $(input).attr(name);
    var value = $(input).val();
    dataObj[property] = value;
  });
  return dataObj;
}
function setFormVal(formId,data){
  setObjVal("#"+formId,data);
}
function setObjVal(obj,data){
  $inputs = $(obj).find('[data-name]');
  $.each($inputs,function(i,input){
    var dname=$(input).attr('data-name')
    if(isDate(dname)){
      data[dname]=modDate(data[dname]);
    }
    if($(input)[0].tagName=="INPUT"){
      $(input).val(data[dname]);
    }else{
      $(input).text(data[dname]);
    }
  });
}
function showSet(){
	$(".set.phone").slideToggle();
}











