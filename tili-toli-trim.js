/* ____________    ____            __________  __    ____
  /_  __/  _/ /   /  _/           /_  __/ __ \/ /   /  _/
   / /  / // /    / /   ______     / / / / / / /    / /  
  / / _/ // /____/ /   /_____/    / / / /_/ / /____/ /   
 /_/ /___/_____/___/             /_/  \____/_____/___/ */
const m = 5
const n = 4
const fajlNev = 'corgi5x4'
const blankNev = 'blank'
let kepekMatrix = new Array(n)
let helyesMatrix = new Array(n)
let kepekTabla = document.getElementById('kepek-tabla')
let panel = document.getElementById('panel')
let alapGomb = document.getElementById('alap-gomb')
let keverGomb = document.getElementById('kever-gomb')
let startGomb = document.getElementById('start-gomb')
let kilepGomb = document.getElementById('kilep-gomb')
let jatekInfok = document.getElementById('jatek-infok')
let ido = document.getElementById('ido')
let lepesekSzama = document.getElementById('lepesek-szama')
let blankID
let jatekFut = false
let lepesekDb = 0
let masodperc = 0, perc = 0, ora = 0, t

function init() {
    kilepGomb.setAttribute('disabled', 'true')
    jatekInfok.style.setProperty('visibility', 'hidden')
    alaphelyzet()
    kepekTabla.style.setProperty('width', m * 106 + 'px')
    panel.style.width = kepekTabla.style.width
}

function alaphelyzet() {
    kepekTabla.innerHTML = ''
    for (let i = 0; i < n; i++) {
        if (typeof (kepekMatrix[i]) == 'undefined') {
            kepekMatrix[i] = new Array(m)
        }
        if (typeof (helyesMatrix[i]) == 'undefined') {
            helyesMatrix[i] = new Array(m)
        } else {
            for (let j = 0; j < m; j++) {
                kepekMatrix[i][j] = null
                helyesMatrix[i][j] = null
            }
        }
    }
    for (let sor = 0; sor < n; sor++) {
        let ujSor = kepekTabla.insertRow(sor)
        for (let oszlop = 0; oszlop < m; oszlop++) {
            let kep = document.createElement('img')
            if (sor == 0 && oszlop == m - 1) {
                kep.src = `resources/${blankNev}.jpg`
                kep.classList.add('blank')
            } else {
                kep.src = `resources/${m}x${n}/${fajlNev}_${sor + 1}_${oszlop + 1}.jpg`
                kep.classList.add('kep')
                kep.setAttribute('onclick', 'csere(this.id, false)')
            }
            kep.id = (sor * m) + oszlop
            kepekMatrix[sor][oszlop] = ujSor.insertCell(oszlop).appendChild(kep)
        }
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            helyesMatrix[i][j] = kepekMatrix[i][j].id
        }
    }
    blankID = helyesMatrix[0][m - 1]
}

function osszekever() {
    let keveresekDb = 2999
    let kevertID
    let keveres = 0
    while (keveres < keveresekDb) {
        kevertID = Math.floor(Math.random() * (m * n))
        if (kevertID + m == blankID ||
            kevertID - m == blankID ||
            kevertID + 1 == blankID && blankID % m != 0 ||
            kevertID - 1 == blankID && kevertID % m != 0) {
                csere(kevertID, true)
                keveres++
        }
    }
}

function start() {
    osszekever()
    alapGomb.setAttribute('disabled', 'true')
    keverGomb.setAttribute('disabled', 'true')
    startGomb.setAttribute('disabled', 'true')
    kilepGomb.removeAttribute('disabled')
    jatekInfok.style.setProperty('visibility', 'visible')
    jatekFut = true;
    lepesekSzama.innerText = lepesekDb.toString()
    ido.innerText = '00:00:00'
    szamlalo()
}

function kilep() {
    alaphelyzet()
    jatekFut = false
    lepesekDb = 0
    alapGomb.removeAttribute('disabled')
    keverGomb.removeAttribute('disabled')
    startGomb.removeAttribute('disabled')
    kilepGomb.setAttribute('disabled', 'true')
    jatekInfok.style.setProperty('visibility', 'hidden')
    clearTimeout(t)
    masodperc = perc = ora = 0
}

function csere(id, kever) {
    let kivalasztottID = parseInt(id)
    let uresID = parseInt(blankID)
    if (kivalasztottID + m == uresID ||
        kivalasztottID - m == uresID ||
        kivalasztottID + 1 == uresID && uresID % m != 0 ||
        kivalasztottID - 1 == uresID && kivalasztottID % m != 0) {
        let kivalasztottKep = document.getElementById(kivalasztottID)
        let uresKep = document.getElementById(uresID)
        uresKep.src = kivalasztottKep.src
        uresKep.classList.remove('blank')
        uresKep.classList.add('kep')
        uresKep.setAttribute('onclick', 'csere(this.id, false)')
        kivalasztottKep.src = `resources/${blankNev}.jpg`
        kivalasztottKep.classList.remove('kep')
        kivalasztottKep.classList.add('blank')
        kivalasztottKep.removeAttribute('onclick')
        blankID = id
        let kivalasztottSorIndex, kivalasztottOszlopIndex
        let uresSorIndex, uresOszlopIndex
        for (let sor = 0; sor < n; sor++) {
            for (let oszlop = 0; oszlop < m; oszlop++) {
                if (kepekMatrix[sor][oszlop].id == kivalasztottID) {
                    kivalasztottSorIndex = sor
                    kivalasztottOszlopIndex = oszlop
                }
                if (kepekMatrix[sor][oszlop].id == uresID) {
                    uresSorIndex = sor
                    uresOszlopIndex = oszlop
                }
            }
        }
        let csere = kepekMatrix[kivalasztottSorIndex][kivalasztottOszlopIndex]
        kepekMatrix[kivalasztottSorIndex][kivalasztottOszlopIndex] = kepekMatrix[uresSorIndex][uresOszlopIndex]
        kepekMatrix[uresSorIndex][uresOszlopIndex] = csere
        if (!kever && jatekFut) {
            lepesekDb++
            lepesekSzama.innerText = lepesekDb.toString()
            if (ellenoriz()) {
                alert(`Gratulálok, nyertél!\nLépéseid száma: ${lepesekDb}\nIdő: ${ido.innerText}`)
                kilep()
            }
        }
    }
}

function ellenoriz() {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (kepekMatrix[i][j].id != helyesMatrix[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function novel() {
    masodperc++
    if (masodperc >= 60) {
        masodperc = 0
        perc++
        if (perc >= 60) {
            perc = 0
            ora++
        }
    }
    ido.innerText = (ora ? (ora > 9 ? ora : "0" + ora) : "00") + ":" + (perc ? (perc > 9 ? perc : "0" + perc) : "00") + ":" + (masodperc > 9 ? masodperc : "0" + masodperc)
    szamlalo()
}

function szamlalo() {
    t = setTimeout(novel, 1000)
}