'use strict';

const KEY = 'savedMemes'


var gImgs = [];
var gKeywords;
var gKeywordsCount;

var gSavedMemes;
var gFilterBy = 'all';
var gKeywordsToShow = 5;

var gElCanvas = document.querySelector('#canvas');

var gMeme = {
    selectedImgId: 1
}
function resetMeme() {
    gMeme.selectedLineIdx = 0;
    gMeme.lines = [
        {
            txt: 'insert text here',
            font: 'Impact',
            size: 20,
            align: 'center',
            color: '#ffffff',
            strokeColor: '#000000',
            y: 50,
            x: gElCanvas.width / 2
        },
        {
            txt: 'insert text here',
            font: 'Impact',
            size: 20,
            align: 'center',
            color: '#ffffff',
            strokeColor: '#000000',
            y: gElCanvas.height - 25,
            x: gElCanvas.width / 2
        }
    ]
}


function createImgs() {
    gImgs.push(_createImg(1, `imgs/meme-imgs/1.jpg`, ['popular', 'men']));
    gImgs.push(_createImg(2, `imgs/meme-imgs/2.jpg`, ['love', 'puppy', 'dog', 'animal', 'cute']));
    gImgs.push(_createImg(3, `imgs/meme-imgs/3.jpg`, ['baby', 'sleep', 'cute']));
    gImgs.push(_createImg(4, `imgs/meme-imgs/4.jpg`, ['cat', 'animal', 'sleep']));
    gImgs.push(_createImg(5, `imgs/meme-imgs/5.jpg`, ['success', 'baby', 'cute']));
    gImgs.push(_createImg(6, `imgs/meme-imgs/6.jpg`, ['wonder', 'men']));
    gImgs.push(_createImg(7, `imgs/meme-imgs/7.jpg`, ['baby', 'surprised']));
    gImgs.push(_createImg(8, `imgs/meme-imgs/8.jpg`, ['wonder', 'smile', 'men']));
    gImgs.push(_createImg(9, `imgs/meme-imgs/9.jpg`, ['laugh', 'popular', 'baby', 'cute']));
    gImgs.push(_createImg(10, `imgs/meme-imgs/10.jpg`, ['laugh', 'obama']));
    gImgs.push(_createImg(11, `imgs/meme-imgs/11.jpg`, ['kiss', 'men']));
    gImgs.push(_createImg(12, `imgs/meme-imgs/12.jpg`, ['point', 'men']));
    gImgs.push(_createImg(13, `imgs/meme-imgs/13.jpg`, ['cheers', 'smile', 'dicaprio']));
    gImgs.push(_createImg(14, `imgs/meme-imgs/14.jpg`, ['amazed', 'popular', 'matrix']));
    gImgs.push(_createImg(15, `imgs/meme-imgs/15.jpg`, ['popular', 'men']));
    gImgs.push(_createImg(16, `imgs/meme-imgs/16.jpg`, ['awkward', 'lol', 'bald', 'men']));
    gImgs.push(_createImg(17, `imgs/meme-imgs/17.jpg`, ['point', 'men', 'russia']));
    gImgs.push(_createImg(18, `imgs/meme-imgs/18.jpg`, ['toy story', 'point', 'popular']));
}

function setUploadImg(img) {
    gImgs.push({ id: img.src, url: img.src, keywords: ['uploaded'] });
    gMeme.selectedImgId = img.src;
}

function _createImg(id, url, keywords) {
    return { id, url, keywords }
}

function getMeme() {
    return gMeme;
}

function getCurrLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function getKeywordsCount() {
    return gKeywordsCount;
}
function getKeywordsToShow() {
    return gKeywordsToShow;
}

function raiseKeywordsCount(key) {
    gKeywords[key]++;
}

function setFilterBy(keyword) {
    gFilterBy = keyword;
    raiseKeywordsCount(keyword)
}

function showKeywords(isAllShown) {
    gKeywordsToShow = (isAllShown) ? gKeywordsCount : 5;
}

function getImgs() {
    if (gFilterBy === '' || gFilterBy === 'all') return gImgs;
    return gImgs.filter(img => {
        var found = false;
        for (var i = 0; i < img.keywords.length; i++) {
            if (img.keywords[i] === gFilterBy.toLowerCase()) found = true;
        }
        return found;
    });
}

function deleteSavedMeme(memeIdx) {
    gSavedMemes.splice(memeIdx, 1);
    saveToStorage(KEY, gSavedMemes)
}

function getSavedMemes() {
    return gSavedMemes;
}

function getKeywords() {
    return gKeywords;
}

function setLineText(lineText) {
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) return;
    gMeme.lines[gMeme.selectedLineIdx].txt = lineText;
}

function setFontColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color;
}

function setStrokeColor(strokeColor) {
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = strokeColor;
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

function addLine(txt = 'insert text here', isSticker = false) {
    gMeme.lines.push({
        txt,
        font: 'Impact',
        size: 20,
        align: 'center',
        color: '#ffffff',
        strokeColor: '#000000',
        y: gElCanvas.height / 2,
        x: gElCanvas.width / 2,
        isSticker,
    });
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function saveMeme(savedMeme) {
    gSavedMemes.push(savedMeme)
    saveToStorage(KEY, gSavedMemes)
}



function createKeywordMap() {
    const keywordMap = gImgs.reduce((keywordMap, img) => {
        for (var i = 0; i < img.keywords.length; i++) {
            var currKey = img.keywords[i];
            if (!keywordMap[currKey]) {
                keywordMap[currKey] = 0;
            }
        }
        return keywordMap;
    }, {});
    gKeywordsCount = Object.keys(keywordMap).length;
    return keywordMap;
}

function addSticker(sticker) {
    addLine(sticker, true);
}