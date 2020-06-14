var gTrans = {
    logo: {
        en: `Meme<span>_</span>Gen<span>.</span>`,
        he: `מחולל<span>_</span>הממים<span>.</span>`
    },
    'gallery-link': {
        en: 'Gallery',
        he: 'גלריה'
    },
    'memes-link': {
        en: 'Memes',
        he: 'ממים'
    },
    'about-link': {
        en: 'About',
        he: 'אודות'
    },
    'themes-link': {
        en: 'Themes',
        he: 'נושאים'
    },
    'search': {
        en: 'Search by keyword',
        he: 'חפש לפי נושא'
    },    
    'upload': {
        en: '<i class="fas fa-upload"></i> Upload Image',
        he: '<i class="fas fa-upload"></i> העלאת תמונה'
    },
    'footer-name': {
        en: `<i class="fas fa-copyright"></i> Eyal<span>_</span>Barkai<span>.</span>`,
        he: `<i class="fas fa-copyright"></i> אייל<span>_</span>ברקאי<span>.</span>`
    },
    'footer-date': {
        en: 'June 2020',
        he: 'יוני 2020'
    },
    'saved-memes': {
        en: `My saved<span>_</span>Memes<span>.</span>`,
        he: `הממים<span>_</span>שלי<span>.</span>`
    },
    'theme-default': {
        en: `Default`,
        he: `ברירת מחדל`
    },
    'theme-default': {
        en: `Default`,
        he: `ברירת מחדל`
    },
    'theme-cats': {
        en: `Cats`,
        he: `חתולים`
    },
    'theme-dogs': {
        en: `Dogs`,
        he: `כלבים`
    },
    'theme-politic': {
        en: `Politic`,
        he: `פוליטי`
    },
    'theme-anime': {
        en: `Anime`,
        he: `אנימה`
    },
    'theme-kid': {
        en: `Kid`,
        he: `ילד`
    },
    'kw-all': {
        en: 'all',
        he: 'הכל'
    },
    'kw-popular': {
        en: 'popular',
        he: 'פופולרי'
    },
    'kw-men': {
        en: 'men',
        he: 'גבר'
    },
    'kw-love': {
        en: 'love',
        he: 'אהבה'
    },
    'kw-puppy': {
        en: 'puppy',
        he: 'כלבלב'
    },
    'kw-dog': {
        en: 'dog',
        he: 'כלב'
    },
    'kw-animal': {
        en: 'animal',
        he: 'חיות'
    },
    'kw-cute': {
        en: 'cute',
        he: 'חמוד'
    },
    'kw-baby': {
        en: 'baby',
        he: 'תינוק'
    },
    'kw-sleep': {
        en: 'sleep',
        he: 'שינה'
    },
    'kw-cat': {
        en: 'cat',
        he: 'חתול'
    },
    'kw-success': {
        en: 'success',
        he: 'הצלחה'
    },
    'kw-wonder': {
        en: 'wonder',
        he: 'תוהה'
    },
    'kw-surprised': {
        en: 'surprised',
        he: 'מופתע'
    },
    'kw-smile': {
        en: 'smile',
        he: 'חיוך'
    },
    'kw-laugh': {
        en: 'laugh',
        he: 'צחוק'
    },
    'kw-obama': {
        en: 'obama',
        he: 'אובמה'
    },
    'kw-kiss': {
        en: 'kiss',
        he: 'נשיקה'
    },
    'kw-point': {
        en: 'point',
        he: 'מצביע'
    },
    'kw-cheers': {
        en: 'cheers',
        he: 'לחיים'
    },
    'kw-dicaprio': {
        en: 'dicaprio',
        he: 'דיקפריו'
    },
    'kw-amazed': {
        en: 'amazed',
        he: 'נדהם'
    },
    'kw-matrix': {
        en: 'matrix',
        he: 'מטריקס'
    },
    'kw-awkward': {
        en: 'awkward',
        he: 'מביך'
    },
    'kw-lol': {
        en: 'lol',
        he: 'צחוקים'
    },
    'kw-bald': {
        en: 'bald',
        he: 'קירח'
    },
    'kw-russia': {
        en: 'matrix',
        he: 'רוסיה'
    },
    'desktop-info': {
        en: 'On Desktop :',
        he: 'במחשב :'
    },
    'esc-info': {
        en: `'Escape' - return to Gallery`,
        he: `'אסקייפ' - חזור לגלריה`
    },
    'tab-info': {
        en: `'Tab' - to Switch Lines`,
        he: `'טאב' - החלף שורה`
    },
    'arrows-info': {
        en: `'Up/Down Arrows' - to change Line Height`,
        he: `'חץ למעלה/למטה' - לשינוי גובה שורה`
    },
    'line-info': {
        en: `'Insert'/'Delete' - to Add/Remove Line`,
        he: `'אינסרט'/'דיליט' - להוספת או מחיקת שורה`
    }
}

var gCurrLang = 'en';

function getTrans(transKey) {
    if (!gTrans[transKey]) return 'UNKNOWN'
    var transMap = gTrans[transKey];
    var trans = transMap[gCurrLang];
    if (!trans) trans = transMap['en']
    return trans;
}

function doTrans() {
    var els = document.querySelectorAll('[data-trans]');
    for (var i=0; i < els.length; i++){
        var el = els[i]
        var transKey = el.dataset.trans;
        var trans = getTrans(transKey);

        if (el.nodeName === 'INPUT') el.placeholder = trans;
        else el.innerHTML = trans;
    }
}

function setLang(lang) {
    gCurrLang = lang;
    renderKeywords();
    if (lang === 'he') document.body.classList.add('rtl');
    else document.body.classList.remove('rtl');
    doTrans()
}

function getCurrLang() {
    return gCurrLang;
}
