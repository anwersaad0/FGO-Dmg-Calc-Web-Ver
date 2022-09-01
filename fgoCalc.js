//establish constants and variables
const NP_SCALE = 0.23;

const BUSTER_MOD = 1.5;
const ARTS_MOD = 1;
const QUICK_MOD = 0.8;

const STRONG_MOD = 2;
const ZERK_EGO_MOD = 1.5;
const WEAK_MOD = 0.5;

const MAN_EARTH_SKY_STRONG_MOD = 1.1;
const MAN_EARTH_SKY_WEAK_MOD = 0.9;

const cardTypes = ["Buster", "Arts", "Quick"];

const servants = [];

var dmg = 0;
var atk, flat, atkPerc, cardMod, cardPerc, cardRes,
npMult, npPerc, defPerc, effMod, traitPerc, npTraitPerc, manEarthSkyMod;

//establish html imports
const servantSelector = document.getElementById('servants');
const classSelector = document.getElementById('servantClass');
const cardTypeSelector = document.getElementById('cardtype');
const npLevelSelector = document.getElementById('npLevel');
const effSelector = document.getElementById('effective');
const manEarthSkySelector = document.getElementById('manEarthSky');

const atkEntry = document.getElementById("atkEntry");
const npMultEntry = document.getElementById("npMultEntry");
const atkPercEntry = document.getElementById("atkPercEntry");
const npPercEntry = document.getElementById("npPercEntry");
const defEntry = document.getElementById("defEntry");
const cardPercEntry = document.getElementById("cardPercEntry");
const traitEntry = document.getElementById("traitEntry");
const cardResEntry = document.getElementById("cardResEntry");
const flatEntry = document.getElementById("flatEntry");
const npTraitEntry = document.getElementById("npTraitEntry");

const entryList = [atkEntry, npMultEntry, atkPercEntry, npPercEntry, defEntry,
cardPercEntry, traitEntry, cardResEntry, flatEntry, npTraitEntry];
for (var i = 0; i < entryList.length; i++) {
    entryList[i].value = 0;
}

const resetBtn = document.getElementById('reset');
const calcBtn = document.getElementById('calculate');
const overallDmgEntry = document.getElementById("overallDmg");
overallDmgEntry.value = 0;

//end of establishing html imports

//establish servant class
function Servant(sName, sClass, card, atk, np1, target) {
    this.sName = sName;
    this.sClass = sClass;
    this.card = card;
    this.atk = atk;
    this.np1 = np1;
    this.target = target;
}

//establish functions
function getValues() {
    atk = atkEntry.value;
    npMult = npMultEntry.value / 100;
    atkPerc =  1 + (atkPercEntry.value / 100);
    npPerc = 1 + (npPercEntry.value / 100);
    defPerc = 1 + (defEntry.value / 100);
    cardPerc = 1 + (cardPercEntry.value / 100);
    traitPerc = 1 + (traitEntry.value / 100);
    cardRes = 1 + (cardResEntry.value / 100);
    flat = flatEntry.value;
    npTraitPerc = 1 + (npTraitEntry.value / 100);
}

function resetEntries() {
    for (var i = 0; i < entryList.length; i++) {
        entryList[i].value = "0";
    }

    overallDmgEntry.value = 0;

    servantSelector.selectedIndex = 0;
    cardTypeSelector.selectedIndex = 0;
    effSelector.selectedIndex = 0;
    manEarthSkySelector.selectedIndex = 0;
}

function calculate() {
    getValues()

    dmg = Math.trunc(atk * npMult * (cardMod * cardPerc) * cardRes * atkPerc * NP_SCALE 
    * defPerc * traitPerc * npTraitPerc * npPerc * effMod * manEarthSkyMod);
    dmg += parseInt(flat);

    console.log(dmg);
    overallDmgEntry.value = dmg;
}

function changeCard() {
    if (cardTypeSelector.value == "Buster") {
        cardMod = BUSTER_MOD;
    } else if (cardTypeSelector.value == "Quick") {
        cardMod = QUICK_MOD;
    } else {
        cardMod = ARTS_MOD;
    }

    console.log(cardTypeSelector.value);
    console.log(cardMod);
}

cardTypeSelector.addEventListener('change', changeCard);

/*
function changeNpLevel() {
    for (let i = 0; i < servants.length; i++) {
        if 
    }
} */

function changeEff() {
    if (effSelector.value == "Effective") {
        effMod = STRONG_MOD;
    } else if (effSelector.value == "Zerk/Ego/Pre") {
        effMod = ZERK_EGO_MOD;
    } else if (effSelector.value == "Weak") {
        effMod = WEAK_MOD
    } else {
        effMod = 1;
    }

    console.log(effSelector.value);
    console.log(effMod);
}

effSelector.addEventListener('change', changeEff);

function changeManEarthSky() {
    if (manEarthSkySelector.value == "Effective") {
        manEarthSkyMod = MAN_EARTH_SKY_STRONG_MOD;
    } else if (manEarthSkySelector.value == "Not Effective") {
        manEarthSkyMod = MAN_EARTH_SKY_WEAK_MOD;
    } else {
        manEarthSkyMod = 1;
    }

    console.log(manEarthSkySelector.value);
    console.log(manEarthSkyMod);
}

function addAllServants() {
    servantSelector.length = 1;

    for (let i = 0; i < servants.length; i++) {
        var option = document.createElement('option');
        option.text = servants[i].sName;
        servantSelector.add(option, i + 1);
    }
}

function addSpecificServants(className) {
    servantSelector.length = 1;

    for (let i = 0; i < servants.length; i++) { 
        
        if (servants[i].sClass == className) {   
            var option = document.createElement('option'); 
            option.text = servants[i].sName;
            servantSelector.add(option, i + 1);
        }
    }

}

manEarthSkySelector.addEventListener('change', changeManEarthSky);

getServantData();

async function getServantData() {
    const response = await fetch('servantdata.csv');
    const data = await response.text();

    const table = data.split('\n').slice(1);
    table.forEach(row => {
        const comp = row.split(',');

        servants.push(new Servant(comp[0], comp[1].trimStart(), comp[2], comp[3], comp[4], comp[5].trimStart()));

    });
    
}

classSelector.addEventListener('change', function(e) {

    if (classSelector.value == "All Classes") {
        addAllServants();
    } else {
        addSpecificServants(classSelector.value);
    }

});

servantSelector.addEventListener('change', function(e) {
    for (let i = 0; i < servants.length; i++) {
        if (servantSelector.value == servants[i].sName) {
            cardTypeSelector.selectedIndex = parseInt(servants[i].card);
            changeCard();

            effSelector.selectedIndex = 1;
            changeEff();

            manEarthSkySelector.selectedIndex = 1;
            changeManEarthSky();

            atkEntry.value = parseInt(servants[i].atk);
            npMultEntry.value = parseInt(servants[i].np1);
        }
    }
});

resetBtn.addEventListener('click', resetEntries);
calcBtn.addEventListener('click', calculate);
//