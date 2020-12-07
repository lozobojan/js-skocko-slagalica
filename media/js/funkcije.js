var redovi = document.getElementsByClassName("jedan-red");
var tasteri = document.getElementsByClassName("jedan-taster");
var znakoviTastera = [
    'url("./media/img/skocko.png")',
    'url("./media/img/tref.png")',
    'url("./media/img/pik.png")',
    'url("./media/img/herc.png")',
    'url("./media/img/karo.png")',
    'url("./media/img/zvijezda.png")',
];


var popunjenost = [false, false, false, false];
var aktivniRed = 0;


//Deklaracija i popunjavanje dvodiemnzionalnog niza polja za unos
var polja = [];
for (var i = 0; i < 6; i++) {
    polja[i] = [];
}
var temp = document.getElementsByClassName("jedno-polje");
for (var i = 0; i < 6; i++) {
    for (var j = 0; j < 4; j++) {
        polja[i][j] = temp[i * 4 + j];
    }
}


//Dodavanje event listenera na tastere
for (var i = 0; i < tasteri.length; i++) {
    tasteri[i].addEventListener("click", klikNaTaster);
}


//Dodavanje event listenera na polja
for (var i = 0; i < polja.length; i++) {
    for (var j = 0; j < polja[i].length; j++) {
        polja[i][j].addEventListener("click", klikNaPolje);
    }
}


//Metoda koja se aktivira na dogadjaj kilka na jedan od tastera
function klikNaTaster(e) {
    // console.log(aktivniRed);
    if (aktivniRed > 5 || rijeseno){
        // prikaziRjesenje();
        return;
    }
    var trenutnoPolje = polja[aktivniRed][indeksAktivnogPolja()];
    if (indeksAktivnogPolja() != -1) {
        var indeksTastera = dohvatiIndeksTastera(e);
        var indeksPolja = indeksAktivnogPolja();
        polja[aktivniRed][indeksPolja].style.backgroundImage = znakoviTastera[indeksTastera];
        popunjenost[indeksPolja] = true;
    }
}

//Metoda koja se aktivira na dogadjaj kilka na jedno od polja
function klikNaPolje(e) {
    var indeksPolja = dohvatiIndeksPolja(e);
    if (popunjenost[indeksPolja] == true) {
        popunjenost[indeksPolja] = false;
        polja[aktivniRed][indeksPolja].style.backgroundImage = "";
    }
}


//Vraca indeks aktivnog polja u aktivnom redu ili -1 ukoliko ne postoji aktivno polje
function indeksAktivnogPolja() {
    var indeks = -1;
    for (var i = 0; i < popunjenost.length; i++) {
        if (popunjenost[i] == false) {
            indeks = i;
            break;
        }
    }
    return indeks;
}

//Vraca indeks tastera na koga se desio dogadjaj klik
function dohvatiIndeksTastera(e) {
    var indeks = -1;
    var izvor = e.srcElement;
    for (var i = 0; i < tasteri.length; i++) {
        if (tasteri[i] == izvor) {
            indeks = i;
        }
    }
    return indeks;
}


//Vraca indeks polja na koga se desio dogadjaj klik
function dohvatiIndeksPolja(e) {
    var indeks;
    var izvor = e.srcElement;
    for (var i = 0; i < 4; i++) {
        if (polja[aktivniRed][i] == izvor) {
            indeks = i;
        }
    }
    return indeks;
}

function restart(){
    window.location.reload();
}

var zadatiZnakovi = [];
var rijeseno = false;

//Random odabir zadanih znakova
for (var i = 0; i < 4; i++) {
    var random = Math.floor(Math.random() * 6);
    console.log(random);
    zadatiZnakovi[i] = znakoviTastera[random];
}


document.getElementsByClassName("potvrda")[0].addEventListener("click", potvrda);



//Metoda koja se poziva klikom na dugme potvrdi
//Boji indikatore u zavisnosti od provjerenog odgovora
function potvrda() {
    //Prvi dio metode porvjerava da li su zadovoljeni uslovi za nastavak izvrsavanja
    //Potrebno je da igra vec nije rijesena (rejeseno==false)
    //Potrebno je da je svaki elemenat niza popunjenost jednak true
    if (rijeseno) {
        return;
    }
    var provjeraDozvoljena = true;
    for (var k = 0; k < 4; k++) {
        if (popunjenost[k] == false)
            provjeraDozvoljena = false;
    }
    if (provjeraDozvoljena == false) {
        return;
    }

    var podudaranja = prebrojavanje();
    var indikatori = redovi[aktivniRed].children[1].children;
    for (var i = 0; i < podudaranja[0]; i++) {
        indikatori[i].style.backgroundColor = "red";
    }
    for (var j = podudaranja[0]; j < podudaranja[0] + podudaranja[1]; j++) {
        indikatori[j].style.backgroundColor = "yellow";
    }
    aktivniRed++;
    if (podudaranja[0] == 4) {
        rijeseno = true;
        // alert("Cestitamo! Pronasli ste kombinaciju");
    }else if(aktivniRed > 5){
        prikaziRjesenje();
    }
    popunjenost = [false, false, false, false]
}



//Vraca niz od dva elementa gdje je [0] broj potpunih podudaranja a [1] broj djelimicnih podudaranja
function prebrojavanje() {
    for (var i = 0; i < popunjenost.length; i++) {
        if (popunjenost[i] == false) {
            return;
        }
    }
    var uneseniZnakovi = [];
    for (var j = 0; j < polja[aktivniRed].length; j++) {
        uneseniZnakovi[j] = polja[aktivniRed][j].style.backgroundImage;
    }

    var brojPodudaranja = prebrojSvaPodudaranja(uneseniZnakovi);
    var potpunaPodudaranja = prebrojPotpunaPodudaranja(uneseniZnakovi);
    var djelimicnaPodudaranje = brojPodudaranja - potpunaPodudaranja;

    return [potpunaPodudaranja, djelimicnaPodudaranje];
}

function prebrojSvaPodudaranja(nizUnesenih) {
    var brojPodudaranja = 0;
    var zadani = prebrojZnakove(zadatiZnakovi);
    var uneseni = prebrojZnakove(nizUnesenih);
    for (var i = 0; i < 6; i++) {
        brojPodudaranja += ((uneseni[i] > zadani[i]) ? zadani[i] : uneseni[i]);
    }
    return brojPodudaranja;
}

function prebrojPotpunaPodudaranja(nizUnesenih) {
    var brojPodudaranja = 0;
    for (var i = 0; i < 4; i++) {
        if (nizUnesenih[i] === zadatiZnakovi[i]) {
            brojPodudaranja++;
        }
    }
    return brojPodudaranja;
}

function prebrojZnakove(niz) {
    var brojSkocka = 0;
    var brojTref = 0;
    var brojPik = 0;
    var brojHerc = 0;
    var brojKaro = 0;
    var brojZvijezda = 0;

    for (var i = 0; i < 4; i++) {
        switch (niz[i]) {
            case znakoviTastera[0]:
                brojSkocka++;
                break;
            case znakoviTastera[1]:
                brojTref++;
                break;
            case znakoviTastera[2]:
                brojPik++;
                break;
            case znakoviTastera[3]:
                brojHerc++;
                break;
            case znakoviTastera[4]:
                brojKaro++;
                break;
            case znakoviTastera[5]:
                brojZvijezda++;
                break;
        }
    }

    return [brojSkocka, brojTref, brojPik, brojHerc, brojKaro, brojZvijezda];
}


// na kraju prikazuje tacno rjesenje
function prikaziRjesenje(){
    alert("Kraj igre!");
    document.getElementById("polje0-rjesenje").style.backgroundImage = zadatiZnakovi[0];
    document.getElementById("polje1-rjesenje").style.backgroundImage = zadatiZnakovi[1];
    document.getElementById("polje2-rjesenje").style.backgroundImage = zadatiZnakovi[2];
    document.getElementById("polje3-rjesenje").style.backgroundImage = zadatiZnakovi[3];
}