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

window.addEventListener("load", ()=>{
    window.addEventListener("scroll", shadeNav)
})


