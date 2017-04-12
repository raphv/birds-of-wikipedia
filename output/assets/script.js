"use strict";
var language_menu_items = Array.from(document.querySelectorAll(".language-selector li"));
var language_list = language_menu_items.map(lmi => lmi.getAttribute('lang'));
var nav_lang = navigator.language.substr(0,2);

if (language_list.indexOf(nav_lang) !== -1) {
    document.querySelector('html').setAttribute('lang',nav_lang);
    console.log(`setting language to ${nav_lang}`);
}

language_menu_items.forEach(function(lmi) {
    var lang = lmi.getAttribute('lang');
    lmi.querySelector('a').addEventListener("click",
    function() {
        document.querySelector('html').setAttribute('lang',lang);
        return false;
    }, false);
});

Array.from(document.querySelectorAll("li.bird")).forEach(function(li_bird) {
    li_bird.querySelector('img').addEventListener('click', function() {
        console.log(`playing ${li_bird.querySelector('h3').textContent}`);
        li_bird.querySelector('audio').play();
        return false;
    });
});
