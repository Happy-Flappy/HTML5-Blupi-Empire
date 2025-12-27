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


const canvasRect = canvas.getBoundingClientRect();

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
groundImg.src = "ground.png";


let selected = 0;



var view = {
    x:0,
    y:0
    
};



let taskbar = {
    
    update(){
        
        //Detect if ground clicked on and set destination if so.
        
        if(mouseclick == 0)
        {
            if(MPosition.y > ground.groundEdge[MPosition.x])
            {
                blupi[selected].destination = MPosition.x;
            }
        }
        
    },
    
    
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
        if (37 in keyclick) {
            this.x -= 3;
        }
        if (39 in keyclick) {
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
        context.drawImage(groundImg,0,0,groundImg.width,groundImg.height,-view.x,-view.y,groundImg.width,groundImg.height);
    }

};









let keyclick = {};
let mouseclick = -1;

let MPosition = {
    x:0,
    y:0
};






document.addEventListener("keydown",function (event) {
    keyclick[event.keyCode]=true;
},false);


document.addEventListener("keyup",function (event) {
    delete keyclick[event.keyCode];
},false);


document.addEventListener("mousedown",function (event) {
    mouseclick = event.button;
    MPosition.x = event.clientX - canvasRect.left + view.x;
    MPosition.y = event.clientY - canvasRect.top + view.y;    
});


document.addEventListener("mouseup",function (event) {
    mouseclick = -1;
});


document.addEventListener("mousemove",function (event) {
    MPosition.x = event.clientX - canvasRect.left + view.x;
    MPosition.y = event.clientY - canvasRect.top + view.y;
});



var imagesLoaded = 0;
const totalImages = 3;


function checkReady(){
    this.ready = true;
    imagesLoaded++;
    if(imagesLoaded === totalImages)
    {
        playgame();
    }
}





function playgame(){
    
    blupi.push(new Blupi(getRand(groundImg.width),-getRand(200)));
    ground.getGroundEdge();
    loop();
}



function getRand(max)
{
    return Math.floor(Math.random() * max);
}


function loop()
{        
    view.x = blupi[selected].origin.x - canvas.width/2;
    taskbar.update();
    for(let a=0;a < blupi.length;a++)
    {
        blupi[a].ID = a;
        blupi[a].update();
    }
    render();
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
}