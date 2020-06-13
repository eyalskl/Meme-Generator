'use strict';

function renderGallery() {
    const imgs = getImgs();
    var strHTML;
    if (!imgs || imgs.length === 0) strHTML = 'No images to display!'
    else {
        strHTML = imgs.map(img => {
            return `<img id=${img.id} src="${img.url}" onclick="onSetMeme(this.id)" />`
        }).join('')
    }
    document.querySelector('.gallery').innerHTML = strHTML;
}

function renderKeywords() {
    const keywords = getKeywords();
    var strHTML = `<a id="all" href="#" onclick="onSetFilterBy(this.id)" data-trans="kw-all">all</a>`;
    var countMax = getKeywordsToShow();
    var count = 1;
    for (let key in keywords) {
        var size = (keywords[key] > 0) ? (keywords[key] / 10) + 0.9 + 'rem' : '0.8rem';
        if (count >= countMax) strHTML += '';
        else strHTML += `<a id="${key}" href="#" onclick="onSetFilterBy(this.id)" data-trans="kw-${key}" style="font-size:${size}">${key}</a> `
        count++;
    }
    strHTML += `<a class="show-more" href="#" onclick="onShowKeywords()" data-trans="kw-show">show more...</a> `
    document.querySelector('.growing-keywords').innerHTML = strHTML;
    setKeywordsListeners();
}

function onShowKeywords() {
    const elShowLink = document.querySelector('.show-more');
    if (elShowLink.innerText.toLowerCase() === 'show more...' || elShowLink.innerText === 'הצג עוד...') {
        showKeywords(getKeywordsCount());
        renderKeywords();
        if (getCurrLang() === 'en') document.querySelector('.show-more').innerText = 'show less...'
        else document.querySelector('.show-more').innerText = 'הצג פחות...'
    } else {
        showKeywords(5);
        renderKeywords();
        if (getCurrLang() === 'en') document.querySelector('.show-more').innerText = 'show more...'
        else document.querySelector('.show-more').innerText = 'הצג עוד...'
    }
    // setLang('he')
}

function setKeywordsListeners() {
    const elKeywords = document.querySelectorAll('.growing-keywords a');
    for (let i = 1; i < elKeywords.length - 1; i++) {
        elKeywords[i].addEventListener('click', () => {
            raiseKeywordsCount(elKeywords[i].id);
            var size = (getKeywords()[elKeywords[i].id] / 10) + 0.9 + 'rem' ;
            if (parseInt(size) > 1.8) return;
            elKeywords[i].style.fontSize = size;
        });
    }
}