const objectRandom = require('object-random');
const randomEmoji = require('random-emoji');
const basename = require('twemoji-basename');
const urldecode = require('urldecode');
const gradients = require('uigradients.gradients').gradients;

const getSize = defaultSize => {
  let size = {
    width: defaultSize,
    height: path[3] ? parseInt(path[3]) : defaultSize,
  }
  size.long = size.width > size.height ? size.width : size.height;
  size.short = size.width > size.height ? size.height : size.width;
  return size;
}

const getGradient = () => {
  let gradient = objectRandom(gradients);
  return [
    gradient[0][0].toUpperCase(),
    gradient[0][1].toUpperCase()
  ]
}

const drawBackground = (ctx,$html,gradient,canvasSize) => {
  
  const grd = ctx.createLinearGradient(0,0,canvasSize.width,canvasSize.height);
  grd.addColorStop(0,gradient[0]);
  grd.addColorStop(1,gradient[1]);
  ctx.fillStyle=grd;
  ctx.fillRect(0,0,canvasSize.width,canvasSize.height);
  $html.style.backgroundImage = `linear-gradient(to bottom right,${gradient[0]},${gradient[1]})`;
  
}

const path = window.location.pathname.split('/').map(urldecode);
const template = '/emoji/{basename}.svg'
const emoji = path[1] && path[1] !== 'random' ? path[1] : randomEmoji.random({count: 5})[0].character;

const defaultSize = path[2] ? parseInt(path[2]) : 1024;
const canvasSize = getSize(defaultSize);
const canvas = document.getElementById("surface");
const $main = document.querySelector('main');
const ctx = canvas.getContext("2d");

const imageScale = 3;
const imageSize = canvasSize.short/imageScale;
const image = new Image(imageSize,imageSize);

['width','height'].map(prop => {
  ctx.canvas[prop] = canvasSize[prop];
});

drawBackground(ctx,$main,getGradient(),canvasSize);

image.src = template.replace('{basename}', basename(emoji))
image.addEventListener('load',ev=>{
  ctx.drawImage(image, (canvasSize.width-imageSize)/2, (canvasSize.height-imageSize)/2, imageSize, imageSize);
  
  canvas.toBlob(blob => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(blob);
    if(canvasSize.width>canvasSize.height){
      img.style.width = '50vh';
      img.style.height = canvasSize.height/canvasSize.width*50+'vh';
    } else {
      img.style.width = canvasSize.width/canvasSize.height*50+'vh';
      img.style.height = '50vh';
    }
    $main.appendChild(img);
  })
  
})