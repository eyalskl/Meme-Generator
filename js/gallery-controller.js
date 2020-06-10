'use strict';

function renderGallery() {
    const imgs = getImgs();
    let strHTML = imgs.map(img => {
        return `<img id=${img.id} src="${img.url}" onclick="onSetMeme(this.id)" />`
    }).join('')
    document.querySelector('.meme-gallery').innerHTML = strHTML;
}

