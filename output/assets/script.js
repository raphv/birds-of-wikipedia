"use strict";

function repositionBar() {
    var barHeight = header.getBoundingClientRect().height;
    document.getElementById('birds').style.marginTop = barHeight + 'px';
}

function stopPlayingAll() {
    Array.from(
        document.querySelectorAll("audio")
    ).forEach(function(audio) {
        audio.pause();
    });
}

function showAllBirds(hide) {
    birds.forEach(function(bird) {
        bird.style.display = hide ? 'none' : 'block';
    });
}

function search() {
    var current_language = document.querySelector('html').getAttribute('lang');
    var searchstr = searchbox.value.toLocaleLowerCase();
    if (searchstr.length > 1) {
        birds.forEach(function(bird) {
            bird.style.display = 'none';
            Array.from(
                bird.querySelectorAll(`.language-alias[lang="${current_language}"]>span, h3 span`)
            ).forEach(function(span) {
                if (!span) {
                    return;
                }
                var txt = span.textContent.toLocaleLowerCase();
                var pos = txt.search(searchstr);
                if (pos !== -1) {
                    var originalContent = span.textContent;
                    var newspan = document.createElement('span');
                    var before = document.createElement('span');
                    var highlight = document.createElement('span');
                    var after = document.createElement('span');
                    before.textContent = originalContent.substr(0, pos);
                    highlight.textContent = originalContent.substr(pos, searchstr.length);
                    highlight.className = 'highlight';
                    after.textContent = originalContent.substr(pos + searchstr.length);
                    newspan.appendChild(before);
                    newspan.appendChild(highlight);
                    newspan.appendChild(after);
                    span.innerHTML = newspan.innerHTML;
                    bird.style.display = 'block';
                }
            });
        });
    } else {
        showAllBirds();
        Array.from(document.querySelectorAll('span.highlight')).forEach(function(span) {
            span.parentElement.textContent = span.parentElement.textContent;
        });
    }
}

function clickToggle(sourceid, targetid, showfn, hidefn) {
    var sourceel = document.getElementById(sourceid);
    sourceel.addEventListener('click', function(evt) {
        var targetel = document.getElementById(targetid);
        if (targetel.style.display === 'block') {
            targetel.style.display = 'none';
            sourceel.classList.remove('active');
            if (hidefn) {
                hidefn();
            }
        } else {
            targetel.style.display = 'block';
            sourceel.classList.add('active');
            if (showfn) {
                showfn();
            }
        }
        repositionBar();
        evt.preventDefault();
    }, false);
}

var header = document.querySelector('header');
var language_menu_items = Array.from(document.querySelectorAll("#language-selector li"));
var language_list = language_menu_items.map(lmi => lmi.getAttribute('lang'));
var nav_lang = navigator.language.substr(0,2);

if (language_list.indexOf(nav_lang) !== -1) {
    document.querySelector('html').setAttribute('lang',nav_lang);
}

language_menu_items.forEach(function(lmi) {
    var lang = lmi.getAttribute('lang');
    lmi.querySelector('a').addEventListener("click",
    function(evt) {
        document.querySelector('html').setAttribute('lang',lang);
        search();
        repositionBar();
        evt.preventDefault();
    }, false);
});

var birds = Array.from(
    document.querySelectorAll("li.bird")
);

birds.forEach(function(li_bird) {
    var audio = li_bird.querySelector('audio');
    li_bird.querySelector('a.image-container').addEventListener(
        'click', function(evt) {
        if (audio.paused) {
            stopPlayingAll();
            audio.play();
        } else {
            audio.pause();
        }
        evt.preventDefault();
    });
    audio.addEventListener('play', function() {
        li_bird.classList.add('playing');
        li_bird.parentElement.classList.add('playing');
    }, false);
    audio.addEventListener('pause', function() {
        li_bird.classList.remove('playing');
        li_bird.parentElement.classList.remove('playing');  
    }, false);
});

var searchbox = document.querySelector('input[name="searchbox"]');

searchbox.addEventListener('input', search);

clickToggle(
    'search-button',
    'search-bar',
    function() {
        searchbox.focus();
    },
    function() {
        searchbox.value = '';
        search();
    });
clickToggle('language-button', 'language-selector');

var randomButton = document.getElementById('random-button');

randomButton.addEventListener('click', function(evt) {
    searchbox.value = '';
    search();
    var randbird = birds[Math.floor(birds.length * Math.random())];
    window.scrollTo(0,
        window.scrollY + randbird.getBoundingClientRect().top - 20 - header.getBoundingClientRect().height
    );
    stopPlayingAll();
    randbird.querySelector('audio').play();
    evt.preventDefault();
}, false);

Array.from(
    document.querySelectorAll('.emoji-search-item a')
).forEach(function(button) {
    button.addEventListener('click', function(evt) {
        searchbox.value = button.textContent;
        search();
        evt.preventDefault();
    }, false);
});

repositionBar();
window.addEventListener('resize', repositionBar, false);

document.addEventListener('contextmenu', evt => evt.preventDefault(), false);
/* THIS IS NOT WHAT YOU THINK, I'M JUST MAKING SURE MY TODDLER DOESN'T DO WEIRD STUFF WHEN TAPPING ON THE SITE */