var myGame = new Kiwi.Game("testGameContainer","testGame",myState,{plugins:["LEAPController"]});
var myState = new Kiwi.State('myState');
var loadingState = new Kiwi.State('loadingState');
var preloader = new Kiwi.State('preloader');

myState.preload = function(){
	Kiwi.State.prototype.preload.call(this);

}

myState.create = function(){

	this.control = Kiwi.Plugins.LEAPController.createController();

	this.ground = new Platform(this, 0, 505);

	this.bombGroup = new Kiwi.Group(this);

	//////////////////////////////
	//Parallax Environment Groups
	this.grassGroup = new Kiwi.Group(this);
	this.bg1 = new Kiwi.Group(this);
	this.bg2 = new Kiwi.Group(this);
	this.bg3 = new Kiwi.Group(this);
	this.bg4 = new Kiwi.Group(this);
	this.bg5 = new Kiwi.Group(this);
	this.bg6 = new Kiwi.Group(this);
	this.bg7 = new Kiwi.Group(this);


    this.bonusCollectedInfo = new Kiwi.Group(this);

	this.bombDropped = false;

	this.missileGroup = new Kiwi.Group(this);
	this.airplaneMissileGroup = new Kiwi.Group(this);
	this.explodeGroup = new Kiwi.Group(this);

    this.bonuses = new Kiwi.Group(this);

    this.healthBar = new Kiwi.Group(this);


	///////////////////
	//Plane and Bomb Door
	this.plane = new Airplane(this,this.textures['plane'], 250, 20);



	/////////////////////////
	//Timers for enemy spawns
	this.timer = this.game.time.clock.createTimer('spawnTroop', .3, -1, true);


    //timers for bonuses
    //this.timer2 = this.game.time.clock.createTimer("spawnBonus",3, -1, true);
    this.timerEvent2 = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.spawnBonus, this);
    this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.spawnMissile, this);


	//this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.spawnAirplaneMissile, this);


	this.pauseImage = new Kiwi.GameObjects.StaticImage(this, this.textures['pauseImage'], 0, 0);


  	////////////////////////
  	//Creating parallax bacground assets
    for(var i = 0; i < 20; i++){//grass
    	this.grassGroup.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['grass'], i * 48, 504, true));
    	this.grassGroup.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['dirt'], i * 48, 552, true));

    }
    for(var i = 0; i < 4; i++){
    	this.bg7.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['bg7'], i*434, 0, true));//bg7
    }
    for(var i = 0; i < 5; i++){
    	this.bg6.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['bg6'], i*346, 185, true));//bg6
    }
    for(var i = 0; i < 10; i++){
    	this.bg5.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['bg5'], i*96, 253, true));//bg5
    	this.bg4.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['bg4'], i*96, 279, true));//bg4
    }
    for(var i = 0; i < 3; i++){
    	this.bg3.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['bg3'], i*460, 305, true));//bg3
    	this.bg2.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['bg2'], i*460, 335, true));//bg2
    	this.bg1.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['bg1'], i*460, 381, true));//bg1
    }
    //Background
    this.addChild(this.ground);
    this.addChild(this.bg7);
    this.addChild(this.bg6);
    this.addChild(this.bg5);
    this.addChild(this.bg4);
    this.addChild(this.bg3);
    this.addChild(this.bg2);
    this.addChild(this.bg1);

    //
    this.addChild(this.bonuses);
    this.addChild(this.missileGroup);
    this.addChild(this.airplaneMissileGroup);
    this.addChild(this.plane);
    this.addChild(this.explodeGroup);

    this.addChild(this.bonusCollectedInfo);

    this.addChild(this.healthBar);
    //Foreground
    this.addChild(this.grassGroup);
    this.addChild(this.pauseImage);


}

var currentX = [];
var firemove = false;
var firemoveEnd = false;
var armagedonStarted = false;
var textSet = false;
var text1;

myState.update = function(){
	Kiwi.State.prototype.update.call(this);
//	console.log(this.control.hands[0].pointables[0].touchZone);
	//console.log(this.control.hands[0].pointables[0].touchDistance);
	//console.log(this.control.hands[1])
	//console.log(this.control.hands[0].pointables[0]);
//	console.log(this.control.hands[0])
	//console.log(this.control);

   /* console.log("roll : " + this.control.hands[0].roll);
    console.log("pitch " + this.control.hands[0].pitch);
    console.log(" yaw " + this.control.hands[0].yaw);*/

	var currentX = this.control.hands[0].pointables[1]["tipX"];

	if ( currentX > 0 && !firemove){
	//	console.log("first");
		firemove = true;
	}

	else if( currentX < 0 && firemove){
		//console.log("second");
		firemoveEnd = true;
	}
	else if ( currentX > 0 && firemoveEnd && firemove){
		//console.log("third");
		this.spawnAirplaneMissile();
		firemove = false;
		firemoveEnd = false;
	}

    /*this.control.hands[0].pointables.forEach( function(value, index) {
    	console.log("finger number :  " +
    	index + " value X: " + value["tipX"]);
    });*/


	if(this.control.controllerConnected){
		//console.log("ControllerConnected");
		this.pauseImage.alpha = 0;

		this.control.update();
		//console.log("plane.z "  + this.control.hands[0].posZ);

		this.plane.x = (this.control.hands[0].posX* 1.7) + 400;
		this.plane.y =((-1 * this.control.hands[0].posY)*1.7) + 600;


	 this.plane.scaleX = this.control.hands[0].posZ /250;
	 this.plane.scaleY = this.control.hands[0].posZ / 250;

	 if( this.control.hands[0].posZ < 60 ){
		//	console.log("smaller that " + 60);
			//this.plane.z = (60 * 1.7 ) + 400;
			this.plane.scaleX = 0.25;
			this.plane.scaleY = 0.25;
		}
	 //console.log("scaleX : " + this.plane.scaleX );

	// this.plane.rotation = -1 * (this.control.hands[0].palmNormalX);

	if(this.game.input.isDown){
		//console.log(this.control.currentHand);
		this.game.input.reset();
	}


    var bombSprite = new Kiwi.GameObjects.Sprite(this, this.textures['armageddon'], 20, 20  , true);

    if( bonusCollected ){
        this.bonusCollectedInfo.addChild(bombSprite);
    }

    if( bonusCollected ){
        var roll = this.control.hands[0].roll;
        //console.log("roll " + roll);
        if( roll > 1.3 ){
            armagedonStarted = true;
        }

        if( armagedonStarted && roll < -2){

            var self = this;
            var missiles = this.missileGroup.members;

            missiles.forEach( function ( enemyMissile ) {
                    enemyMissile.health --;

                    self.explodeGroup.addChild(new Explosion(self, enemyMissile.x -30, enemyMissile.y-70));
                    enemyMissile.destroy();

                armagedonStarted = false;
                bonusCollected = false;

                self.missileGroup.members = [];
                self.bonusCollectedInfo.members = [];
            });
            self.plane.points += 10;
        }
    }

        console.dir(this.members);
        //this.members = [];

        if( !textSet ){
            text1 = new Kiwi.GameObjects.Textfield(this, 'You have ' + this.plane.points + ' points ', 10, 10, '#000');
            this.addChild(text1);
            textSet = true;
        }else {
            text1.text = 'You have ' + this.plane.points + ' points ';
        }




    var planeHealth = this.plane.health;
    if ( planeHealth == 10 || planeHealth == 9){
        this.healthBar.members = [];
        this.healthBar.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['bar5'], 620, 20 , true));
    }else if ( planeHealth == 8 || planeHealth == 7) {
        this.healthBar.members = [];
        this.healthBar.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['bar4'], 620, 20 , true));

    }else if ( planeHealth == 5 || planeHealth == 6){
        this.healthBar.members = [];
        this.healthBar.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['bar3'], 620, 20 , true));
    }else if ( planeHealth == 4 || planeHealth == 3){
        this.healthBar.members = [];
        this.healthBar.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['bar2'], 620, 20 , true));

    }else if ( planeHealth == 1 || planeHealth == 2){
        this.healthBar.members = [];
        this.healthBar.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['bar1'], 620, 20 , true));
     }









	this.updateParallax();
	this.checkMissiles();
} else {
	this.pauseImage.alpha = 1;
}



};

function startFire(){
	console.log("FIRE");
}







var bonusCollected = false;

myState.checkMissiles = function(){
    var airplaneMissiles = this.airplaneMissileGroup.members;
	var bombs = this.bonuses.members;
	var missiles = this.missileGroup.members;
    var self = this;

    bombs.forEach( function ( bomb ){
        //console.log("bomb : " + bomb);
        if( self.plane.physics.overlaps(bomb)){
           // console.log("plane overlaps bomb");
           bomb.health --;
           bomb.destroy();
           bonusCollected = true;

        }
    });


    airplaneMissiles.forEach( function ( airplaneMissile ) {
        missiles.forEach( function ( enemyMissile ) {
            if(airplaneMissile.physics.overlaps(enemyMissile)){
                airplaneMissile.health --;
                enemyMissile.health --;

                self.explodeGroup.addChild(new Explosion(self, enemyMissile.x -30, enemyMissile.y-70));
                enemyMissile.destroy();
                airplaneMissile.destroy();
                self.plane.points ++;
            }
            console.log("points : " + self.plane.points);

        });

    });

    	for (var j = 0; j < missiles.length; j++){ //collides with enemy
			if(this.plane.physics.overlaps(missiles[j]) && isOverlapping(this.plane)){
				missiles[j].health --;
                this.plane.health --;
				this.explodeGroup.addChild(new Explosion(this, missiles[j].x -30, missiles[j].y-70));
                missiles[j].destroy();

                if ( this.plane.health < 1 ) {
                    this.explodeGroup.addChild(new Explosion(this, this.plane[j].x -30, this.plane[j].y-70));
                    missiles.members = [];
                    //this.plane.destroy();
                }
				break;
			}
			if(missiles[j].x < -200){
				missiles[j].destroy();
				break;
			}
		}
}


myState.spawnAirplaneMissile = function  (){
	if(this.control.controllerConnected){
	//	console.log("spawnAirplaneMissile")
		var s = new AirplaneMissile(this, this.plane.x + 10, this.plane.y + 20);//todo airplane
		this.airplaneMissileGroup.addChild(s);
	}
}

function isOverlapping(plane) {
	//console.log(plane.scaleX);
	if(plane.scaleX > 0.85 || plane.scaleX < 0.30){
		return false;
	}
	//console.log(obstacle.scaleX);
	return true;
}

myState.spawnMissile = function(){
	    if(this.control.controllerConnected){
            if(this.missileGroup.members.length < 10 ){
	            var s = new EnemyMissile(this, this.game.stage.width + 50, Math.random() * 450);
	            this.missileGroup.addChild(s);
            }

        }

};



myState.spawnBonus = function(){
    var randomBombX = [this.game.stage.width / 2, this.game.stage.width * 0.3, this.game.stage.width * 0.8]
    if(this.control.controllerConnected){
        var randomIndex = parseInt(Math.random() *100 % 3) ;
        var s = new Bonus(this, randomBombX[randomIndex], 0);
        if(this.bonuses.members.length == 0  ) {
           this.bonuses.addChild(s)
         }
    }
};








myState.updateParallax = function(){
	//Ground
	for(var i =0; i < this.grassGroup.members.length;i++){
		this.grassGroup.members[i].transform.x -= 6;
		if(this.grassGroup.members[i].transform.worldX <= -48){
			this.grassGroup.members[i].transform.x = 48*19;
		}
	}
	//bg1
	for(var i =0; i < this.bg1.members.length;i++){
		this.bg1.members[i].transform.x -= 6;
		if(this.bg1.members[i].transform.worldX <= -460){
			this.bg1.members[i].transform.x = 460* (this.bg1.members.length - 1) ;
		}
	}
	//bg2
	for(var i =0; i < this.bg2.members.length;i++){
		this.bg2.members[i].transform.x -= 4;
		if(this.bg2.members[i].transform.worldX <= -460){
			this.bg2.members[i].transform.x = 460*(this.bg2.members.length - 1);
		}
	}
	//bg3
	for(var i =0; i < this.bg3.members.length;i++){
		this.bg3.members[i].transform.x -= 3;
		if(this.bg3.members[i].transform.worldX <= -460){
			this.bg3.members[i].transform.x = 460*(this.bg3.members.length - 1);
		}
	}
	//bg4
	for(var i =0; i < this.bg4.members.length;i++){
		this.bg4.members[i].transform.x -= 1;
		if(this.bg4.members[i].transform.worldX <= -96){
			this.bg4.members[i].transform.x = 96*(this.bg4.members.length - 1);
		}
	}
	//bg5
	for(var i =0; i < this.bg4.members.length;i++){
		this.bg5.members[i].transform.x -= 0.5;
		if(this.bg5.members[i].transform.worldX <= -96){
			this.bg5.members[i].transform.x = 96*(this.bg5.members.length - 1);
		}
	}

	//bg7
	for(var i =0; i < this.bg7.members.length;i++){
		this.bg7.members[i].transform.x -= .25;
		if(this.bg7.members[i].transform.worldX <= -434){
			this.bg7.members[i].transform.x = 434*(this.bg7.members.length - 1);
		}
	}





}




////////////////////////////////////////
//CLASSES


var Airplane = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['plane'], x, y, true);

	//this.box.hitbox = new Kiwi.Geom.Rectangle(30, 80, 130, 40);
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));

	this.animation.add('walk', [0,1], 0.1, true);
	this.animation.play('walk');
    this.health = 10;
    this.points = 0;



	Airplane.prototype.update = function(){
		Kiwi.GameObjects.Sprite.prototype.update.call(this);
		//Update ArcadePhysics
		this.physics.update();
	}
};
Kiwi.extend(Airplane,Kiwi.GameObjects.Sprite);




var Bonus =  function (state, x, y){
    Kiwi.GameObjects.Sprite.call(this, state, state.textures['bomb'], x, y);

    this.animation.add('walk', [0,1], 0.1, true);
    this.animation.play('walk');

    //this.box.hitbox = new Kiwi.Geom.Rectangle(50, 34, 50, 84);
    this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
    this.health = 1;
    this.scaleX = 1;

    Bonus.prototype.update = function(){

        Kiwi.GameObjects.Sprite.prototype.update.call(this);
        this.physics.update();


        this.y += 4;


        if(this.health <= 0){
            this.destroy();
        }

        if (this.y > 900){
            this.destroy();
        }
    }
}
Kiwi.extend(Bonus,Kiwi.GameObjects.Sprite);


var Platform = function (state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['ground'], x, y, true);
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
	this.physics.immovable = true;

	Platform.prototype.update = function(){
		Kiwi.GameObjects.Sprite.prototype.update.call(this);
		this.physics.update();
	}

}
Kiwi.extend(Platform,Kiwi.GameObjects.Sprite);

var EnemyMissile = function (state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['missile'], x, y);

	this.animation.add('walk', [0,1], 0.1, true);
	this.animation.play('walk');

	//this.box.hitbox = new Kiwi.Geom.Rectangle(50, 34, 50, 84);
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
	this.health = 1;
	this.scaleX = 1;

	EnemyMissile.prototype.update = function(){

		Kiwi.GameObjects.Sprite.prototype.update.call(this);
		this.physics.update();


		this.x -= 7;


		if(this.health <= 0){
			this.destroy();
		}

		if (this.x < -100){
			this.destroy();
		}
	}
}
Kiwi.extend(EnemyMissile,Kiwi.GameObjects.Sprite);




var AirplaneMissile = function (state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['airplaneMissile'], x, y);

	this.animation.add('walk', [0,1], 0.1, true);
	this.animation.play('walk');

	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
	this.health = 1;
	this.scaleX = 1;

	AirplaneMissile.prototype.update = function(){
		//console.log("update AirplaneMissile");
		Kiwi.GameObjects.Sprite.prototype.update.call(this);
		this.physics.update();


		this.x += 10;


		if(this.health <= 0){
			this.destroy();
		}

		if (this.x > 800){
			this.destroy();
		}
	}
}
Kiwi.extend(AirplaneMissile,Kiwi.GameObjects.Sprite);




var Explosion = function (state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['explosion'], x, y);
	this.animation.add('explode', [0, 1, 2, 3, 4], 0.1, false);
	this.animation.play('explode');

	Explosion.prototype.update = function(){
		Kiwi.GameObjects.Sprite.prototype.update.call(this);
		this.x -= 2;
		if(this.animation.currentCell == 4){
			this.destroy();
		}
	}
}
Kiwi.extend(Explosion,Kiwi.GameObjects.Sprite);



//////////////////////////////////////////////////////
//LOADING ASSETS
preloader.preload = function(){
    Kiwi.State.prototype.preload.call(this);
    this.addImage('loadingImage', 'assets/loadingImage.png', true);


}
preloader.create = function(){
    Kiwi.State.prototype.create.call(this);
    this.game.states.switchState('loadingState');

}

loadingState.preload = function(){
    Kiwi.State.prototype.preload.call(this);
    this.game.states.rebuildLibraries();
    this.game.stage.color = '#E0EDF1';

    this.logo = new Kiwi.GameObjects.StaticImage(this, this.textures['loadingImage'], 150, 50);

    this.addChild(this.logo);

    this.logo.alpha = 0;
    this.tweenIn = new Kiwi.Animations.Tween;
    this.tweenIn = this.game.tweens.create(this.logo);
    this.tweenIn.to({ alpha: 1 }, 1000, Kiwi.Animations.Tweens.Easing.Linear.None, false);
    this.tweenIn.start();


    ////////////////
    //ASSETS TO LOAD
///////////////////////////////////////
	//Environment Assets
	this.addImage('ground', 'assets/ground.png');
	this.addImage('grass', 'assets/ground-tiles/grass.png');
	this.addImage('dirt', 'assets/ground-tiles/dirt.png');
	this.addImage('bg1', 'assets/bg-layers/1.png');
	this.addImage('bg2', 'assets/bg-layers/2.png');
	this.addImage('bg3', 'assets/bg-layers/3.png');
	this.addImage('bg4', 'assets/bg-layers/4.png');
	this.addImage('bg5', 'assets/bg-layers/5.png');
	this.addImage('bg6', 'assets/bg-layers/6.png');
	this.addImage('bg7', 'assets/bg-layers/7.png');
    this.addImage('pauseImage', 'assets/pauseImage.png');

    this.addImage('bar1', 'assets/health_bars/1.png')
    this.addImage('bar2', 'assets/health_bars/2.png')
    this.addImage('bar3', 'assets/health_bars/3.png')
    this.addImage('bar4', 'assets/health_bars/4.png')
    this.addImage('bar5', 'assets/health_bars/5.png')

    ///////////////////////////////////
	//SpriteSheet and Objects
	this.addSpriteSheet('plane', 'assets/plane.png', 166, 83);
	this.addSpriteSheet('explosion', 'assets/explosion.png', 129, 133);
	this.addSpriteSheet('missile', 'assets/rocket.png', 62, 26);
    this.addSpriteSheet('airplaneMissile', 'assets/rocket_2.png', 47, 20);
    this.addSpriteSheet('bomb','assets/bomb.png', 50, 50);
    this.addSpriteSheet('armageddon','assets/armageddon.png', 50, 50);

}
loadingState.update = function(){
    Kiwi.State.prototype.update.call(this);
}


loadingState.create = function(){
    Kiwi.State.prototype.create.call(this);
    //console.log("inside create of loadingState");
    this.tweenOut = this.game.tweens.create(this.logo);
    this.tweenOut.to({alpha: 0}, 1000, Kiwi.Animations.Tweens.Easing.Linear.None, false);
    this.tweenOut.onComplete(this.switchToMain, this);
    this.tweenOut.start();
}
loadingState.switchToMain = function(){
    this.game.states.switchState('myState');
}

myGame.states.addState(loadingState);
myGame.states.addState(preloader);
myGame.states.addState(myState);
myGame.states.switchState('preloader');