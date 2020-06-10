'use strict';

var gKeywords = { 'happy': 12, 'funny puk': 1 } 

var gImgs = [
    { id: 1, url: 'imgs/1.jpg', keywords: ['happy'] },
    { id: 2, url: 'imgs/2.jpg', keywords: ['sad'] }
]; 

var gMeme = {
    selectedImgId: 1, 
    selectedLineIdx: 0,

    lines: [
        {
            txt: 'I never eat Falafel',
            size: 30, 
            align: 'center',
            color: 'red',
            strokeColor: 'black'
        }
    ]
}

function getMeme() {
    return gMeme;
}

function getImgs() {
    return gImgs;
}

function setLineText(lineText) {
    gMeme.lines[gMeme.selectedLineIdx].txt = lineText;
}

function setMeme(imgId) {
    gMeme.selectedImgId = imgId;
}