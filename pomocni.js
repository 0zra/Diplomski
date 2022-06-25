const KARTE = "A,2,3,4,5,6,7,8,9,10,10,10,10".split(',');
const izvuciKartu = () => KARTE[Math.floor(Math.random() * KARTE.length)];

const inkrementalnoIzracunajProsjek = (stariProsjek, novaVrijednost, n) =>  stariProsjek + (novaVrijednost - stariProsjek) / (n + 1);

const resetirajNovuTablicuVrijednosti = () => ({
  sAsom: [...Array(10)].map((el, i) =>
    [...Array(10)].map((elInner) => ({
      h: { val: 0, brojPonavljanja: 0 },
      s: { val: 0, brojPonavljanja: 0 }
    }))
  ),
  bezAsa: [...Array(10)].map((el, i) =>
    [...Array(10)].map((elInner) => ({
      h: { val: 0, brojPonavljanja: 0 },
      s: { val: 0, brojPonavljanja: 0 }
    }))
  )
});

const ispirintajTablicu = (tablica) => {
  console.log('s Asom:');
  console.log('     A   2   3   4   5   6   7   8   9  10')
  tablica.sAsom.reverse().forEach((redak, i) => console.log(21-i, JSON.stringify(redak)))
  console.log('================================');
  console.log('bez Asa:')
  console.log('     A   2   3   4   5   6   7   8   9  10')
  tablica.bezAsa.reverse().forEach((redak, i) => console.log(21-i, JSON.stringify(redak)))
}

const azurirajStanjaNoveTablice = (novaTablicaVrijednosti, partija) => {
  partija.putanja.forEach((stanje) => {
    const stanjeUTablici = (stanje.iskoristivAS
      ? novaTablicaVrijednosti.sAsom
      : novaTablicaVrijednosti.bezAsa)[stanje.suma - 12][
      partija.protivnikPokazuje === "A" ? 0 : +partija.protivnikPokazuje - 1
    ][stanje.odabranaAkcija];
    stanjeUTablici.val = inkrementalnoIzracunajProsjek(
      stanjeUTablici.val,
      partija.dobit,
      stanjeUTablici.brojPonavljanja
    );
    stanjeUTablici.brojPonavljanja += 1;
  });
};

const zapocniPartiju = () => {
  let iskoristivAS = false;
  let suma = 0;

  while (suma < 12) {
    const izvucenaKarta = izvuciKartu();
    if (izvucenaKarta === "A" && !iskoristivAS) {
      suma += 10;
      iskoristivAS = true;
    } else if (izvucenaKarta === "A" && iskoristivAS) {
      suma += 1;
    } else {
      suma += +izvucenaKarta;
    }
  }

  return {
    suma,
    iskoristivAS,
    putanja: [],
    dobit: undefined,
    protivnikPokazuje: izvuciKartu()
  };
};

const poduzimamoAkciju = (partija, izvucenaKarta) => {
  partija.putanja.push({
    suma: partija.suma,
    odabranaAkcija: "h",
    iskoristivAS: partija.iskoristivAS
  });
  if (izvucenaKarta === "A") {
    partija.suma += 1;
  } else {
    partija.suma += +izvucenaKarta;
  }

  if (partija.suma > 21 && partija.iskoristivAS) {
    partija.suma -= 9;
    partija.iskoristivAS = false;
  }
};

const odigrajEpsilonPohlepno = (partija, epsilon, staraTablicaVrijednosti) => {
  let odabranaAkcija = undefined;

  while (odabranaAkcija !== "s" && partija.suma < 22) {
    const trenutnoStanje = (partija.iskoristivAS
      ? staraTablicaVrijednosti.sAsom
      : staraTablicaVrijednosti.bezAsa)[partija.suma - 12][
      partija.protivnikPokazuje === "A" ? 0 : +partija.protivnikPokazuje - 1
    ];
    const [preferiranaAkcija, nePreferiranaAkcija] =
      trenutnoStanje === 'h' ? ["h", "s"] : ["s", "h"];

    odabranaAkcija =
      (Math.random() > epsilon && preferiranaAkcija) || nePreferiranaAkcija;

    if (odabranaAkcija === "h") {
      poduzimamoAkciju(partija, izvuciKartu());
    } else {
      partija.putanja.push({
        suma: partija.suma,
        odabranaAkcija,
        iskoristivAS: partija.iskoristivAS
      });
    }

  }
};

const kucaIgra = (partija) => {
  if (partija.suma > 21) {
    partija.dobit = -1;
    return;
  }
  let kucaImaIskoristivogAsa = partija.protivnikPokazuje === "A";
  let sumaKuce =
    partija.protivnikPokazuje === "A" ? 10 : +partija.protivnikPokazuje;

  while (sumaKuce < 17) {
    const izvucenaKarta = izvuciKartu();
    if (izvucenaKarta === "A") {
      sumaKuce += kucaImaIskoristivogAsa ? 1 : 10;
      kucaImaIskoristivogAsa = kucaImaIskoristivogAsa || true;
    } else {
      sumaKuce += +izvucenaKarta;
    }

    if (sumaKuce > 21 && kucaImaIskoristivogAsa) {
      sumaKuce -= 9;
      kucaImaIskoristivogAsa=false;
    }
  }
  if (sumaKuce > 21) {
    partija.dobit = 1;
    return;
  }

  if (sumaKuce === partija.suma) {
    partija.dobit = 0;
    return;
  }
  if (partija.suma > sumaKuce) {
    partija.dobit = 1;
    return;
  } else {
    partija.dobit = -1;
    return;
  }
};



const formirajNovuTablicu = (novaTablica) => {
  const formirana = {};
  formirana.sAsom = novaTablica.sAsom.map((redak) =>
    redak.map(({ h, s }) => h.val >= s.val ? 'h': 's' )
  );

  formirana.bezAsa = novaTablica.bezAsa.map((redak) =>
    redak.map(({ h, s }) => h.val >= s.val ? 'h': 's')
  );
  return formirana;
};




const isprintajTablicuVrijednosti = (tablica) => {
  const tablicaZaPrint = {}
  tablicaZaPrint.bezAsa = tablica.bezAsa.map(redak => redak.map(({h,s}) => `s:${s.val.toFixed(2)}(${s.brojPonavljanja}); h:${h.val.toFixed(2)}(${h.brojPonavljanja}) ||`) )





  IspirintajTablicu(tablicaZaPrint)
}

const usporediTablice = (prvaTablica, drugaTablica)  => {
  let brojRazlika = 0;
  for (let i = 0; i < prvaTablica.length; i++) {
    if(JSON.stringify(prvaTablica[i]) !== JSON.stringify(drugaTablica[i])){
      for (let j = 0; j < prvaTablica[i].length; j++) {
        if(prvaTablica[i][j] !== drugaTablica[i][j])  
        brojRazlika++
      }
    }
  }
  // console.log('brojRazlika', brojRazlika)
  return brojRazlika
}

module.exports = { 
  resetirajNovuTablicuVrijednosti , 
  ispirintajTablicu, 
  azurirajStanjaNoveTablice, 
  zapocniPartiju, 
  poduzimamoAkciju, 
  odigrajEpsilonPohlepno, 
  kucaIgra, 
  formirajNovuTablicu,
  usporediTablice
 }