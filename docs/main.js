function shadeNav(){
    nav = document.getElementById("navigation");
    if(window.innerWidth >= 550){
        if(window.pageYOffset >= 700-46){
            nav.style.background = "rgba(0, 0, 0, 1)"
        }else{
            nav.style.background= "rgba(0, 0, 0, 0.5)"
        }
    }else{
        if(window.pageYOffset >= 350-92){
            nav.style.background = "rgba(0, 0, 0, 1)"
        }else{
            nav.style.background= "rgba(0, 0, 0, 0.5)"
        }
    }
}

function scrollToSection(id){
    console.log(id);
    $(document).scrollTop($(id).offset().top-(50+parseInt($("#navigation").css("height"))))
}

window.addEventListener("load", ()=>{
    window.addEventListener("scroll", shadeNav)
})





// Petal Canvas
window.addEventListener("load",()=>{
    var canvas = document.getElementsByTagName("canvas").item(0)
    console.log(canvas);
    var navHeight = $("#navigation").height();
    canvas.width = window.innerWidth;
    canvas.height = $(".hero-image").height() - navHeight;
    
    var c = canvas.getContext('2d');
    console.log(c);
    // [End Taken from lecture 10]
    
    
    
    // [Start Cite: Some of the lines were taken from / inspired by https://codepen.io/rudtjd2548/pen/qBpVzxP?editors=0010]
    var numPetals = 12;
    var petalArray = [];
    var maxDistance = 2.5;
    var minDistance = 1;
    var globalSize = window.innerWidth / 1600;
    var speed = 0.5 * globalSize;
    
    
    const petalImage = new Image();
    petalImage.src = './images/petal.png';
    
    petalImage.addEventListener('load',()=>{
        //[End Cite ]
    
        var i = 0;
        while(i < numPetals){
            var distance = minDistance + (Math.random() * (maxDistance - minDistance));
            var size = 100 * (1/distance**2);
            var x = size/2 + (canvas.width - size)*Math.random() * (distance**2);
            var y = size * 2 + (Math.random()*canvas.height/4*(distance**4));
            var dx = 30 * (Math.random() - 0.5);
            var dy = 8 * (Math.random() - 0.3);
            petalArray.push(new Petal(x,y, size, 0, dx, dy, distance));
            i++;
        }
        console.log("hi",petalArray)
        animate();
    })
    
    function randAngle(){
        return Math.random() * Math.PI * 2
    }
    
    function modPi(angle){
        return angle - (Math.floor(angle/Math.PI)*Math.PI)
    }
    
    function correctAngle(dx, dy){
        var dir = dx/Math.abs(dx);
        return dir * Math.atan(dy/dx);
    }
    
    function compare(a,b){
        if ( a.distance < b.distance ){
            return 1;
          }
          if ( a.distance > b.distance ){
            return -1;
          }
          return 0;
    }
    
    function animate(){
        c.clearRect(0,0, canvas.width, canvas.height);
        petalArray.sort(compare);
        var navHeight = $("#navigation").height();
        canvas.width = window.innerWidth;
        canvas.height = $(".hero-image").height() - navHeight;
        canvas.style.marginTop = navHeight;
        globalSize = window.innerWidth / 1600;
        for(petal of petalArray){
            petal.update();
            petal.draw();
        }
        requestAnimationFrame(animate);
    }
    // requestAnimationFrame(animate);
    
    function Petal(x,y,size,angle,dx,dy,distance){
        this.x = x;
        this.y = y;
        this.size = size
        this.angle = angle;
        this.dx = dx;
        this.dy = dy;
        this.distance = distance;
    
        this.draw = function(){
            //[Cite: Took this angling code from https://stackoverflow.com/questions/3793397/html5-canvas-drawimage-with-at-an-angle]
            c.save();
            c.globalAlpha = (1 - (this.distance / maxDistance)) *0.5
            var modX = (((this.x/(this.distance**2)%canvas.width)+canvas.width) %canvas.width)
            c.translate(modX , this.y/distance**2);
            c.rotate(Math.PI + this.angle);
            c.drawImage(petalImage, -1* this.size / 2,  -1* this.size / 2, this.size * globalSize, this.size * globalSize);
            c.restore();

            if(modX > canvas.width - this.size){
                c.save();
                c.globalAlpha = (1 - (this.distance / maxDistance)) *0.5
                var modX = (((this.x/(this.distance**2)%canvas.width)+canvas.width) %canvas.width)
                c.translate(modX - canvas.width, this.y/distance**2);
                c.rotate(Math.PI + this.angle);
                c.drawImage(petalImage, -1* this.size / 2,  -1* this.size / 2, this.size * globalSize, this.size * globalSize);
                c.restore();
            }
            //[End Cite]
        }
        
    
        this.update = function(){
            if(this.dx === 0 && this.dy === 0 && this.y/this.distance**2 > canvas.height){
                return;
            }
    
            this.x = this.x + (this.dx*speed);
            this.y = this.y + (this.dy + 0.15)*speed;
    
            // console.log(this.y/this.distance**2, canvas.height)
            if(this.y/this.distance**2 > canvas.height){
                // Hit the bottom
                
                console.log("drop");
                var distance = 1 + (Math.random() * 1.5);
                var size = 100 * (1/distance**2);
                var x = size/2 + (canvas.width - size)*Math.random() * (distance**2);
                var y = 0 - size/2;
                var dx = 30 * (Math.random() - 0.5);
                var dy = 8 * (Math.random() - 0.3);
                petalArray.push(new Petal(x,y, size, 0, dx, dy, distance));
                
                this.dy = 0;
                this.dx = 0;
                return;
            }
    
            var dir = this.dx/Math.abs(this.dx);
            this.dx += dir * 0.04 * this.dy;
            
            var isNeg = this.dy < 0;
            this.dy -= (0.015 * Math.abs(this.dx)) - 0.15;
            var isNoLongerNeg = this.dy >= 0;
            
            if(isNeg && isNoLongerNeg){
                // console.log(this.dx, (10 - Math.abs(this.dx))/10)
                var rand = Math.random()
                if(rand < 1.5**(-Math.abs(this.dx))){
                    // console.log(rand, this.dx, );
                    this.dx = - this.dx / 2;
                }
            }
            // if(Math.abs(this.dx) < 1){
            //     // console.log("trigger", this.dx)
            //     if(dir < 0 ){
            //         // console.log("trigger",this.dx, (Math.abs(this.dx)+0.5));
            //         this.dx = (Math.abs(this.dx)+0.5);
            //     }else{
            //         // console.log("trigger",this.dx, -this.dx - 0.5);
            //         this.dx = -this.dx - 0.5;
            //     }
            // }
            this.angle = correctAngle(dx,dy);
            // console.log(this.dy, this.dx, this.angle);
            // console.log(this.dx, this.dy)


            document.querySelector("html").style.width = window.innerWidth
        }
    }
    



})