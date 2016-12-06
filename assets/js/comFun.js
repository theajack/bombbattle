var playerFun={
  "countInviciTime":function(isVis){
    if(this.alp<=8){
      ctx.globalAlpha =this.alp*0.1;
      this.alp+=0.1;
    }else if(this.alp>=8&&this.alp<=14){
      ctx.globalAlpha =(16-this.alp)*0.1;;
      this.alp+=0.1;
    }else{
      this.alp=2;
      ctx.globalAlpha =0.2
    }
    if(isVis){
      var pos=getDrawPos(this.x,this.y);
      ctx.drawImage(this.img,pos.x-this.range,pos.y-this.range,this.range*2,this.range*2);
    }
    ctx.globalAlpha =1;
    this.time+=10;
    if(this.time>4000){
      this.isInvici=false;
      this.time=0;
      this.alp=2;
    }
  },"placeBomb":function(){
    if(this.bombNum<this.bombMaxNum){
      BOMB.add(this);
      this.bombNum++;
    }
  },"getRange":function(){
    return this.range;
  },"resetArea":function(){
    this.area=getObjAreaIndex(this);//涉及区域
  },"behurt":function(damage){
    if(!this.isInvici){
      this.hp-=damage;
      this.isInvici=true;
      this.setStatu("-"+damage,MAP.textRed);
      if(this.hp<=0){
        return true;
      }
    }
    return false;
  },"setStatu":function(text,style){
    this.textStyle=style;
    this.statuText=text;
    this.showStatu=true;
  },"drawStatu":function(){
    var pos=getDrawPos(this.x,this.y-this.range-20);
    getStatuTextStyle();
    ctx.fillStyle = this.textStyle;
    ctx.fillText(this.statuText,pos.x, pos.y);
    this.showStatuTime+=drawt;
    if(this.showStatuTime>=BOMBER.statuTime){
      this.showStatuTime=0;
      this.showStatu=false;
    }
  }
}

var fun={
  "each":function(callback){
    if(this.size>0){
      for(var i=0;i<this.set.length;i++){
        for(var j=0;j<this.set[i].length;j++){
          if(this.set[i][j]==undefined){
            var a=1;
          }
          callback(this.set[i][j]);
        }
      }
    }
  },"eachByPos":function(index,callback){
    for(var i=0;i<this.set[index].length;i++){
      callback(this.set[index][i]);
    }
  },"eachByPosArray":function(indexs,callback){
    for(var i=0;i<indexs.length;i++){
      for(var j=0;j<this.set[indexs[i]].length;j++){
        callback(this.set[indexs[i]][j]);
      }
    }
  },
  "selectById":function(id){
    this.each(function(obj){
      if(obj.id==id){
        return obj;
      }
    });
  },"selectByIdAndPos":function(x,y,id){
    this.eachByPos(getBlockIndexByPos(x,y),function(obj){
      if(obj.id==id){
        return obj;
      }
    });
  },"removeById":function(id){
    for(var i=0;i<this.set.length;i++){
      for(var j=0;j<this.set[i].length;j++){
        if(this.set[i][j].id==id){
          this.set[i][j]=this.set[i][this.set[i].length-1];
          this.set[i].length--;
          this.size--;
          break;
        }
      }
    }
  },"removeByIdAndPos":function(index,id){
    for(var j=0;j<this.set[index].length;j++){
      if(this.set[index][j].id==id){
        this.set[index][j]=this.set[index][this.set[index].length-1];
        this.set[index].length--;
        this.size--;
        break;
      }
    }
  },"removeObj":function(obj){
    this.removeByIdAndPos(obj.posBi,obj.id);
  }
}