var names=["珍爱生命远离网络","缺氧的鱼","姐的大姨妈都比你红","别逼我耍流氓╮","蹲在坟前听鬼讲故事","妈妈说名字长才有帅哥聊天","专治各种不服","尒蕏萉萉","盯着作业唱征服",
"首席男妓","你这磨人的小妖精","男神沒有经","性感的毛毛虫","阿姨，借你儿子还你孙子","我娘她女儿真萌","简单有趣的网名","拿老公换糖吃￢ε￢","待我长发及腰已成千年老妖",
"嘟嘟小嘴耍任性","中央勤爆菊特工","夜袭女儿国","吃了范冰冰就会杜拉拉","www.keaidian.com","现实强奸了过去留下个回忆","谁动朕江山，朕掘他老坟","帅dē掉渣","别看了你帅不过我的",
"花样作死冠军","щǒ就是这麽拽","念来过倒会比逗","(*ˉ︶ˉ*)","简单有趣的网名","帅得一塌糊涂","ε未簖奶","麻麻说名字起的长能吓屎人","萌萌兔﹥ε﹤","笑出腹肌","大白(●—●)","叼着香烟吻妳",
"加载失败……","爺、獨霸怡葒院","半夜睡不着看什么都像鬼","帅哥，麻烦借下肩膀","國妓總姦、","讨厌那些网名取得很长的人","三岁就很酷","胸小随我爸","此用户已成仙","丑到无可挑剔",
"小怪兽ゞ","城里套路深，我要回农村","花式撩妹王","网名长了能撩妹","我是可乐我会冒泡","踩着棺材跳鬼步","抢了我辣条还想跑","微信有趣网名大全","大王叫我来巡山","酷到被通缉",
"罗密欧与猪过夜","搞笑有趣的网名，微信有趣网名大全","尐饭团^ǒ^","巴扎嘿","此号已废","囿點尛錍氣〆","对不起，网名太长无法显示","一身祖宗味儿","夜闯女儿国","小猪丁丁",
"不帅你报警","把花心的男人捐给灾区","谈情不如逗狗","非洲小白脸","网名是个什么东西","都是白开水装什么优乐美","怪咖逗比","此男子、急需被征服","正在缓冲……99%",
"本人智商已欠费","小姐，你好胸哦","容嬷嬷快拿针扎她","风吹裤裆毛飞扬","一懒众衫小","步子迈大了难免扯着蛋","身娇体弱易推倒的小萝莉","不吃貓de魚","舂夢茽冇妳","爱污及污",
"吃饭睡觉打豆豆","不会游泳的鱼","打小就酷","一念苍井便成空","(o゜▽゜o)","辣条味的小仙女","唐僧也就是個耍猴的","坐在坟头戏弄鬼","说你是猪人家猪都不乐意","吃饭睡觉拉粑粑",
"走，结婚去，我请客","感觉男神的身上有wifi","奈何桥被强拆了","嘴贱欠吻","月老，下次麻烦给我打死结","小姐，你比猪还瘦","時間煮雨莪煮魚i","啦啦啦，我是卖萌的小行家",
"心中的小鹿已撞死ぃ","柔情似水似你妹@","秃驴，给爷笑①個","猪肉涨价了，你也值钱了","搞笑逗比的QQ网名","给儿子聘个妈","凹凸曼暗恋小怪兽","[人丑就要多读书]","我要回幼儿园当学霸",
"｀怪咖","神经领袖i","逗比代表","其实我不笨只不过懒得聪明","抱着鱼睡觉的猫♂","老衲丶只沾花不惹草","太阳是我搓圆滴","来一瓶82年的敌敌畏","24K.纯帅√","八百逗逼奔北坡",
"你不爱我，这是病，得治","妈！我被猪亲了一口","删了你之后网速明显快了","总有太监想骚扰本宫","√","啊！我被作业包围了","一个连老天爷都嫉妒的男人","专业挖墙角","老师，我晕课",
"对着太阳喊声日","姑娘，你有大胸之兆","考试什么一点都不酷","国民男神经丷","岁月是把猪饲料","磨磨叽叽o○","待姐长发及腰定要勒死你","幼稚鬼﹥ε﹤"];
var nameNum=names.length;
var canvas,ctx,mapCanvas,mctx;
var map,player;//objs
var isPause=false;
var isOver=false;
var playerImg,aiImg,bombImg,fireImgw,fireImgh,wallImg,skillImg;//img
var time=0;
var score=0;
var socket;
var enemyNum=RIVAL.aiNum;
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
  $("#enemy").text(enemyNum);
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
function gameLoose(){
	isOver=true;
	$("#showInfo").slideDown();
}
function gameSuccess(){
	isOver=true;
  alert("胜利");
}
function killRival(){
  enemyNum--;
  $("#enemy").text(enemyNum);
  if(enemyNum==0){
    gameSucess();
  }
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
  setInterval(function(){
    if(!isPause&&!isOver){
		this.time+=0.1;
		$("#time").text(time.toFixed(1));
    }
  },100);
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
	if(!isOver){
    if(!isPause){
      isPause=true;
      $("#pauseBtn").removeClass("glyphicon-play").addClass("glyphicon-pause");
    }else{
      isPause=false;
      $("#pauseBtn").removeClass("glyphicon-pause").addClass("glyphicon-play");
    }
	}
}
function restart(){
  location.reload();
	/*isOver=false;
	player.restart();
	$("#showInfo").slideUp();
	time=0;*/
}
document.onkeydown=function(event){
	var e = event || window.event || arguments.callee.caller.arguments[0];
	if(e && e.keyCode==32){ // 空格
    pause();
  }            
  if(e && e.keyCode==13){ // enter 键
   restart();
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











