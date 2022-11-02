var car1, car2, car3;
var cone;
var dogImg, dog;
var food, water;
var road;
var track;
var truckImg;
var invisaground;
var nutrientGroup;
var health = 185;
var gameState = "play";
var bark, game_over, chomp, bg_music;
var g = false;

function preload() {
  car1 = loadImage("car1.png");
  car2 = loadImage("car2.png");
  car3 = loadImage("car3.png");
  cone = loadImage("cone.png");
  dogImg = loadAnimation("dog1.png","dog2.png","dog3.png");
  road = loadImage("road.jpeg");
  food = loadImage("food_bowl.png");
  water = loadImage("water_bowl.png");
  truckImg = loadImage("animal_control.png");
  bark = loadSound("bark.wav");
  game_over = loadSound("over.wav");
  chomp = loadSound("chomp.wav");
  bg_music = loadSound("bg.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  track = createSprite(width/2,height/2-500);
  track.addImage(road);
  track.scale = 4.8;

  dog = createSprite(width/2-400,height-350);
  dog.addAnimation("woof",dogImg)

  invisaground = createSprite(width/2-400,height-300,width,5);
  invisaground.visible = false;

  truck = createSprite(240,height-400);
  truck.addImage("evil",truckImg)
  truck.scale = 1.5

  nutrientGroup = createGroup();

  dog.debug = false;
  dog.setCollider("circle",0,0,50);
}

function draw() {
  background("pink");

  drawSprites();

  if (gameState == "play") {

    showHealthBar();

    if (!bg_music.isPlaying()) {
      bg_music.play();
      bg_music.setVolume(0.5);
    }

    if (frameCount % 200 == 0) {
      bark.play();
    }

    track.velocityX = -7;

    if (track.x < 0) {
      track.x = width/2
    }

    if (keyDown("space") && dog.y > height-420) {
      dog.velocityY = -10;
    }
  
    dog.velocityY += 0.5;

    nutrients();

    for (var i = 0; i < nutrientGroup.length; i++) {
      var one_nutrient = nutrientGroup.get(i);
      if (dog.isTouching(one_nutrient)) {
        one_nutrient.destroy();
  
        chomp.play();

        if (health <= 135) {
          health += 50;
        }
        if (health> 135) {
          health = 185;
        }
      }
      
    }

    if (health <= 0) {
      gameState = "end";
    }
  }
  else if (gameState == "end") {
    gameOver();
    dog.velocityY = 0;
    track.velocityX = 0;
    nutrientGroup.setVelocityXEach(0);

    noStroke();
    fill("white");
    rect(75,90,185,20);
  
    image(food,15,70,60,60);

    dog.remove();
    if (!g) {
      game_over.play();
      g = true;
    }
    
  }

  

  dog.collide(invisaground);


}


function nutrients() {
  if (frameCount % 60 === 0) {
    var nutrient;
  nutrient = createSprite(width,random(height-500,height-400));
  nutrient.velocityX = -7;
  var rand = Math.round(random(1,2));
  if (rand == 1) {
    nutrient.addImage(food);
    nutrient.scale = 0.18;
  }
  else {
    nutrient.addImage(water);
    nutrient.scale = 0.4;
  }

  nutrient.lifetime = width;
  nutrientGroup.add(nutrient);

  nutrient.debug = false;
  nutrient.setCollider("rectangle",0,0,150,100);
  truck.depth = nutrient.depth + 1;
  }
  
}

function showHealthBar() {

  noStroke();
  fill("white");
  rect(75,90,185,20);

  if (gameState == "play") {
    fill("green");
    rect(75,90,health,20);
  }
  else {
    fill("green");
    rect(75,90,0,20);
  }

  image(food,15,70,60,60);

  if (frameCount % 45 == 0 && gameState == "play") {
      health -= 185/9;
    }

  if (health < 5) {
    gameState = "end";
  }

  console.log(gameState,health);
}

function gameOver() {
  swal(
    {
      title: `You got captured!`,
      text: "Better luck next time!",
      imageUrl:
        "gameOver.png",
      imageSize: "150x150",
      confirmButtonText: "Play Again"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}