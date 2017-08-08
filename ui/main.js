console.log('Loaded!');
var element=document.getElementById('main-text');

// changed the text of main-text div
element.innerHTML='new value';
//move the image
var img=document.getElementById('madi');

var marginLeft=0;
function moveRight() {
    marginLeft=marginLeft+10;
    img.style.marginLeft=marginLeft+"px";
}

img.onclick=function(){
    var interval=setInterval(moveRight,100);
};