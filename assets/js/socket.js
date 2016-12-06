
function Socket(){
  this.url="ws://192.168.1.105:8080/BombBattle/game";
  this.socket=null;
  this.initSocket();
};Socket.prototype.send=function(json){
  if(!RIVAL.isAi){
    socket.send(JSON.stringify({"aa":1}));
  }
};Socket.prototype.sendPlayerPos=function(){
  socket.send(player.getPosJsonStr());
};Socket.prototype.close=function(){
  socket.close();
};Socket.prototype.initSocket=function(){
  //判断当前浏览器是否支持WebSocket
  if('WebSocket' in window){
    socket = new WebSocket(this.url);
  }else{
    alert('Not support websocket')
  }
  socket.onerror = function(){
    alert("error");
  };
  socket.onopen = function(event){
    alert("open");
  }
  socket.onmessage = function(event){
    handleData(event.data);
  }
  socket.onclose = function(){
    alert("close");
  }
  //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
  window.onbeforeunload = function(){
      socket.close();
  }
};