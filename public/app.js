

//opens and connects to the socket
let socket = io();

//value assigned with user's input
let msg_text;
window.addEventListener("load", function(){

    //listen for confirmation
    socket.on("connect", () => {
        console.log("Connected to the server via sockets")
    })

    //we get the input from the user
    let msg_input = this.document.getElementById("input-msg");

    //we listen to 'Send' button
    let submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', function () {
        msg_text = msg_input.value;
        //console.log(msg_text);
    });

})


//font
let graffiti;

//background image
let bg;

//other variables to change text
let font_size;
let message = "Write a message"
let color_mode = 0;

//Display P5 Canva
function setup(){

    //to load media
    graffiti = loadFont("fonts/docallismeonstreet.otf");
    bg = loadImage("images/wall.jpg")

    //to create canvas and put it in the background
    canvas = createCanvas(windowWidth,windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    
    
    background(255);
    textFont(graffiti);
    font_size = 40;
}


//to resixe window every time there's a change
function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}


//to get the coordinates and input of each text drawn by all the users
let drawingCoords={};
socket.on('dataFromServer', (data)=> {
    drawingCoords = data;
}) 


function draw(){   

    background(bg); 
  
    //if there's an input, if not just display default message
    if (msg_text){
        message = msg_text;
    }

    //NOTE: I NEED TO CHANGE THIS, SINCE IT MODIFIES ALL THE TEXTS AND NOT ONLY THE ONE THE USER IS CONTROLLING

    //The font size changes with the key arrows
    textSize(font_size);
    textAlign(CENTER);

    //to display a preview of the text
    text(message, mouseX, mouseY);

    //color mode changes with left and right key arrows
    if (color_mode == 1){
        fill(0);
    }
    else if (color_mode == 2){
        fill(255);
    }
    else if (color_mode == 3){
        fill(255,0,0);
    }
    else if (color_mode == 4){
        fill(0,255,0)
    }
    else if (color_mode == 5){
        fill(0,0,255);
    }

    //to draw each previous graffiti
    for (i in drawingCoords){
        text(drawingCoords[i].message, drawingCoords[i].x, drawingCoords[i].y);
    }

}


function keyPressed() {

    if (keyCode === UP_ARROW){
        font_size +=10;
    }
    else if (keyCode === DOWN_ARROW){
        font_size -=10;
    }
    else if (keyCode === LEFT_ARROW){
        color_mode -=1;
        if (color_mode<=0){
            color_mode = 5;
        }
    }
    else if (keyCode === RIGHT_ARROW){
       color_mode +=1;
       if (color_mode>5){
           color_mode = 1;
       }
    }

    //to place the text and send the coordinates and text to all the users
    else if (key === " "){
        let x = mouseX;
        let y = mouseY;
    
        //NOTE: ADD color_mode AND font_size HERE, SO NOT ALL THE TEXTS CHANGE WITH THE KEY ARROWS
        let msgPost =
        { 
            x: round(x),
            y: round(y),
            message: message 
        };
        //console.log(msgPost)
        //emit this information to the server
        socket.emit("msgPositionData", msgPost)
    }


}
