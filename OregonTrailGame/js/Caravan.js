var OregonTrail = OregonTrail || {};
//This is called a namespace

//this contains the caravan object. 
//It has an initation method
OregonTrail.Caravan = {};
//the caravan object keeps the caravan propeties like weight, distance, and food

OregonTrail.Caravan.init = function(stats){
  this.day = stats.day;
  this.distance = stats.distance;
  this.crew = stats.crew;
  this.food = stats.food;
  this.oxen = stats.oxen;
  this.money = stats.money;
  this.firepower = stats.firepower;
};

//update weight and capacity
OregonTrail.Caravan.updateWeight = function(){
  var droppedFood = 0;
  var droppedGuns = 0;

  //how much can the caravan carry
  this.capacity = this.oxen * OregonTrail.WEIGHT_PER_OX + this.crew * OregonTrail.WEIGHT_PER_PERSON;

  //how much weight do we currently have
  this.weight = this.food * OregonTrail.FOOD_WEIGHT + this.firepower * OregonTrail.FIREPOWER_WEIGHT;

  //drop things behind if it's too much weight
  //assume guns get dropped before food
  while(this.firepower && this.capacity <= this.weight) {
    this.firepower--;
    this.weight -= OregonTrail.FIREPOWER_WEIGHT;
    droppedGuns++;
  }

  if(droppedGuns) {
    this.ui.notify('Left '+droppedGuns+' guns behind', 'negative');
  }

  while(this.food && this.capacity <= this.weight) {
    this.food--;
    this.weight -= OregonTrail.FOOD_WEIGHT;
    droppedFood++;
  }

  if(droppedFood) {
    this.ui.notify('Left '+droppedFood+' food provisions behind', 'negative');
  }
};

//update covered distance
OregonTrail.Caravan.updateDistance = function() {
  //the closer to capacity, the slower
  var diff = this.capacity - this.weight;
  var speed = OregonTrail.SLOW_SPEED + diff/this.capacity * OregonTrail.FULL_SPEED;
  this.distance += speed;
};

//food consumption
OregonTrail.Caravan.consumeFood = function() {
  this.food -= this.crew * OregonTrail.FOOD_PER_PERSON;

  if(this.food < 0) {
    this.food = 0;
  }
};
