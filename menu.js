// Copyright © 2024 Nate Cramer natecramer@gmail.com

//// menu functionality
var menuDiv = document.querySelector("#menu");

var btn_menu_main = document.querySelector("#menu-button-main");
var menuMainDiv = document.querySelector("#menu");
var menu_fade_overlay;

var isMenu = false;

var menuEntries = {
    yieldSheet: {
        text: "Yield Sheet",
        url: "./index.html",
    },
    tempCalc: {
        text: "Temp Calc",
        url: "./temp.html",
    },
    help: {
        text: "Help",
        url: "./help.html",
    },
    // icingRecipes: {
    //     text: "Ice Recipes",
    //     url: "./temp.html",
    // },
    // about: {
    //     text: "About",
    //     url: "./temp.html",
    // },
}

function constructMenu() {
    if (menuDiv === null) {
        console.log("menuDiv not found, aborting constructMenu()")
        return;
    }
    // create main button
    btn_menu_main = document.createElement("button");
    btn_menu_main.id = "menu-button-main";
    btn_menu_main.addEventListener("click", btnMenuMainClicked, false);
    menuDiv.appendChild(btn_menu_main);

    
    // create fade overlay div
    menu_fade_overlay = document.createElement("div");
    menu_fade_overlay.id = "menu-fade-overlay";
    menu_fade_overlay.addEventListener("click", menuHide, false);
    menuDiv.appendChild(menu_fade_overlay);
    
    // create main menu div
    menuMainDiv = document.createElement("div");
    menuMainDiv.id = "menu-main";
    menuDiv.appendChild(menuMainDiv);

    // create buttons
    for (var key in menuEntries) {
        let entry = menuEntries[key];
        var e = document.createElement("div");
        e.classList.add("menu-button");
        e.innerHTML = entry.text;
        e.addEventListener("click", function () {
            window.location.href = entry.url;
        });
        menuMainDiv.appendChild(e);
    }
}

function onMenuLinkButtonClicked(e) {
    console.log(e);
}

function btnMenuMainClicked(e) {
    if (isMenu) {
        menuHide();
    } else {
        menuShow();
    }
}

function menuShow() {
    isMenu = true;
    menuMainDiv.style.display = "grid";
    // menuDiv.style["grid-template-columns"] = "1";
    menu_fade_overlay.style.display = "flex";
}

function menuHide() {
    isMenu = false;
    menuMainDiv.style.display = "none";
    menu_fade_overlay.style.display = "none";
}

function run() {
    constructMenu();
}

run();