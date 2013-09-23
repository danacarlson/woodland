var woodlandScene = woodlandScene || {};

woodlandScene.scene = (function() {  
  var stage, tick, roostersound, birdsound,
  
  init = function () {
    sounds.init();
    createjs.MotionGuidePlugin.install();
    stage = new createjs.Stage('woodland');
    tick = createjs.Ticker.addEventListener("tick", tick);
    backgrounds.init();
    shapes.init();
    backgrounds.setBackgroundImage();   
    stage.enableMouseOver(50);
    setTimeout(function() {bird.init();}, 2000);
  },
  
  //store displayObjects as they are created here
  stageElements = {},
  
  tick = function () {
    stage.update();
  },
  
  sounds = {
    
    'init' : function() {
      createjs.Sound.addEventListener("fileload", this.handleLoad);
      createjs.Sound.registerSound("rooster.mp3", "rooster");
      createjs.Sound.registerSound("birds.mp3", "birds");
      createjs.Sound.registerSound("rain.mp3", "rain");
      createjs.Sound.registerSound("cheering.mp3", "cheer"); 
     },
     
    'handleLoad' : function() {
      sounds.roostersound = createjs.Sound.createInstance('rooster');     
      sounds.birdsound = createjs.Sound.createInstance('birds');
      sounds.roostersound.play(createjs.Sound.INTERRUPT_ANY, 2000);
      sounds.birdsound.play(createjs.Sound.INTERRUPT_ANY, 4200,-1);       
     }
     
     
  },

  backgrounds = { 
    'init' : function () {
      this.setStageBackgroundColor();
      this.setStageRainBackgroundColor();
     },
     
    'setStageBackgroundColor' : function () {
       stageElements.bgColor = new createjs.Shape();
       stageElements.bgColor.graphics.beginLinearGradientFill(["#fff","#c6eef8"], [0, 1], 0, 0, 850,630).drawRect(0,0,850,630);
       stage.addChild(stageElements.bgColor);
     },
     
     'setStageRainBackgroundColor' : function () { 
       stageElements.rainBgColor = new createjs.Shape();
       stageElements.rainBgColor.graphics.beginFill('#9fb5ba').drawRect(0,0,850,630);
       stageElements.rainBgColor.alpha = 0;
       stage.addChild(stageElements.rainBgColor);
     },
     
     'setBackgroundImage' : function() { 
       stage.BackgroundImage = new createjs.Bitmap('woodland-bg-8.png');
       stage.addChild(stage.BackgroundImage); 
     },
     
     'adjustSky' : function(alphaAmount, speed) {
       createjs.Tween.get(stageElements.rainBgColor, {loop: false})
           .to({alpha: alphaAmount}, speed);
     }
  },
  
  shapes = {
    'init' : function() {
      this.drawSun();
      this.drawRainbow();
      this.drawSign();
      this.animateSun();
    },
    
    'drawSun' : function() { 
      stageElements.sun = new createjs.Shape();
      stageElements.sun.graphics.beginFill('#fef57f').drawCircle(425, 900, 100);
      stageElements.sun.alpha = 1; 
      stage.addChild(stageElements.sun);
    },
    
    'adjustSun' : function(alphaAmount, speed) {
      createjs.Tween.get(stageElements.sun, {loop: false})
          .to({alpha: alphaAmount}, speed);
    },
    
    'drawRainbow' : function() {
      stageElements.rainbow = new createjs.Shape();
      stageElements.rainbow.graphics.beginFill('#004a80').drawCircle(425, 900, 270); 
      stageElements.rainbow.graphics.beginFill('#197b30').drawCircle(425, 900, 250); 
      stageElements.rainbow.graphics.beginFill('#fb3139').drawCircle(425, 900, 230);
      stageElements.rainbow.graphics.beginFill('#fb9c34').drawCircle(425, 900, 210);
      stageElements.rainbow.graphics.beginFill('#fef57f').drawCircle(425, 900, 190);
      stage.addChild(stageElements.rainbow);
    },
    
    'drawSign' : function() {
      stageElements.sign = new createjs.Bitmap('sign-sm.png');
      stageElements.sign.x = 525;
      stageElements.sign.y = 700;
      stage.addChild(stageElements.sign);
      this.addSignOnClick();
      this.addSignHover();
    },
    
    'addSignOnClick' : function() { 
      stageElements.sign.addEventListener('click', function() { 
        rain.init();
        createjs.Tween.get(stageElements.sign, {loop: false})
          .to({y: 700}, 2000);
      });
    },
    
    'addSignHover' : function() { 
      stageElements.sign.addEventListener('mouseover', function(e) { 
        e.target.cursor='pointer';
      });
    },
    
    'animateSun' : function() { 
       createjs.Tween.get(stageElements.sun, {loop:false})
          .to({y: -450}, 1500)
          .to({scaleX: .65, scaleY: .65, x: 80}, 2250).call(function() { 
            shapes.animateSign();
            });
    },
    
    'animateSign' : function() {
      createjs.Tween.get(stageElements.sign, {loop: false})
         .to({y: 350}, 2000);
    },
    
    'animateRainbow' : function() { 
      createjs.Tween.get(stageElements.rainbow, {loop: false})
          .to({y: -400}, 2000).call(function(){
            var cheer = new createjs.Sound.play('cheer', createjs.Sound.INTERRUPT_ANY, 0, 0); 
          });
    }
  },
  
  rain = {
    'numberOfDrops' : 5,
    'numOfChildrenBeforeRain' : null,
    
    'init' : function() {
       backgrounds.adjustSky(.5, 8000);
       shapes.adjustSun(.15, 10000);
       createjs.Sound.stop();
       this.rainSound = new createjs.Sound.play('rain', createjs.Sound.INTERRUPT_ANY, 0, 0, -1);
       this.beginRain();
     },
     
     'beginRain' : function() {
       var interval;
        //save the number of child elements before we start adding raindrops so we can return to that state
        this.numOfChildrenBeforeRain = stage.getNumChildren(); 
        
        interval = setInterval(function() {
          var newNumber = rain.numberOfDrops*1.05;
          //add about 500 drops, adjust number for heavier or lighter rain
          if (newNumber > 500) {
            clearInterval(interval);
            setTimeout(function(){
              rain.endRain();
            },5000);
          }
          else {
            rain.drawRainDrops(newNumber);  
          }

        },1000);
     },
     
     'endRain' : function() {
       var interval,
        fade = false,
        //higher number faster the rain clears, somewhat arbitrary
        numDropsRemovedEachCycle = rain.numOfChildrenBeforeRain + 14;
        
       interval = setInterval(function() {
         children = stage.getNumChildren();
         
         if (children !== rain.numOfChildrenBeforeRain) {
           //when we get down to less than 200 drops lighten sky and fade the sun back in
           if (children <= 200 && fade === false) {
             fade = true;
             backgrounds.adjustSky(0, 1500);
             shapes.adjustSun(1, 1500);
           }
           for (var i = rain.numOfChildrenBeforeRain; i< numDropsRemovedEachCycle; i++) {
             stage.removeChildAt(i);
           }
         }
         else {
           createjs.Sound.stop(); 
           clearInterval(interval);
           shapes.animateRainbow();
          }
        },200); 
     },
     
     'drawRainDrops' : function(num) {
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

       this.numberOfDrops = this.numberOfDrops + num; 
     }
  },
  
  bird = { 
    'init' : function() {
      
      var data =  {
        images: ['2birds.png'],
        frames: {width: 84, height: 60},
        animations: {fly:[0,1,null, 4]}
      };
    
      this.spriteSheet = new createjs.SpriteSheet(data);
      stageElements.animation = new createjs.BitmapAnimation(this.spriteSheet);
      stageElements.animation.gotoAndPlay('fly');
      createjs.Tween.get(stageElements.animation).to({guide:{ path:[-40,600, 0,300,300,450, 500,600,900,100] }},7000);
      stage.addChild(stageElements.animation);
    }

  }
  
  document.getElementsByTagName('body')[0].onload = function() {                    
    init();
  };

 }());