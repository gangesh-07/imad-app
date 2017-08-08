console.log('Loaded!');
var element=document.getElementById('main-text');

// changed the text of main-text div
element.innerHTML='new value';
//move the image
var img=document.getElementById('madi');
img.onclick=function(){
    img.style.marginleft='110px';
};