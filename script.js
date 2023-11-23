// glob vars
const sheetDiv = document.querySelector("#main-sheet")

var doughs = [];

var currentDoughIdx = 0;
const maxDough = 3; // note: starts at 1, the index for the doughs array would be this - 1

var data = {};

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

const donut_dough_weights = {
    LongJohns : 2.5,
    Bismarks : 2.5,
    Glazed : 3,
    Twists : 2.5,
    Honeymooners : 2.5,
    Honeybuns : 2.5,
    TigerTails : 2.5,
    Fritters : 2.6,
    Texas : 10
}

function initDoughs() {
    doughs = JSON.parse(localStorage.getItem("doughs"));
    if (doughs != undefined && doughs.length == maxDough)  {
        //console.log("Local storage of doughs WAS found");
        updateSheetDisplay();
        calcAll();
        return;
    }

    //console.log("Local storage of doughs not found, initing");

    makeBlankDoughs();
}
function makeSingleBlankDough(idx) {
    doughs[idx] = {};
    for (property in donuts) {
        doughs[idx][property] = {
            inputStr: "0", 
            donutCount: 0};
    }
}
function makeBlankDoughs() {
    doughs = [];
    for (let i = 0; i < maxDough; i++) {
        makeSingleBlankDough(i);
    }
}

function getDoughValue(doughIdx, donutName, field) {
    if (doughIdx > doughs.length-1 || 
        doughs[doughIdx].hasOwnProperty("donutName") === null ||
        doughs[doughIdx][donutName].hasOwnProperty("field") === null) {
            var tries = 0;
            top:
            while (true) {
                if (tries > 0) {
                    //console.log(`getDoughValue: BIG FAILURE: tried to make blank doughs and still couldnt find thing: ${doughIdx}, ${donutName}, ${field}`);
                    return null;
                }
                //console.log(`getDoughValue: failed to find requested thing: ${doughIdx}, ${donutName}, ${field}`);
                //console.log(`getDoughValue: doughs: ${doughs}`);
                //console.log(`getDoughValue: making blank doughs and trying again`);
                makeBlankDoughs();
                tries += 1;
                continue top;
            }
    }

    // entry was found; return it
    return doughs[doughIdx][donutName][field];
}

function setDoughValue(doughIdx, donutName, field, value) {
    if (doughIdx > doughs.length-1) {
        //console.log(`setDoughValue: tried to write to an index out of bounds, making blank dough: idx: ${doughIdx}`);
        makeSingleBlankDough(doughIdx);
    }
    if (!donutName in doughs[doughIdx]) {
        //console.log(`setDoughValue: tried to write to a donutName that doesn't exist: ${donutName}`);
    }
    if (!field in doughs[doughIdx][donutName]) {
        //console.log(`setDoughValue: tried to write to a field that doesn't exist: ${field}`);
    }

    return doughs[doughIdx][donutName][field] = value;
}

const currentDataVersion = 1;

function makeAndSaveNewData() {
    localStorage.removeItem("doughs");
    localStorage.removeItem("data");
    data = {};
    data.version = 1;
    makeBlankDoughs();
    data.doughs = doughs;
    localStorage.setItem("data", JSON.stringify(data));

}

function loadAndValidateData() {
    var loaded = JSON.parse(localStorage.getItem("data"));
    if (loaded === null ||
        loaded.hasOwnProperty("version") === null ||
        loaded.version != currentDataVersion) {
            //console.log("loadAndValidateData: data not found or version was invalid, calling makeAndSaveNewData()");
            makeAndSaveNewData();
            return;
    }
    data = loaded;
    doughs = loaded.doughs;
    //console.log(`loadAndValidateData: data loaded (version ${data.version})`);
}

function saveData() {
    localStorage.setItem("data", JSON.stringify(data));
    loadAndValidateData();
}

function test_saveDataToFile() {
    const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json' || 'download.json';
    a.click();
    URL.revokeObjectURL(url);
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

function initDoughTotalsElems() {
    let gridDiv = document.querySelector("#totals-grid");
    for (let i = 0; i < maxDough; i++) {
        let leftContDiv = document.createElement("div");
        leftContDiv.setAttribute("class", "total-cont-left");
        leftContDiv.innerHTML = `Dough ${i+1}`;

        let rightContDiv = document.createElement("div");
        rightContDiv.setAttribute("class", "total-cont-right");
        let innerDiv = document.createElement("div");
        innerDiv.setAttribute("id", `total-dough-${i+1}`);
        innerDiv.innerHTML = "0";

        if (i % 2 === 0) {
            rightContDiv.setAttribute("class", "total-cont-right alt");
            leftContDiv.setAttribute("class", "total-cont-left alt");
        }

        leftContDiv.doughNumber = i;
        leftContDiv.addEventListener("click", onDoughButtonClicked);
        rightContDiv.doughNumber = i;
        rightContDiv.addEventListener("click", onDoughButtonClicked);
        innerDiv.doughNumber = i;
        innerDiv.addEventListener("click", onDoughButtonClicked);

        gridDiv.appendChild(leftContDiv);
        rightContDiv.appendChild(innerDiv);
        gridDiv.appendChild(rightContDiv);
    }

    let leftContDiv = document.createElement("div");
    leftContDiv.setAttribute("class", "total-cont-left total-day-cont");
    leftContDiv.innerHTML = `Total for the day:`;

    let rightContDiv = document.createElement("div");
    rightContDiv.setAttribute("class", "total-cont-right total-day-cont");
    let innerDiv = document.createElement("div");
    innerDiv.setAttribute("id", `total-for-the-day`);
    innerDiv.innerHTML = "0";

    gridDiv.appendChild(leftContDiv);
    rightContDiv.appendChild(innerDiv);
    gridDiv.appendChild(rightContDiv);
}

function initDoughScrapElems() {
    document.querySelector("#doughscrap-start-input").addEventListener("change", onInputChange, false);
    document.querySelector("#doughscrap-end-input").addEventListener("change", onInputChange, false);
}

function onInputChange(e) {
    calcAll();
}

// see how many doughs are being done by going thru the elems and seeing if any are set
function getCurrentNumberOfDoughsBeingDone() {
    var result = 0;
    for (let i = 0; i < doughs.length; i++) {
        for (let [key, value] of Object.entries(doughs[i])) {
            if (value.donutCount > 0) {
                result += 1;
                break;
            }
        };
    }
    console.log(doughs);
    return result;
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
            //console.log("nan alert");
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

    // doughs[currentDoughIdx][inputElem.donutName]["donutCount"] = total_donuts;
    // doughs[currentDoughIdx][inputElem.donutName].inputStr = inputElem.value;
    setDoughValue(currentDoughIdx, inputElem.donutName, "donutCount", total_donuts);
    setDoughValue(currentDoughIdx, inputElem.donutName, "inputStr", inputElem.value);

    var num_doughs = getCurrentNumberOfDoughsBeingDone();

    var start_scrap = Number(document.querySelector("#doughscrap-start-input").value);
    var end_scrap = Number(document.querySelector("#doughscrap-end-input").value);

    var donuts_per_lb_max = 6.4;
    var donuts_per_lb_min = 5.92;
    var lb_of_dough = num_doughs * 75;
    lb_of_dough += start_scrap;
    lb_of_dough -= end_scrap;

    var expected_dozens = (lb_of_dough * donuts_per_lb_max) / 12;
    var expected_dozens_min = (lb_of_dough * donuts_per_lb_min) / 12;
    expected_dozens = Math.floor(expected_dozens);
    expected_dozens_min = Math.floor(expected_dozens_min);
    // expected_dozens += Math.round(((start_scrap * 6.4) - (end_scrap * 64)) / 12);

    
    document.querySelector("#expected-dozens").innerHTML = "Expected Dozens: " + String(expected_dozens_min) + " to " + String(expected_dozens);
    if (getTotalForTheDay() / 12 < expected_dozens_min) {
        var lost_sales = (getTotalForTheDay()-expected_dozens_min) * 2.5;
        
        document.querySelector("#expected-dozens").innerHTML += "<br>Lost sales: $" + String(lost_sales);
    } else {
        document.querySelector("#expected-dozens").innerHTML += "<br>You made enough donuts. Good job.";
    }

    // how many donuts should you have got
    var tgt_oz_used = 0;
    for (let i = 0; i < maxDough; i++) {
        for (k in doughs[i]) {
            const count = getDoughValue(i, k, "donutCount");
            if (count != null) {
                tgt_oz_used += donut_dough_weights[k] * count;
            }
        }
    }

    document.querySelector("#expected-dozens").innerHTML += "<br>Target lb used: " + String(tgt_oz_used / 16);
    document.querySelector("#expected-dozens").innerHTML += "<br>Actual lb used: " + String(lb_of_dough);

    var doz_diff = ((lb_of_dough - (tgt_oz_used / 16)) * 5.92) / 12;
    document.querySelector("#expected-dozens").innerHTML += "<br>Doz diff: " + String(0-doz_diff);
    document.querySelector("#expected-dozens").innerHTML += "<br>Sales diff: $" + String(0-(doz_diff*30));
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

function getTotalForTheDay() {
    var totalForTheDay = 0;
    for (let i = 0; i < maxDough; i++) {
        for (k in doughs[i]) {
            const count = getDoughValue(i, k, "donutCount");
            if (count != null) {
                totalForTheDay += count;
            }
        }
    }
    return totalForTheDay;
}

function calcAll() {
    calcAllRows();
    
    for (let i = 0; i < maxDough; i++) {
        var total = 0;
        for (k in doughs[i]) {
            const count = getDoughValue(i, k, "donutCount");
            if (count != null) {
                total += count;
            }
        }
        const div = document.querySelector(`#total-dough-${i+1}`);
        div.innerHTML = `${Math.floor(total / 12)}`;
        if (total % 12 > 0) {
            div.innerHTML += ` + ${total % 12}`
        }
    }

    var totalForTheDay = getTotalForTheDay();
    document.querySelector("#total-for-the-day").innerHTML = `${Math.floor(totalForTheDay / 12)}`;
    if (totalForTheDay % 12 > 0) {
        document.querySelector("#total-for-the-day").innerHTML += ` + ${totalForTheDay % 12}`;
    }

    saveData();
    // //console.log(JSON.stringify(doughs));
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

    let totalLeftConts = document.querySelectorAll(".total-cont-left");
    let totalRightConts = document.querySelectorAll(".total-cont-right");
    totalLeftConts.forEach((e) => {
        e.classList.remove("doughcurrent")
    });
    totalRightConts.forEach((e) => {
        e.classList.remove("doughcurrent")
    });

    totalLeftConts[idx].classList.add("doughcurrent");
    totalRightConts[idx].classList.add("doughcurrent");

    updateSheetDisplay();
    calcAll();
}

function clearAll() {
    makeBlankDoughs();
    localStorage.removeItem("data");
    loadAndValidateData();
    setDough(0);
    updateSheetDisplay();
    calcAll();
}

function run() {
    // data
    loadAndValidateData();
    initDoughTotalsElems();
    // initDoughs();
    initElems();
    initDoughScrapElems();

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
    initSubmitStuff();
}

run();