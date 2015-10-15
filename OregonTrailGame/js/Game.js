var OregonTrail = OregonTrail || {};

//constants
OregonTrail.WEIGHT_PER_OX = 20;
OregonTrail.WEIGHT_PER_PERSON = 2;
OregonTrail.FOOD_WEIGHT = 0.6;
OregonTrail.FIREPOWER_WEIGHT = 5;
OregonTrail.GAME_SPEED = 800;
OregonTrail.DAY_PER_STEP = 0.2;
OregonTrail.FOOD_PER_PERSON = 0.02;
OregonTrail.FULL_SPEED = 5;
OregonTrail.SLOW_SPEED = 3;
OregonTrail.FINAL_DISTANCE = 1000;
OregonTrail.EVENT_PROBABILITY = 0.15;
//This is the probablility of a random event happening
OregonTrail.ENEMY_FIREPOWER_AVG = 5;
OregonTrail.ENEMY_GOLD_AVG = 50;
//This block sets all of the variables, these can be changed to make the game harder or easier

OregonTrail.Game = {};
//the game object will take care of the main game aspects like game starting, pausing, and the time steps

//initiate the game
OregonTrail.Game.init = function(){

  //reference ui
  //Links to ui.js
  this.ui = OregonTrail.UI;

  //reference event manager
  //Links to Event.js
  this.eventManager = OregonTrail.Event;

  //setup caravan
  //Initiates all of the variables for the players caravan
  this.caravan = OregonTrail.Caravan;
  this.caravan.init({
    day: 0,
    distance: 0,
    crew: 30,
    food: 80,
    oxen: 2,
    money: 300,
    firepower: 2
  });

  //pass references
  this.caravan.ui = this.ui;
  this.caravan.eventManager = this.eventManager;

  this.ui.game = this;
  this.ui.caravan = this.caravan;
  this.ui.eventManager = this.eventManager;

  this.eventManager.game = this;
  this.eventManager.caravan = this.caravan;
  this.eventManager.ui = this.ui;

  //begin adventure!
  this.startJourney();
};

//start the journey and time starts running
OregonTrail.Game.startJourney = function() {
  this.gameActive = true;
  this.previousTime = null;
  this.ui.notify('A great adventure begins', 'positive');

  this.step();
};

//game loop
OregonTrail.Game.step = function(timestamp) {

  //starting, setup the previous time for the first time
  if(!this.previousTime){
    this.previousTime = timestamp;
    this.updateGame();
  }

  //time difference
  var progress = timestamp - this.previousTime;

  //game update
  if(progress >= OregonTrail.GAME_SPEED) {
    this.previousTime = timestamp;
    this.updateGame();
  }

  //we use "bind" so that we can refer to the context "this" inside of the step method
  if(this.gameActive) window.requestAnimationFrame(this.step.bind(this));
};

//update game stats
OregonTrail.Game.updateGame = function() {
  //day update
  this.caravan.day += OregonTrail.DAY_PER_STEP;

  //food consumption
  this.caravan.consumeFood();

  if(this.caravan.food === 0) {
    this.ui.notify('Your caravan starved to death', 'negative');
    this.gameActive = false;
    return;
  }

  //update weight
  this.caravan.updateWeight();

  //update progress
  this.caravan.updateDistance();

  //show stats
  this.ui.refreshStats();

  //check if everyone died
  if(this.caravan.crew <= 0) {
    this.caravan.crew = 0;
    this.ui.notify('Everyone died', 'negative');
    this.gameActive = false;
    return;
  }

  //check win game
  if(this.caravan.distance >= OregonTrail.FINAL_DISTANCE) {
    this.ui.notify('You have made it to the west!', 'positive');
    this.gameActive = false;
    return;
  }

  //random events
  if(Math.random() <= OregonTrail.EVENT_PROBABILITY) {
    this.eventManager.generateEvent();
  }
};

//pause the journey
OregonTrail.Game.pauseJourney = function() {
  this.gameActive = false;
};

//resume the journey
OregonTrail.Game.resumeJourney = function() {
  this.gameActive = true;
  this.step();
};


//init game
OregonTrail.Game.init();