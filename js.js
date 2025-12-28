document.documentElement.style.height = '100%';
document.documentElement.style.margin = '0';
document.documentElement.style.padding = '0';


document.body.style.height = '100%';
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.overflow = 'hidden';



var canvas = document.createElement('canvas');
var context = canvas.getContext("2d");



canvas.width = 960;
canvas.height = 540;


canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.display = 'block';
//canvas.style.objectFit = 'contain';
//canvas.style.backgroundColor = '#000'; 



document.body.appendChild(canvas);


blupiImg = new Image();
blupiImg.ready = false;
blupiImg.onload = checkReady;
blupiImg.src = "blupiyellow.png";

skyImg = new Image(); 
skyImg.ready = false;
skyImg.onload = checkReady;
skyImg.src = "sky(2).png";


groundImg = new Image(); 
groundImg.ready = false;
groundImg.onload = checkReady;
groundImg.src = "https://github.com/Happy-Flappy/HTML5-Blupi-Empire/blob/main/ground.png";



buttonsImg = new Image();
buttonsImg.ready = false;
buttonsImg.onload = checkReady;
buttonsImg.src = "buttons.png";


const totalImages = 4;


let selected = 0;



var view = {
    x:0,
    y:0
    
};



class Rect
{
    constructor(left,top,width,height)
    {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}


class Button
{
    constructor()
    {
        this.hover = new Rect(0,0,0,0);
        this.up = new Rect(0,0,0,0);
        this.down = new Rect(0,0,0,0);
        this.icon = new Rect(0,0,0,0);
        this.x = 0;
        this.y = 0;
        this.scale = 2;
        this.rect = this.up;
        this.visible = true;
    }
    
    
    hovering()
    {
        const sm = input.screenMouse;
        return sm.x >= this.x && 
               sm.x <= this.x + this.up.width * this.scale && 
               sm.y >= this.y && 
               sm.y <= this.y + this.up.height * this.scale;

    }
    
    
    
    getClick()
    {
        return input.mouseClick && this.hovering();
    }
    
    
    
    draw()
    {
        if(!this.visible)
            return;
        
        if(!input.mouseClick && this.hovering())
            this.rect = this.hover;
        if(input.mouseClick && this.hovering())
            this.rect = this.down;
        if(!input.mouseClick && !this.hovering())
            this.rect = this.up;
        context.drawImage(buttonsImg,this.rect.left,this.rect.top,this.rect.width,this.rect.height,this.x,this.y,this.rect.width * this.scale,this.rect.height * this.scale);
        context.drawImage(buttonsImg,this.icon.left,this.icon.top,this.icon.width,this.icon.height,this.x + (this.up.width * 0.25) ,this.y + (this.up.height * 0.25),this.icon.width * this.scale,this.icon.height * this.scale);
    }
}



let taskbar = {
    
    buttons: [],
    
    
    init()
    {
        this.buttons.push(new Button());
        this.buttons[0].scale = 1;
        this.buttons[0].x = 0;
        this.buttons[0].y = canvas.height - 41;
        this.buttons[0].up.left = 0;
        this.buttons[0].up.top = 0;
        this.buttons[0].up.width = 41;
        this.buttons[0].up.height = 41;
        
        this.buttons[0].hover =  {...this.buttons[0].up};
        this.buttons[0].hover.left = 80;
        
        
        this.buttons[0].down =  {...this.buttons[0].hover};
        this.buttons[0].down.left = 120;
        
        
    },
    
    
    update()
    {
        const vm = input.viewMouse;
        //check if ground clicked and set destination if so.
        
      
        let btnPressed = false;
        for(let a = 0; a<this.buttons.length;a++)
        {
            
            if(this.buttons[a].getClick())
            {
                btnPressed = true;
            }
            
        }
        
        if(input.mouseClick && !btnPressed)
        {
            if(vm.x >= 0 && vm.x < ground.groundEdge.length)
            {
                if(vm.y > ground.groundEdge[vm.x])
                    blupi[selected].destination = vm.x;
            }
        }
        
        if(this.buttons[0].getClick())
        {
            canvas.requestFullscreen();
        }
        if(document.fullscreenElement !== null)
            this.buttons[0].visible = false;
        else
            this.buttons[0].visible = true;
        
        
    },
    
    draw()
    {
        for(let a=0;a<this.buttons.length;a++)
        {
            this.buttons[a].draw();
        }
    }
    
};



class Blupi 
{
    
    
    constructor(x = 0, y = 0) {
        this.velocity = {
            x: 0,
            y: 0
        };
        this.origin = {
            x: 0,
            y: 0
        };
        this.x = x;
        this.y = y;
        this.left = 0;
        this.top = 0;
        this.width = 64;
        this.height = 64;
        this.scale = 1.3;
        this.destination = x + (64 * 0.5); // Default to current position
        this.ID = blupi.length;
    }
    
    updateMove() {
        if(this.destination < this.origin.x) {
            this.velocity.x = -5;
        }
        if(this.destination > this.origin.x) {
            this.velocity.x = 5;
        }
        
        if(Math.abs(this.destination - this.origin.x) < 5) {
            this.destination = this.origin.x;
            this.velocity.x = 0;
            this.x = this.destination - (this.width * 0.5);
        }
    }
    
    draw() {
        context.drawImage(
            blupiImg,
            this.left,
            this.top,
            this.width,
            this.height,
            this.x - view.x,
            this.y - view.y,
            this.width * this.scale,
            this.height * this.scale
        );
        
        if(this.selected == this.ID)
        {
            //show the health bar and progress bar
            
        }
    }
    
    update() {
        if (37 in input.keyClick) {
            this.x -= 3;
        }
        if (39 in input.keyClick) {
            this.x += 3;
        }

        this.updateMove();
        
        this.origin.x = this.x + (this.width * 0.5);
        this.origin.y = this.y + this.height;
        
        if (this.origin.y > ground.groundEdge[this.origin.x]) {
            this.origin.y = ground.groundEdge[this.origin.x];
            this.y = this.origin.y - this.height;
            this.velocity.y = 0;
        }

        this.velocity.y += 0.5;
        this.y += this.velocity.y;
        this.x += this.velocity.x;
    }
}

let blupi = [];


let ground = {
    
    groundEdge: [],
    
    getGroundEdge() 
    {
        if(groundImg.naturalHeight == 0)
            return;

        // Create a single canvas once instead of for each pixel
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = groundImg.width;
        tempCanvas.height = groundImg.height;
        try {
            tempCtx.drawImage(groundImg, 0, 0);

            // Get ALL pixel data at once
            const imageData = tempCtx.getImageData(0, 0, groundImg.width, groundImg.height);
            const data = imageData.data;  // RGBA array

            for(let vx = 0; vx < groundImg.width; vx++) {
                var found = false;
                for(let vy = 0; vy < groundImg.height; vy++) {
                    // Calculate index in the data array
                    const index = (vy * groundImg.width + vx) * 4;
                    const alpha = data[index + 3];  // Alpha channel

                    if(alpha != 0) {
                        this.groundEdge.push(vy);
                        found = true;
                        break;
                    }
                }
                if(!found) {
                    this.groundEdge.push(groundImg.height - 1);
                }
            }
        } catch(e) {
            // If we can't get pixel data, create a flat ground
            console.warn("Couldn't read pixel data, using flat ground", e);
            for(let vx = 0; vx < groundImg.width; vx++) {
                this.groundEdge.push(groundImg.height - 1);
            }
        }

    },
        
    
    draw()
    {
        context.drawImage(groundImg,0,0,groundImg.width,groundImg.height,-view.x,0,groundImg.width,groundImg.height);
    }

};





//canvas scale from canvas width to display(screen) width.
function getCanvasScale() {
    const canvasRect = canvas.getBoundingClientRect();
    return {
        x: canvas.width / canvasRect.width,
        y: canvas.height / canvasRect.height
    };
}




let input = 
{
    


    viewMouse: {x:0,y:0},
    screenMouse: {x:0,y:0},
    keyClick: {},
    mouseClick: false,
    requestViewMouse:{x:0,y:0},
    requestScreenMouse:{x:0,y:0},
    requestMouseClick: false,
    requestKeyClick: {},
    initialized: false,
    
    endFrame()
    {
        this.mouseClick = false;
        this.requestMouseClick = false;
    },
    
    
    startFrame()
    {
        if(!initialized)
            init();
        //force input to be consistent for each frame. Only changes at start of frame.
        this.viewMouse = this.requestViewMouse;    
        this.screenMouse = this.requestScreenMouse;
        this.mouseClick = this.requestMouseClick;
        this.keyClick = this.requestKeyClick;
    },
    
    
    init() 
    {
        // Use arrow functions to preserve 'this' context
        document.addEventListener("click",function (event) {
            this.requestViewMouse = this.VMouse(event);
            this.requestScreenMouse = this.SMouse(event);
            this.requestMouseClick = true;

        }.bind(this),false);

    
        document.addEventListener("keydown",function (event) {
            this.keyClick[event.keyCode]=true;
        }.bind(this),false);

        document.addEventListener("keyup",function (event) {
            delete this.keyClick[event.keyCode];
        }.bind(this),false);
        
        
        document.addEventListener("mousemove",function (event) {
            this.requestViewMouse = this.VMouse(event);
            this.requestScreenMouse = this.SMouse(event);            
        }.bind(this),false);
  
        
        // listen for blur events to clear input when window loses focus
        window.addEventListener("blur", () => {
            this.keysPressed = {};
            this.mouseClick = false;
        }, false);
        
        // Prevent context menu on right click
        canvas.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        }, false);        
        
        initialized = true;
    },


    VMouse(event)
    {
        const canvasRect = canvas.getBoundingClientRect();
        const scale = getCanvasScale();
        let result = {
            x: (event.clientX - canvasRect.left) * scale.x + view.x,
            y: (event.clientY - canvasRect.top) * scale.y + view.y
        };

        result.x = Math.round(result.x);
        result.y = Math.round(result.y);
        return result;
    },


    SMouse(event)
    {
        const canvasRect = canvas.getBoundingClientRect();
        const scale = getCanvasScale();
        let result = {
            x: (event.clientX - canvasRect.left) * scale.x,
            y: (event.clientY - canvasRect.top) * scale.y
        };

        result.x = Math.round(result.x);
        result.y = Math.round(result.y);
        return result;

    }

};






var imagesLoaded = 0;


function checkReady(){
    this.ready = true;
    imagesLoaded++;
    if(imagesLoaded === totalImages)
    {
        playgame();
    }
}





function playgame(){

    input.init();
    taskbar.init();
    blupi.push(new Blupi(getRand(groundImg.width),-getRand(200)));
    ground.getGroundEdge();
    loop();
}



function getRand(max)
{
    return Math.floor(Math.random() * max);
}

let addBlupiTimer = 0;

function loop()
{        
    input.startFrame();
    
    addBlupiTimer++;
    if(addBlupiTimer > 120)
    {
        addBlupiTimer = 0;
        blupi.push(new Blupi(getRand(groundImg.width),-getRand(200)));
        blupi[blupi.length-1].destination = groundImg.width *2;
    }
    view.x = blupi[selected].origin.x - canvas.width/2;
    taskbar.update();
    for(let a=0;a < blupi.length;a++)
    {
        blupi[a].ID = a;
        blupi[a].update();
    }
    render();
    input.endFrame();
    requestAnimationFrame(loop);
}




function render(){
    
    context.fillStyle = "blue";
    context.fillRect(0,0,canvas.width,canvas.height);
    context.drawImage(skyImg,0,0);
    ground.draw();
    for(let a=0;a<blupi.length;a++)
        blupi[a].draw();
    blupi[0].draw();
    taskbar.draw();
        
    
}


