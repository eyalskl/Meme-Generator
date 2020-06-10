'use strict';

var gElCanvas;
var gCtx;

// const TOP = 50;
// const BOTTOM = gElCanvas.height - 50;


function onInit() {
    renderGallery()
    gElCanvas = document.querySelector('#editor');
    gCtx = gElCanvas.getContext('2d');
    const meme = getMeme();
    drawMeme(meme.selectedImgId)
}

function renderLine() {
    const meme = getMeme();
    drawLine(meme.lines[meme.selectedLineIdx].txt, 50);
}

function drawLine(text, y) {
    text = text.toUpperCase();
    const meme = getMeme();
    const currLine = meme.lines[meme.selectedLineIdx];
    gCtx.strokeStyle = currLine.strokeColor;
    gCtx.fillStyle = currLine.color;
    gCtx.font = currLine.size + 'px impact';
    gCtx.textAlign = currLine.align;
    gCtx.fillText(text, gElCanvas.width / 2, y);
    gCtx.strokeText(text, gElCanvas.width / 2, y);
}

function drawMeme(imgId) {
    var img = new Image()
    img.src = `./imgs/${imgId}.jpg`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height) //img,x,y,xend,yend
        renderLine()
    }
}

function drawImgFromRemote() {
    var img = new Image()
    img.src = 'https://steamcdn-a.akamaihd.net/steam/apps/431960/ss_39ed0a9730b67a930acb8ceed221cc968bee7731.1920x1080.jpg?t=1571786836';
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height) //img,x,y,xend,yend
    }
}

function downloadCanvas(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-img.jpg'
}

function onSetLineText(lineText) {
    setLineText(lineText);
    drawMeme(getMeme().selectedImgId)
}

function onSetMeme(imgId) {
    setMeme(imgId);
    drawMeme(getMeme().selectedImgId)   
}