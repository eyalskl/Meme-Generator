'use strict';

const KEY = 'savedMemes'

var gKeywords = { 'happy': 12, 'funny puk': 1 }

var gImgs = [];
var gSavedMemes;

var gElCanvas = document.querySelector('#canvas');

var gMeme = {
    selectedImgId: 1
}
function resetMeme() {
    gMeme.selectedLineIdx = 0;
    gMeme.lines = [
        {
            txt: 'insert text here',
            font: 'impact',
            size: 30,
            align: 'center',
            color: 'white',
            strokeColor: 'black',
            y: 50,
            x: gElCanvas.width /2
        },
        {
            txt: 'insert text here',
            font: 'impact',
            size: 30,
            align: 'center',
            color: 'white',
            strokeColor: 'black',
            y: gElCanvas.height - 50,
            x: gElCanvas.width /2
        }
    ]
}

function _createImgs() {
    gImgs.push(_createImg(1, `imgs/1.jpg`, ['angry', 'popular']));
    gImgs.push(_createImg(2, `imgs/2.jpg`, ['love', 'puppy']));
    gImgs.push(_createImg(3, `imgs/3.jpg`, ['baby', 'sleep']));
    gImgs.push(_createImg(4, `imgs/4.jpg`, ['cat']));
    gImgs.push(_createImg(5, `imgs/5.jpg`, ['success']));
    gImgs.push(_createImg(6, `imgs/6.jpg`, ['wonder']));
    gImgs.push(_createImg(7, `imgs/7.jpg`, ['baby', 'surprised']));
    gImgs.push(_createImg(8, `imgs/8.jpg`, ['wonder', 'smile']));
    gImgs.push(_createImg(9, `imgs/9.jpg`, ['laugh', 'popular']));
    gImgs.push(_createImg(10, `imgs/10.jpg`, ['laugh']));
    gImgs.push(_createImg(11, `imgs/11.jpg`, ['kiss']));
    gImgs.push(_createImg(12, `imgs/12.jpg`, ['point']));
    gImgs.push(_createImg(13, `imgs/13.jpg`, ['cheers', 'smile']));
    gImgs.push(_createImg(14, `imgs/14.jpg`, ['amazed', 'popular']));
    gImgs.push(_createImg(15, `imgs/15.jpg`, ['popular']));
    gImgs.push(_createImg(16, `imgs/16.jpg`, ['awkward', 'lol']));
    gImgs.push(_createImg(17, `imgs/17.jpg`, ['point']));
    gImgs.push(_createImg(18, `imgs/18.jpg`, ['toy story', 'point', 'popular']));
}

function _createImg(id, url, keywords) {
    return { id, url, keywords }
}

function getMeme() {
    return gMeme;
}

function getImgs() {
    return gImgs;
}

function getSavedMemes() {
    return gSavedMemes;
}

function setLineText(lineText) {
    gMeme.lines[gMeme.selectedLineIdx].txt = lineText;
}

function setFontColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color;
}

function setFontSize(fontSize) {
    gMeme.lines[gMeme.selectedLineIdx].size = fontSize;
}

function setFontFamily(fontFamily) {
    gMeme.lines[gMeme.selectedLineIdx].font = fontFamily;
}

function setAlignText(alignDir) {
    gMeme.lines[gMeme.selectedLineIdx].align = alignDir;
}

function setMeme(imgId) {
    // gMeme.lines.forEach(line => line.txt = 'insert text here')
    resetMeme();
    gMeme.selectedImgId = imgId;
}

function changeFontSize(diff) {
    if (gMeme.lines[gMeme.selectedLineIdx].size <= 5 && diff < 0) return
    gMeme.lines[gMeme.selectedLineIdx].size += diff;
}

function changeLineHeight(diff) {
    const currLine = gMeme.lines[gMeme.selectedLineIdx];
    currLine.y += diff;
}

function switchLine() {
    gMeme.selectedLineIdx++
    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0;
}

function removeLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedLineIdx = 0;
}

function addLine() {
    gMeme.lines.push({
        txt: 'insert text here',
        font: 'impact',
        size: 30,
        align: 'center',
        color: 'white',
        strokeColor: 'black',
        y: gElCanvas.height / 2,
        x: gElCanvas.width / 2
    });
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function saveMeme(savedMeme) {
    gSavedMemes.push(savedMeme)
    saveToStorage(KEY, gSavedMemes)
}