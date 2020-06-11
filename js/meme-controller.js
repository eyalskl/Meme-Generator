'use strict';

var gElCanvas;
var gCtx;
var gCanDrag;
var gThemes = [
    {name: 'default', url: 'icons/bg.jpg', navColor: 'rgba(230, 230, 230, 0.781)'},
    {name: 'cats', url: 'icons/cats.jpg', navColor: '#88715f'},
    {name: 'politic', url: 'icons/politic.jpg', navColor: '#e8eced'},
    {name: 'anime', url: 'icons/anime.jpg', navColor: 'rgb(254, 80, 87)'},
    {name: 'kid', url: 'icons/kid.jpg', navColor: '#05b84f'},
    {name: 'dogs', url: 'icons/dogs.jpg', navColor: '#4d342d'}
];


function onInit() {
    gSavedMemes = loadFromStorage(KEY);
    if (!gSavedMemes) gSavedMemes = [];
    createImgs();
    gKeywords = createKeywordMap();
    renderGallery();
    renderKeywords();
    gElCanvas = document.querySelector('#canvas');
    gCtx = gElCanvas.getContext('2d');
    resizeCanvas(); // sets the canvas size according to it's container
    resetMeme(); // sets the lines back to default settings
    renderMeme(); // draws the selected meme
    document.querySelector('.meme-editor').classList.add('hide');
    document.querySelector('.memes').classList.add('hide');
}

function renderControls() {
    var line = getMeme().lines[getMeme().selectedLineIdx];
    document.querySelector('[name="fontFamily"]').value = line.font;
    document.querySelector('[name="strokeColor"]').value = line.strokeColor;
    document.querySelector('[name="fontSize"]').value = line.size;
    document.querySelector('.font-size').innerText = line.size;
    document.querySelector('[for="fontColor"]').style.color = line.color;
    document.querySelector('[for="strokeColor"]').style.color = line.strokeColor;

    // document.querySelector('[name="lineText]') = line.txt;
    setBtnMode(document.getElementById(`${line.align}`));
}

function toggleDrag() {
    gCanDrag = !gCanDrag;
}

function stopDrag() {
    gCanDrag = false;
}

function dragLines(ev) {
    if (!gCanDrag) return;
    ev.preventDefault();
    const line = getMeme().lines[getMeme().selectedLineIdx];
    line.x = ev.offsetX;
    line.y = ev.offsetY;
    renderMeme()
}

function onWheelFontSize(ev) {
    ev.preventDefault();
    if (ev.wheelDelta < 0) changeFontSize(-2);
    else changeFontSize(2);
    renderMeme();
    if (getMeme().lines[getMeme().selectedLineIdx].size < 0) return;
    document.querySelector('.font-size').innerText = getMeme().lines[getMeme().selectedLineIdx].size
    document.querySelector('[name="fontSize"]').value = getMeme().lines[getMeme().selectedLineIdx].size;
}

function renderLines() {
    drawLines();
}

function renderMeme() {
    drawMeme(getMeme().selectedImgId);
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}

function resizeCanvasOnResize() {
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
    resetMeme();
    renderMeme();
}

function drawLines() {
    const meme = getMeme();
    meme.lines.forEach((line, idx) => {
        if (idx === meme.selectedLineIdx) {
            gCtx.fillStyle = `rgba(255,255,255,0.5)`
            gCtx.fillRect(0, line.y - line.size, gElCanvas.width, line.size);
        }
        gCtx.font = line.size + 'pt ' + line.font;
        gCtx.textAlign = line.align;
        gCtx.strokeStyle = line.strokeColor;
        gCtx.fillStyle = line.color;
        gCtx.fillText(line.txt.toUpperCase(), line.x, line.y);
        gCtx.strokeText(line.txt.toUpperCase(), line.x, line.y);
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
    renderMeme();
}

function onSetFontFamily(fontFamily) {
    setFontFamily(fontFamily);
    renderMeme();
    document.querySelector('[name="fontFamily"]').style.fontFamily = document.querySelector('[name="fontFamily"]').value;
}

function onSetMeme(imgId) {
    setMeme(imgId);
    renderMeme();
    setInputText();
    document.querySelector('.meme-editor').classList.remove('hide');
    document.querySelector('.meme-gallery').classList.add('hide');
    document.querySelector('.memes').classList.add('hide');
}

function openGallery() {
    document.querySelector('.meme-gallery').classList.remove('hide');
    document.querySelector('.meme-editor').classList.add('hide');
    document.querySelector('.memes').classList.add('hide');
    resetMeme();
    renderMeme();
}

function openThemes() {
    document.querySelector('.themes').classList.toggle('hide');
}

function closeThemes() {
    document.querySelector('.themes').classList.add('hide');
}

function openSavedMemes() {
    document.querySelector('.meme-gallery').classList.add('hide');
    document.querySelector('.meme-editor').classList.add('hide');
    document.querySelector('.memes').classList.remove('hide');
    renderSavedMemes();
}

function onChangeFontSize(diff) {
    changeFontSize(diff);
    renderMeme()
    let currFontSize = +document.querySelector('.font-size').innerText + diff;
    if (currFontSize < 0) return;
    document.querySelector('.font-size').innerText = currFontSize;
    document.querySelector('[name="fontSize"]').value = currFontSize;
}

function onChangeLineHeight(diff) {
    changeLineHeight(diff);
    // const meme = getMeme();
    // drawMeme(meme.selectedImgId);
    renderMeme();
}

function onSetFontColor(color) {
    setFontColor(color);
    renderMeme();
    document.querySelector('[for="fontColor"]').style.color = color;
}

function onSetStrokeColor(strokeColor) {
    setStrokeColor(strokeColor);
    renderMeme()
    document.querySelector('[for="strokeColor"]').style.color = strokeColor;
}

function onSetFontSize(fontSize) {
    setFontSize(+fontSize);
    renderMeme();
    document.querySelector('.font-size').innerText = fontSize;
}

function onSetAlignText(elAlignBtn) {
    setAlignText(elAlignBtn.id);
    renderMeme()
    setBtnMode(elAlignBtn)
}

function onSwitchLine(ev) {
    if (ev.type === 'click') {
        switchLine()
        setInputText()
        renderMeme();
    } else {
        var offsetY = ev.offsetY;
        getMeme().lines.forEach((line, idx) => {
            if (idx === getMeme().selectedLineIdx) gCanDrag = true;
            else if (offsetY >= (line.y - line.size) && offsetY <= line.y) {
                getMeme().selectedLineIdx = idx;
                renderMeme();
                gCanDrag = true;
            }
        })
    }
    renderControls();
}

function onRemoveLine() {
    removeLine();
    renderMeme();
}

function onAddLine() {
    addLine();
    renderMeme();
    setInputText()
}

function setInputText() {
    let elLineInput = document.querySelector('[name="lineText"]');
    // if (getMeme().selectedLineIdx === -1) {
    //     elLineInput.value = 'Not editing any lines'
    //     return;
    // }
    elLineInput.value = getMeme().lines[getMeme().selectedLineIdx].txt;
    elLineInput.focus()
}

function onDownloadMeme(elLink) {
    const data = gElCanvas.toDataURL("image/jpeg");
    console.log('data:', data)
    elLink.href = data;
    elLink.download = 'New_Meme';
    hideShareBtns();
}

function onSaveMeme() {
    var savedMeme = gElCanvas.toDataURL("image/png");
    saveMeme(savedMeme);
    hideShareBtns()
}

function renderSavedMemes() {
    const savedMemes = loadFromStorage(KEY);
    var strHTML;
    if (!savedMemes || savedMemes.length === 0) strHTML = 'There are no saved memes yet!'
    else strHTML = savedMemes.map((meme, idx) => {
        return `<img id=${idx} title="Click to delete" onclick="onDeleteSavedMeme(this.id)" src="${meme}" />`;
    }).join('')
    document.querySelector('.saved-memes-container').innerHTML = strHTML;
}

function onDeleteSavedMeme(memeIdx) {
    if (!confirm('You are about to delete this meme, are you sure?')) return
    deleteSavedMeme(memeIdx);
    renderSavedMemes();
}

function setBtnMode(elAlignBtn) {
    document.querySelectorAll('.align-text button').forEach(btn => btn.classList.remove('mode'));
    elAlignBtn.classList.add('mode');
}

function setThemeMode(elThemeBtn) {
    document.querySelectorAll('.themes button').forEach(btn => btn.classList.remove('selected-theme'));
    elThemeBtn.classList.add('selected-theme');
}

function onSetFilterBy(keyword) {
    setFilterBy(keyword);
    renderGallery();
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderCanvas)
}
function loadImageFromInput(ev, onImageReady) {
    // document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader();

    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result;
    }
    reader.readAsDataURL(ev.target.files[0]);
}

function renderCanvas(img) {
    gElCanvas.wih = 500;
    gElCanvas.height = 500;
    gCtx.drawImage(img, 0, 0);
    renderLines();
    document.querySelector('.meme-editor').classList.remove('hide');
    document.querySelector('.meme-gallery').classList.add('hide');
    document.querySelector('.memes').classList.add('hide');
}

function onAddSticker(sticker) {
    addSticker(sticker);
    renderMeme();
}

function onSetTheme(elThemeBtn) {
    var themeName = elThemeBtn.id;
    var theme = gThemes.find(theme => theme.name === themeName);
    document.body.style.backgroundImage = `url('${theme.url}')`;
    document.querySelector('.main-footer').style.backgroundColor = theme.navColor;
    document.querySelector('.main-footer').style.opacity = '0.9';
    document.querySelector('.nav').style.backgroundColor = theme.navColor;
    if (theme.name !== 'default') document.querySelector('.nav').style.opacity = '0.9';
    setThemeMode(elThemeBtn);
}


function toggleMenu() {
    document.body.classList.toggle('menu-open');
}