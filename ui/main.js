console.log('Loaded!');
//var element=document.getElementById('main-text');

// changed the text of main-text div
//element.innerHTML='new value';
//move the image
var img=document.getElementById('madi');

var marginLeft=0;
function moveRight() {
    marginLeft=marginLeft+1;
    img.style.marginLeft=marginLeft+"px";
}

img.onclick=function(){
    var interval=setInterval(moveRight,50);
};


var submit=document.getElementById('submit_btn');
submit.onclick=function(){
    
    //create a request object
    var request=new XMLHttpRequest();
    
    
    //capture the response and store it in a variable
    request.onreadystatechange=function(){
      if(request.readystate===XMLHttpRequest.Done)
      {
          //take some action
          if(request.status===200){
              alert('Logged in successfully!');
          }else if(request.status===403){
              alert('Invalid username/password');
          }else if(request.status===500){
              alert('something went wrong on the server...sorry');
          }
      }
        
    };
    
   var username=document.getElementById('username');
   var password=document.getElementById('password');
   console.log(username);
   console.log(password);
   request.open('POST','http://gangesh97dhar.imad.hasura-app.io/login',true);
   request.setRequestHeader('Current-Type','application/json');
   request.send(JSON.stringify({username: username, password: password}));
    
};