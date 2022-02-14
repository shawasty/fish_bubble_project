//canvas setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
// set canvas width and height based on the style sheet css
canvas.width = 1100;
canvas.height = 650;

// set score variable for the score
//game frame variable too to cause animation

let score = 0;
let gameFrame = 0;
ctx.font = "40px Geneva";

//Mouse Interactivity
// set cordinates for moving mouse vertically and horizontally around the screen (x and Y coordinates), make an object
//after creating the event listener ,use getBoud to set the borders to 0
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  // click will be set to false initially , this is used to see if mouse button has been pressed or released.
  click: false,
};
// create functions to use the mouse object above, which ius the type of event to listen for and the the type of action if it is invoked.
canvas.addEventListener("mousedown", function (event) {
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
  // console.log(mouse.x,mouse.y)
});
canvas.addEventListener("mouseup", function () {
  mouse.click = false;
});
// player
//contructor will contain blueprint of all player object
const playerLeft = new Image();
playerLeft.src ='images/fish_swim_left.png';
const playerRight = new Image();
playerRight.src ='images/fish_swim_right.png';   // download sprite sheet and turn it upside down
class Player {
  constructor() {
    // set innitial coordinates for player before mouse starts moving
    this.x = canvas.width;
    this.y = canvas.height  /2;
    //set radius to 50 because of how to position canvas and angle to 0
    this.radius = 40;
    this.angle = 0;
    // because we will use spread sheet, we need the following, frames must be innitially set to 0 and then later chasnged
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    //the following needs to be calculated using the size of sprite sheet used to draw to calculate the size of a single item.
    //spriteWidth => (width of spritesheet)/(number of columns)
    //spriteHeight=> (height)/(rows)
    this.spriteWidth = 498;
    this.spriteHeight = 327;
  }
  //create a method that moves the player towards the mouse
  update() {
    //create in such a way that the mouse and player distance coincide
    const distanceX = this.x - mouse.x;
    const distanceY = this.y - mouse.y;
    let theta = Math.atan2(distanceY,distanceX)
    this.angle = theta;
    //create an if statement and equate to distanceX &Y / 30 toprevent animation from being too fast
    if (mouse.x != this.x) {
      this.x -= distanceX / 15;
    }
    if (mouse.y != this.y) {
      this.y -= distanceY / 15;
    }
  }
  //we will need a draw method, but go back add click = true on mousedown event to true ; and also add another event listener for mouseup event.
  draw() {
    if (mouse.click) {
      //draw a line from mouse to player anytime the mouse moves
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      //.stroke will connect the two points beginPath and lineTo
      ctx.stroke();
    }
    //draw a circle to represent player character, check for method online
    ctx.fillStyle = "#ad3a13";
    ctx.beginPath();
    //
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // call ctx.fill() to draw the circle
    ctx.fill();
    ctx.closePath();
    ctx.fillRect(this.x,this.y,this.radius,10);
// to rotate the fish?
    ctx.save(); //to safe canvas current position
    ctx.translate(this.x, this.y); // to move the the circle current position towrds , go to drawImage to chage this.y and this.x to 
    ctx.rotate(this.angle);
    if(this.x >= mouse.x){
        // ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth,this.spriteHeight, this.x-60, this.y-40, this.spriteWidth/4 , this.spriteHeight/4);  // check property on line
        ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth,this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth/4 , this.spriteHeight/4); 

    }else{
        // ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth,this.spriteHeight, this.x-60, this.y-40, this.spriteWidth/4 , this.spriteHeight/4);  // check property on line
        ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth,this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth/4 , this.spriteHeight/4)
    }

    ctx.restore();
  }
}
//create the player by using the new keyword.

//check to see if code works before continuing
// create function animate to test before tackling bubbles
const player = new Player();

//Bubbles
const bubbleArray = [];
//create random bubbles
class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    //changing this.y =  Math.random() * canvas.height; to  the below because we want the bubbles to come from below the canvas
    this.y = canvas.height + 100;
    this.radius = 40;
    this.speed = Math.random() * 5 + 1;
    //to keep track between each individual bubble and player
    this.distance;
    this.counted = false;
    //adding sound to game.use the itenary operator and set conditions
    this.sound = Math.random() <= 0.5 ? "soundA" : "sound2";
  }
  // create collision detection methods between two circles (bubble and player )
  update() {
    //use the following to move the bubbles up in the direction of the y axis
    this.y -= this.speed;
    //This makes the bubbles move at custom speed differently (NB: read about circle collision js and use the fomula as shown below)
    const distanceX = this.x - player.x;
    const distanceY = this.y - player.y;
    //this is used to detect circle collision
    this.distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  }
  draw() {
    ctx.fillStyle = "#3297a8";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
  }
}
const bubSound2 = document.createElement("audio");
bubSound2.src = "sounds/bubble2.wav";

const bubSound1 = document.createElement("audio");
bubSound1.src = "sounds/bubbl1.wav";

function bubHandler() {
  //the following adds a bubble at each 50th count to the array bubbleArray
  if (gameFrame % 50 == 0) {
    bubbleArray.push(new Bubble());
    // console.log(bubbleArray.length)
    //checks the console to see the increment of length each time
  }
  for (let i = 0; i < bubbleArray.length; i++) {
    bubbleArray[i].update();
    bubbleArray[i].draw();
  }
  for (let i = 0; i < bubbleArray.length; i++) {
    // added - this.radius * 2 to the initial to avoid the bubbles from disappearing early.
    if (bubbleArray[i].y < 0 - bubbleArray[i].radius * 2) {
      bubbleArray.splice(i, 1);
    } // below is a mathematical formular for detecting colllision of two circles
    if (bubbleArray[i].distance < bubbleArray[i].radius + player.radius) {
      // console.log('collision');// increase score by one each time there is coollision.  go back to class buble and add this.counted and set to true. After thatthe condition will be as follows
      if (!bubbleArray[i].counted) {
        if (bubbleArray[i].sound == "soundA") {
          bubSound1.play();
        } else {
          bubSound2.play();
        }
        score++;
        bubbleArray[i].counted = true;
        //call the splice method to remove what ever colides with the circle while its counted.
        bubbleArray.splice(i, 1);
      }
    }
  }
}
//Animation Loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bubHandler();
  player.update();
  player.draw();
  ctx.fillStyle = "black";
  ctx.fillText(`score: ${score}`, 10, 40);
  //the original gameFrame was set to 0, set to increase gradually and use it to add periodic event to the game
  gameFrame++;
  // console.log(gameFrame)
  //checks the frames generated endlessly , use that idea to create a hadnle for the bubbles.
  requestAnimationFrame(animate);
}
animate();
