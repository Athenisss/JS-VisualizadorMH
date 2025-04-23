startup()

let list;

$("#textSearch").on('keyup', function () {
    let value = $(this).val()
    console.log(value)

    makeCornerlist(list)
    var data = searchTable(value, $(".longlist"))
    
    if (data.length==0){
        data = searchTable(value, list)
    }
    makeCornerlist(data)

})

async function searchAllWeapons() {
    let url = 'https://mhw-db.com/weapons'
    let opcoes = {
        method: "GET"
    }

    let promisseFetch = fetch(url, opcoes);
    let resposta = await promisseFetch;
    let promisseJson = await resposta.json();

    return promisseJson
}

function searchWeapon(list, id) {
    let w;
    for (i in list) {
        if (list[i].id == id) {
            w = list[i];
            return w
        }
        if (list[i].name == id) {
            w = list[i];
            return w
        }
    }
    return console.log("Não encontrado!")
}

function placeWeapon(w) {
    let upgradeLine = [];
    let elementType;
    let elementDMG;

    function checkImage(w) {
        let assets = []
        let url = "https://static.wikia.nocookie.net/monsterhunter/images/d/d7/1stGen-Question_Mark_Icon.svg";
        if (w.assets == null) {
            assets=[url,url]
            return assets
        } else {
            if (w.assets.icon == null){
                assets=[w.assets.image, url]
                return assets
            }
            assets=[w.assets.image, w.assets.icon]
            return assets
        }
    }
    function checkElement(w) {
        if (w.elements.length >= 1) {
            elementType = w.elements[0].type;
            elementDMG = w.elements[0].damage;
        } else {
            elementType = "Nenhum"
            elementDMG = "Nenhum"
        }
        return elementType, elementDMG
    }

    function checkUpgradeLine(w, upgradeLine) {
        if (w.crafting.previous != null) {
            upgradeLine[0] = `<a>${searchWeapon(list, w.crafting.previous).name}</a>`;
        } else {
            upgradeLine[0] = "Nenhum";
        }
        if (w.crafting.branches.length >= 1) {
            for (let i = 0; i < w.crafting.branches.length; i++) {
                upgradeLine[i + 1] = w.crafting.branches[i];
            }
        } else {
            upgradeLine[1] = "Nenhum"
        }
    }


    checkElement(w)
    checkUpgradeLine(w, upgradeLine)
    createTable(
        checkImage(w),
        w.name,
        w.type,
        w.attack.display,
        w.attack.raw,
        elementType,
        elementDMG,
        upgradeLine
    )
}

async function createTable(wImage, name, type, dmgDisplay, dmgRaw, elementType, elementDMG, upgradeLine) {
    function run(upgradeLine) {
        let allUpgrades = "";
        if (upgradeLine[1] != "Nenhum") {
            for (let i = 1; i < upgradeLine.length; i++) {
                allUpgrades += `<tr><td colspan="2" onClick="secondaryCall(this)"><a>${searchWeapon(list, upgradeLine[i]).name}</a></td></tr>`
            }
            return allUpgrades
        } else {
            return `<tr><td colspan="2">${upgradeLine[1]}</td></tr>`
        }
    }

    markup = (
        `<div><table class="weaponTable">
        <tr><th class="image" colspan="3"><img alt="imagem da arma ${name}" src=${wImage[0]}></th></tr>
        <tr><th>Nome</th><td>"${name}"</td></tr>
        <tr><th>Tipo</th><td class="container" colspan="1"><img alt="icone de arma ${type}"  class="icon"  src=${wImage[1]}></td></tr>
        <tr><th>Dano(Real)</th><td>${dmgDisplay}(${dmgRaw})</td></tr>
        <tr><th>Elementos</th><td> ${elementType}(${elementDMG})</td></tr>
        <tr><th colspan="2">Anterior</th></tr><td colspan="2" onClick="secondaryCall(this)">${upgradeLine[0]}</td>
        <tr><th colspan="2">Próximas</th></tr>${run(upgradeLine)}
        <img src="https://cdn.icon-icons.com/icons2/2717/PNG/512/x_circle_icon_173469.png" class="icon2" onclick="removeDiv(this)">
        </div></table>`
    )
    tableBody = $("#divPai");
    tableBody.append(markup);
}

function removeDiv(tabela){ 
    tabela.nextSibling.remove()
    tabela.remove()
}

function searchTable(value, data) {
    let filtredList = []

    for (let i = 0; i < data.length; i++) {
        value = value.toLowerCase()
        let name = data[i].innerText.toLowerCase()

        if (name.includes(value)) {
            filtredList.push(data[i])
        }
    }

    return filtredList
}

function makeCornerlist(list) {
    let sidebarTable = $('#sideTable')
    sidebarTable[0].innerHTML = ""
    let escadao;
    
    if (list[0].name != undefined) {
        for (i in list) {
            escadao += (
                `<tr><td class="longlist" onClick="secondaryCall(this)"><a>${list[i].name}</a></td></tr>`
            );
        }
    } else {
        for (i in list) {
            escadao += (
                `<tr><td class="longlist" onClick="secondaryCall(this)"><a>${list[i].innerText}</a></td></tr>`
            );
        }
    }

    sidebarTable.append("<tr>" + escadao + "</tr>")
}

function secondaryCall(me) {
    placeWeapon(searchWeapon(list, me.innerText))
    $('body, html, .header').scrollLeft($(document).outerWidth());
}

async function startup() {
    list = await searchAllWeapons();
    placeWeapon(searchWeapon(list, 1));
    makeCornerlist(list);
}
