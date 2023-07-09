// glob vars
const sheetDiv = document.querySelector("#main-sheet")

var currentDoughIdx = 0;
const maxDough = 3; // note: starts at 1, the index for the doughs array would be this - 1

const donuts = {
    LongJohns : {
        xname: "Long Johns",
        per_screen: 24,
        dozens: 2,
        plus: 0,
        screen_hint: "8x3",
    },
    Bismarks : {
        xname: "Bismarks",
        per_screen: 24,
        dozens: 2,
        plus: 0,
        screen_hint: "4x5 + 4",
    },
    Glazed : {
        xname: "Glazed",
        per_screen: 24,
        dozens: 2,
        plus: 0,
        screen_hint: "4x5 + 4",
    },
    Twists : {
        xname: "Twists",
        per_screen: 21,
        dozens: 1,
        plus: 9,
        screen_hint: "7x3",
    },
    Honeymooners : {
        xname: "Honeymooners",
        per_screen: 20,
        dozens: 1,
        plus: 8,
        screen_hint: "4x5",
    },
    Honeybuns : {
        xname: "Honeybuns",
        per_screen: 16,
        dozens: 1,
        plus: 4,
        screen_hint: "4x4",
    },
    TigerTails : {
        xname: "Tiger Tails",
        per_screen: 24,
        dozens: 2,
        plus: 0,
        screen_hint: "8x3",
    },
    Fritters : {
        xname: "Fritters",
        per_screen: 16,
        dozens: 1,
        plus: 4,
        screen_hint: "4x4",
    },
    Texas : {} // skipped during loops, do it manually. Just put the entry here so it shows up as a donut name
};

var doughs = [];
function initDoughs() {
    doughs = JSON.parse(localStorage.getItem("doughs"));
    if (doughs != undefined)  {
        console.log("Local storage of doughs WAS found");
        updateSheetDisplay();
        calcAll();
        return;
    }

    console.log("Local storage of doughs not found, initing");

    makeBlankDoughs();
}
function makeBlankDoughs() {
    doughs = [];
    for (let i = 0; i < 3; i++) {
        doughs[i] = {};
        for (property in donuts) {
            doughs[i][property] = {
                inputStr: "0", 
                donutCount: 0};
        }
    }
}

var elems = {};
function initElems() {
    for (property in donuts) {
        elems[property] = {};
    }
}

function initDoughButtons() {
    var div = document.querySelector("#doughbuttons");
    for (let i = 0; i < maxDough; i++) {
        var doughButton = document.createElement("button");
        // doughButton.onclick = `setDough(${i})`;
        doughButton.addEventListener("click", onDoughButtonClicked);
        doughButton.doughNumber = i;
        doughButton.innerHTML = `Dough ${i + 1}`;
        doughButton.setAttribute("class", "doughbutton");
        if (i === 0) {
            doughButton.classList.add("doughcurrent");
        }
        div.appendChild(doughButton);
    }
}

function onInputChange(e) {
    calcAll();
}

function xupdate(inputElem) {

    str = new String(inputElem.value);
    screens = "0";
    plus = "0";
    total_donuts = 0;
    
    // texas
    if (inputElem.donutName === "Texas") {
        val = parseInt(inputElem.value);
        if (isNaN(val)) {
            val = 0; 
        }
        total_donuts = val * 4;
        inputElem.resultDiv.innerHTML = `${total_donuts}`;
        inputElem.value = `${val}`;
    // all other donuts
    } else if (str.includes("+")) {
        screens = parseInt(str.substring(0, str.indexOf("+")));
        if (isNaN(screens)) {
            total_donuts = 0;
            inputElem.value = "0";
        } else {
            plus = parseInt(str.substring(str.indexOf("+")));
            if (isNaN(plus)) {
                plus = 0;
                total_donuts = (screens * inputElem.donut.per_screen);
                inputElem.value = `${screens}`;
            } else {
                total_donuts = (screens * inputElem.donut.per_screen) + plus;
                // reformat string to correct garbage text
                inputElem.value = `${screens}+${plus}`;
            }
        }
    } else if (str.includes("-")) {
        screens = parseInt(str.substring(0, str.indexOf("-")));
        if (isNaN(screens)) {
            total_donuts = 0;
            inputElem.value = "0";
        } else {
            minus = parseInt(str.substring(str.indexOf("-")+1));
            if (isNaN(minus)) {
                minus = 0;
                total_donuts = (screens * inputElem.donut.per_screen);
                inputElem.value = `${screens}`;
            } else {
                total_donuts = (screens * inputElem.donut.per_screen) - minus;
                // reformat string to correct garbage text
                inputElem.value = `${screens}-${minus}`;
            }
        }
    } else {
        screens = parseInt(str);
        if (isNaN(screens)) {
            screens = 0;
            total_donuts = 0;
            console.log("nan alert");
        }
        total_donuts = screens * inputElem.donut.per_screen;
        // reformat string to correct garbage text
        inputElem.value = `${screens}`;
    }

    result_screens = Math.floor(total_donuts / 12);
    result_plus = total_donuts % 12;

    if (result_plus === 0) {
        inputElem.resultDiv.innerHTML = `${result_screens}`;
    } else {
        inputElem.resultDiv.innerHTML = `${result_screens} + ${result_plus}`;
    }

    doughs[currentDoughIdx][inputElem.donutName]["donutCount"] = total_donuts;
    doughs[currentDoughIdx][inputElem.donutName].inputStr = inputElem.value;
}

function makeSheetHtml() {
    for (const property in donuts) {
        if (property === "Texas") {
            continue;
        }

        const o = donuts[property]
        newDiv = document.createElement("div");
        newDiv.innerHTML = o.xname;
        sheetDiv.appendChild(newDiv)

        // result is made first
        resultDiv = document.createElement("div");
        resultDiv.innerHTML = "0";
        resultDiv.setAttribute("id", `result-${property}`);

        newDiv = document.createElement("div");

        input = document.createElement("input");
        input.value = 0;
        input.type = "text";
        input.resultDiv = resultDiv;
        input.donut = o;
        input.per_screen = o.per_screen;
        input.donutName = property;
        input.addEventListener("change", onInputChange, false);
        input.setAttribute("id", `input-${property}`);
        input.setAttribute("size","8");
        input.setAttribute("class","screen-input");

        newDiv.appendChild(input);
        
        sheetDiv.appendChild(newDiv)
        sheetDiv.appendChild(resultDiv)

        elems[property]["inputElem"] = input;
        elems[property]["resultElem"] = resultDiv;
    }
}

function makeTexasRowHtml() {
    // make texas
    for (let i = 0; i < 3; i++) {
        newDiv = document.createElement("div");
        newDiv.setAttribute("class", "sheet-header");
        if (i === 1) {
            newDiv.innerHTML = "# OF TEXAS";
        } else {
            newDiv.innerHTML = "";
        }
        sheetDiv.appendChild(newDiv);
    }

    newDiv = document.createElement("div");
    newDiv.innerHTML = "Texas";
    sheetDiv.appendChild(newDiv);
    
    // make result first so the reference can be added to input
    resultDiv = document.createElement("div");
    resultDiv.innerHTML = "0";
    resultDiv.setAttribute("id", `result-Texas`);
    
    newDiv = document.createElement("div"); // input div

    input = document.createElement("input");
    input.value = 0;
    input.type = "text";
    input.resultDiv = resultDiv;
    // input.donut = o;
    // input.per_screen = o.per_screen;
    input.donutName = "Texas";
    input.addEventListener("change", onInputChange, false);
    input.setAttribute("id", `input-Texas`);
    input.setAttribute("size","8");
    input.setAttribute("class","screen-input");

    newDiv.appendChild(input);

    sheetDiv.appendChild(newDiv);
    sheetDiv.appendChild(resultDiv);

    elems["Texas"]["inputElem"] = input;
    elems["Texas"]["resultElem"] = resultDiv;
}

function makeTexasRowHtmlOld() {
    // make texas
    newDiv = document.createElement("div");
    newDiv.innerHTML = "Texas";
    sheetDiv.appendChild(newDiv)
    
    newDiv = document.createElement("div");
    newDiv.innerHTML = "1 to 4";
    sheetDiv.appendChild(newDiv)
    
    newDiv = document.createElement("div");
    newDiv.innerHTML = "(1 Texas = 4 donuts)";
    sheetDiv.appendChild(newDiv)
    
    // make result first so the reference can be added to input
    resultDiv = document.createElement("div");
    resultDiv.innerHTML = "0";
    resultDiv.setAttribute("id", `result-Texas`);
    
    newDiv = document.createElement("div"); // input div

    input = document.createElement("input");
    input.value = 0;
    input.type = "text";
    input.resultDiv = resultDiv;
    // input.donut = o;
    // input.per_screen = o.per_screen;
    input.donutName = "Texas";
    input.addEventListener("change", onInputChange, false);
    input.setAttribute("id", `input-Texas`);
    input.setAttribute("size","8");
    input.setAttribute("class","screen-input");

    newDiv.appendChild(input);

    sheetDiv.appendChild(newDiv);
    sheetDiv.appendChild(resultDiv);

    elems["Texas"]["inputElem"] = input;
    elems["Texas"]["resultElem"] = resultDiv;
}

function calcAllRows() {
    for (key in elems) {
        //  doughs[currentDoughIdx][donutName]
        xupdate(elems[key].inputElem); 
    }
}

function calcAll() {
    calcAllRows();
    var total = 0;
    for (k in doughs[currentDoughIdx]) {
        total += doughs[currentDoughIdx][k]["donutCount"];
    }
    document.querySelector("#total").innerHTML = `${Math.floor(total / 12)}`;
    if (total % 12 > 0) {
        document.querySelector("#total").innerHTML += ` + ${total % 12}`
    }

    var totalForTheDay = 0;
    for (let i = 0; i < maxDough; i++) {
        for (k in doughs[i]) {
            totalForTheDay += doughs[i][k].donutCount;
        }
    }
    document.querySelector("#total-for-the-day").innerHTML = `${Math.floor(totalForTheDay / 12)}`;
    if (totalForTheDay % 12 > 0) {
        document.querySelector("#total-for-the-day").innerHTML += ` + ${totalForTheDay % 12}`;
    }

    localStorage.setItem("doughs", JSON.stringify(doughs));
    // console.log(JSON.stringify(doughs));
    updateSheetDisplay();
}

function updateSheetDisplay() {
    for (key in elems) {
        elems[key].inputElem.value = doughs[currentDoughIdx][key].inputStr;
    }
}

function onDoughButtonClicked() {
    currentDoughIdx = this.doughNumber;
    setDough(currentDoughIdx);

    // document.querySelectorAll(".doughbutton").forEach((e) => {
    //     e.classList.remove("doughcurrent");
    // });
    // this.classList.add("doughcurrent");
}

function setDough(idx) {
    currentDoughIdx = idx;
    localStorage.setItem("currentDough", currentDoughIdx);

    let buttons = document.querySelectorAll(".doughbutton");
    // for (let i = 0; i < buttons.length; i++)
    buttons.forEach((e) => {
        e.classList.remove("doughcurrent");
    });
    buttons[idx].classList.add("doughcurrent");

    updateSheetDisplay();
    calcAll();
}

function clearAll() {
    makeBlankDoughs();
    setDough(0);
    updateSheetDisplay();
    calcAll();
}

function run() {
    // data
    initDoughs();
    initElems();

    // html
    initDoughButtons();
    makeSheetHtml();
    makeTexasRowHtml();
    currentDoughIdx = localStorage.getItem('currentDough');
    if (currentDoughIdx === null) {
        currentDoughIdx = 0;
    }
    setDough(currentDoughIdx);
    // updateSheetDisplay();
    // calcAll();
}

run();