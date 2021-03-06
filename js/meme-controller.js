'use strict';

var gElCanvas;
var gCtx;
var gCanDrag;
var gCanShare = false;
var gThemes = [
    { name: 'default', url: 'imgs/bg-imgs/default.jpg', navColor: 'rgba(230, 230, 230, 0.781)' },
    { name: 'cats', url: 'imgs/bg-imgs/cats.jpg', navColor: '#88715f' },
    { name: 'politic', url: 'imgs/bg-imgs/politic.jpg', navColor: '#e8eced' },
    { name: 'anime', url: 'imgs/bg-imgs/anime.jpg', navColor: 'rgb(254, 80, 87)' },
    { name: 'kid', url: 'imgs/bg-imgs/kid.jpg', navColor: '#05b84f' },
    { name: 'dogs', url: 'imgs/bg-imgs/dogs.jpg', navColor: '#4d342d' }
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
    setTouchListeners();
    resizeCanvas();
    resetMeme();
    document.querySelector('.meme-editor').classList.add('hide');
    doTrans();
}

function onManuellyType(ev) {
    if (document.querySelector('.meme-editor').classList.contains('hide')) return;
    var line = getCurrLine()
    if (ev.key === ' ' || ev.key === 'ArrowUp' || ev.key === 'ArrowDown') ev.preventDefault();
    if (ev.key === 'Escape') openGallery();
    if (ev.key === 'Tab') onSwitchLine(ev);
    if (ev.key === 'Delete') onRemoveLine();
    if (ev.key === 'Insert') onAddLine();
    if (ev.key === 'ArrowUp') onChangeLineHeight(-10);
    if (ev.key === 'ArrowDown') onChangeLineHeight(10);
    if (line.isSticker) return;
    if (ev.key === 'Backspace') line.txt = line.txt.slice(0, -1); //todo: check double types
    else if (ev.key.length > 1) return;
    else line.txt += ev.key;
    // document.querySelector('[name="lineText"]').value = line.txt;
    renderMeme();
}

function onSetLang(elLang) {
    document.querySelectorAll('.trans a').forEach(elLang => elLang.classList.remove('active-lang'));
    elLang.classList.add('active-lang');
    setLang(elLang.id);

}
//todo: move to html
function setTouchListeners() {
    gElCanvas.addEventListener('touchstart', (ev) => {
        ev.preventDefault()
        onSwitchLine(event)
    })
    gElCanvas.addEventListener('touchend', (ev) => {
        ev.preventDefault()
        toggleDrag();
    })
    gElCanvas.addEventListener('touchmove', (ev) => {
        dragLines(ev)
    })
}


function renderControls() {
    var line = getCurrLine();
    document.querySelector('[name="fontFamily"]').value = line.font;
    document.querySelector('[name="strokeColor"]').value = line.strokeColor;
    document.querySelector('[name="fontSize"]').value = line.size;
    document.querySelector('.font-size').innerText = line.size;
    document.querySelector('[for="fontColor"]').style.color = line.color;
    document.querySelector('[for="strokeColor"]').style.color = line.strokeColor;
    setBtnMode(document.getElementById(`${line.align}`));
}

function toggleDrag() {
    gCanDrag = !gCanDrag;
}

function stopDrag() {
    gCanDrag = false;
}

function dragLines(ev) {
    ev.preventDefault();
    if (!gCanDrag) return;
    const line = getCurrLine();
    if (ev.type === 'touchmove') {
        var touchPos = getTouchPos(gElCanvas, ev);
        line.x = touchPos.x;
        line.y = touchPos.y;
    } else {
        line.x = ev.offsetX;
        line.y = ev.offsetY;
    }
    renderMeme()
}

function getTouchPos(canvas, touchEvent) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
}

function onWheelFontSize(ev) {
    ev.preventDefault();
    if (ev.wheelDelta < 0) changeFontSize(-2);
    else changeFontSize(2);
    renderMeme();
    if (getCurrLine().size < 0) return;
    document.querySelector('.font-size').innerText = getCurrLine().size
    document.querySelector('[name="fontSize"]').value = getCurrLine().size;
}

function renderLines() {
    drawLines();
}

function renderMeme(imgId = getMeme().selectedImgId) {
    drawMeme(imgId);
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}


function drawLines() {
    const meme = getMeme();
    meme.lines.forEach((line, idx) => {
        if (idx === meme.selectedLineIdx && !gCanShare) {
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
    var elImg = new Image()
    if (isNaN(imgId)) elImg.src = imgId;
    else elImg.src = `imgs/meme-imgs/${imgId}.jpg`;
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
        drawLines()
    }
}

function downloadCanvas(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-img.jpg'
}



function onSetFontFamily(fontFamily) {
    setFontFamily(fontFamily);
    renderMeme();
    document.querySelector('[name="fontFamily"]').style.fontFamily = document.querySelector('[name="fontFamily"]').value;
}

function onSetMeme(imgId) {
    setMeme(imgId);
    renderControls()
    renderMeme();
    setInputText();
    document.querySelector('.meme-editor').classList.remove('hide');
    document.querySelector('.meme-gallery').classList.add('hide');
    document.querySelector('.memes').classList.add('hide');
}

function openGallery(elNavLink) {
    if (elNavLink) onSetActive(elNavLink)
    document.querySelector('.meme-gallery').classList.remove('hide');
    document.querySelector('.meme-editor').classList.add('hide');
    document.querySelector('.memes').classList.add('hide');
    resetMeme();
    renderMeme();
}
function openGallery2() {
    document.querySelector('.meme-gallery').classList.remove('hide');
    document.querySelector('.meme-editor').classList.add('hide');
    document.querySelector('.memes').classList.add('hide');
    document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
    document.querySelector('.gallery-link').classList.add('active');
}

function openThemes(elNavLink) {
    elNavLink.classList.toggle('active');
    document.querySelector('.themes').classList.toggle('hide');
}

function closeThemes() {
    document.querySelector('.theme-link').classList.toggle('active');
    document.querySelector('.themes').classList.add('hide');
}

function openSavedMemes(elNavLink) {
    onSetActive(elNavLink)
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
    if (ev.type === 'click' || ev.type === 'keydown') {
        switchLine()
        setInputText()
        renderMeme();
    } else {
        var offsetY;
        if (ev.type === 'touchstart') offsetY = getTouchPos(gElCanvas, ev).y
        else offsetY = ev.offsetY;
        getMeme().lines.forEach((line, idx) => {
            if (idx === getMeme().selectedLineIdx) gCanDrag = true;
            if (offsetY >= (line.y - line.size) && offsetY <= line.y) {
                getMeme().selectedLineIdx = idx;
                renderMeme();
                gCanDrag = true;
            }
        })
        document.querySelector('[name="lineText"]').value = getCurrLine().txt;
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
function onSetLineText(lineText) {
    setLineText(lineText);
    renderMeme();
}

function setInputText() {
    let elLineInput = document.querySelector('[name="lineText"]');
    elLineInput.value = getCurrLine().txt;
    elLineInput.focus()
}

function onDownloadMeme(elLink) {
    const data = gElCanvas.toDataURL("image/jpeg");
    elLink.href = data;
    elLink.download = 'New_Meme';
    hideShareBtns();
    gCanShare = false;
    renderMeme();
}

function onSaveMeme() {
    var savedMeme = gElCanvas.toDataURL("image/jpeg");
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

function onSetActive(elLink) {
    document.querySelectorAll('.main-nav a.nav-link').forEach(a => a.classList.remove('active'));
    elLink.classList.add('active');
}


function onSetFilterBy(keyword) {
    setFilterBy(keyword.toLowerCase());
    renderGallery();
    enlargeKeyword(keyword.toLowerCase());
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderCanvas)
}

function loadImageFromInput(ev, onImageReady) {
    var reader = new FileReader();

    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result;
    }
    reader.readAsDataURL(ev.target.files[0]);
}

function renderCanvas(img) {
    setUploadImg(img);
    gElCanvas.width = 500;
    gElCanvas.height = 500;
    renderMeme(img.src);
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
    document.querySelector('.main-nav').style.backgroundColor = theme.navColor;
    document.querySelectorAll('.main-nav li a').forEach(elA => elA.style.backgroundColor = theme.navColor);
    document.querySelector('.main-nav').style.opacity = '0.85';
    setThemeMode(elThemeBtn);
}


function toggleMenu() {
    document.body.classList.toggle('menu-open');
}