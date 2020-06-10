'use strict';

var gElCanvas;
var gCtx;

// const TOP = 50;
// const BOTTOM = gElCanvas.height - 50;


function onInit() {
    _createImgs();
    renderGallery();
    gElCanvas = document.querySelector('#canvas');
    gCtx = gElCanvas.getContext('2d');
    resizeCanvas(); // sets the canvas size according to it's container
    resetMeme(); // sets the lines back to default settings
    drawMeme(getMeme().selectedImgId); // draws the selected meme
}

function renderLines() {
    drawLines();
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}

function drawLines() {
    const meme = getMeme();
    meme.lines.forEach(line => {
        gCtx.strokeStyle = line.strokeColor;
        gCtx.fillStyle = line.color;
        gCtx.font = line.size + 'px impact';
        gCtx.textAlign = line.align;
        gCtx.fillText(line.txt.toUpperCase(), gElCanvas.width / 2, line.lineHeight);
        gCtx.strokeText(line.txt.toUpperCase(), gElCanvas.width / 2, line.lineHeight);
    })
}

function drawMeme(imgId) {
    var img = new Image()
    img.src = `./imgs/${imgId}.jpg`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
        renderLines()
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
    drawMeme(getMeme().selectedImgId);
    setInputText();
}

function onChangeFontSize(diff) {
    changeFontSize(diff);
    drawMeme(getMeme().selectedImgId)
}

function onChangeLineHeight(diff) {
    changeLineHeight(diff);
    const meme = getMeme();
    drawMeme(meme.selectedImgId)
}

function onSwitchLine() {
    switchLine()
    setInputText()
}

function setInputText() {
    let elLineInput = document.querySelector('[name="lineText"]');
    elLineInput.value = getMeme().lines[getMeme().selectedLineIdx].txt;
    elLineInput.focus()
}

function onDownloadCanvas(elLink) {
    const data = gElCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'New_Meme';
}