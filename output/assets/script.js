"use strict";

function stopPlayingAll() {
    Array.from(
        document.querySelectorAll("audio")
    ).forEach(function(audio) {
        audio.pause();
    });
}

var language_menu_items = Array.from(document.querySelectorAll(".language-selector li"));
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
        evt.preventDefault();
    }, false);
});

Array.from(
    document.querySelectorAll("li.bird")
).forEach(function(li_bird) {
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
