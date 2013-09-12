(function() { 
  var body = document.getElementsByTagName('body')[0],
  init, stage, tick, numberOfDrops = 5, sun, sunUp = false, children = 0,
  bgColor, rainColor, rainbow, rainbow1, rainbow2, rainbow3, rainbow4;
  
  init = function() { 
    stage = new createjs.Stage('woodland');  
    setBackgroundColor();
    drawSun();
    drawRainbow();
    setBackground();
    createjs.Ticker.addEventListener("tick", tick);
  };
  
  
  
  initRain = function() { 
    //darken sky 
    createjs.Tween.get(rainColor, {loop: false})
        .to({alpha: .5}, 8000); 
    
    //fade out sun
     createjs.Tween.get(sun, {loop: false})
        .to({alpha: .15}, 10000);

    var interval;

     interval = setInterval(function() {
       var newNumber = numberOfDrops*1.05;
       if (newNumber > 500) {
         clearInterval(interval);
         setTimeout(function(){
           startClearing();
         },5000);
       }
       else {
         drawRainDrops(newNumber);  
       }
       
     },1000);
     
  };
  
  setBackgroundColor = function() { 
     bgColor = new createjs.Shape();
     bgColor.graphics.beginLinearGradientFill(["#fff","#c6eef8"], [0, 1], 0, 0, 850,630).drawRect(0,0,850,630);
     stage.addChild(bgColor);

  };
  
  setBackground = function() { 
    var bg = new createjs.Bitmap('woodland-bg-8.png');
    stage.addChild(bg); 
  };
  
  startClearing = function() {
   var interval,
    fade = false;
   interval = setInterval(function() {
     children = stage.getNumChildren(); 
     if (children !== 9) {
       if (children <= 200 && fade == false) {
         fade = true;
         //undarken sky 
         createjs.Tween.get(rainColor, {loop: false})
             .to({alpha: 0}, 1500); 

         //fade in sun
          createjs.Tween.get(sun, {loop: false})
             .to({alpha: 1}, 1500);
       }
        
       for (var i = 9; i< 23; i++) {
         stage.removeChildAt(i);
       }
     }
     else {
       clearInterval(interval);
       createjs.Tween.get(rainbow, {loop: false})
           .to({y: -400}, 2000); 
       createjs.Tween.get(rainbow1, {loop: false})
           .to({y:-400 }, 2000);
           createjs.Tween.get(rainbow2, {loop: false})
                .to({y:-400 }, 2000);
                createjs.Tween.get(rainbow3, {loop: false})
                     .to({y:-400 }, 2000);
                     createjs.Tween.get(rainbow4, {loop: false})
                          .to({y:-400 }, 2000);
     }
     
   },200); 

  };
  
  drawRainbow = function() {
    rainbow = new createjs.Shape();
    rainbow.graphics.beginFill('#32004b').drawCircle(425,900, 270); 
   rainbow1 = new createjs.Shape();
    rainbow1.graphics.beginFill('#004a80').drawCircle(425,900, 250); 
    rainbow2 = new createjs.Shape();
    rainbow1.graphics.beginFill('#197b30').drawCircle(425,900, 230);
    rainbow3 = new createjs.Shape();
    rainbow1.graphics.beginFill('#ed1c24').drawCircle(425, 900, 210);
    rainbow4 = new createjs.Shape();
    rainbow1.graphics.beginFill('#ff9900').drawCircle(425, 900, 190);
    
    stage.addChild(rainbow, rainbow1, rainbow2, rainbow3, rainbow4);
    
  };
  
  drawSun = function() { 
    sun = new createjs.Shape();
    stage.addChild(sun);
    sun.graphics.beginFill('#fef57f').drawCircle(425, 900, 100);
    sun.alpha = 1;

    createjs.Tween.get(sun, {loop: false})
      .to({y: -600}, 3000).call(function() {
        shrinkSun();
      });
      
      rainColor = new createjs.Shape();
      rainColor.graphics.beginFill('#9fb5ba').drawRect(0,0,850,630);
      rainColor.alpha = 0;
      stage.addChild(rainColor);
    
  };
  
  shrinkSun = function() { 
    createjs.Tween.get(sun, {loop:false})
      .to({scaleX: .85, scaleY: .85}, 1000).call(function() {
        initRain()});
  };
  
  drawRainDrops = function(num) {
     for ( var i = 0; i<num; i++) {
      var drop = new createjs.Shape(),
        speed = Math.random() * 3000;         

      stage.addChild(drop);
      drop.graphics.beginStroke('#0072bc').beginFill('#999').drawEllipse(0,0, 8, 12);
      drop.setTransform(Math.random()+0,Math.random(),1,1,0,10,70); 
      
      drop.x = Math.round(Math.random() * 850);
      drop.y = Math.round(Math.random() * 100)-250;
      createjs.Tween.get(drop, {loop: true})
        .to({y: 900}, speed);
    }

    numberOfDrops = numberOfDrops + num; 
  };
  

  
  tick = function() { 
    //shrinkSun(); 
    stage.update();
  };
  
  body.onload = function() {
    init();
  };
 }());