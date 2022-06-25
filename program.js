const {
  resetirajNovuTablicuVrijednosti, 
  ispirintajTablicu,
  formirajNovuTablicu,
  zapocniPartiju,
  odigrajEpsilonPohlepno,
  kucaIgra,
  azurirajStanjaNoveTablice,
  usporediTablice
} = require('./pomocni')

const EPSILON = 0.1;

let staraTablicaVrijednosti = {
  sAsom: [...Array(10)].map((_, i) =>[...Array(10)].map(() => i + 12 < 17 ? 'h': 's')),
  bezAsa: [...Array(10)].map((_, i) =>[...Array(10)].map(() => i + 12 < 17 ? 'h': 's'))
};


let novaTablicaVrijednosti = resetirajNovuTablicuVrijednosti();
let partija;
let brojac = 0;

do {

  if(brojac !== 0) staraTablicaVrijednosti = formirajNovuTablicu(novaTablicaVrijednosti);
  novaTablicaVrijednosti = resetirajNovuTablicuVrijednosti();

  for (let i = 0; i < 10000000; i++) {
    partija = zapocniPartiju();
    odigrajEpsilonPohlepno(partija, EPSILON, staraTablicaVrijednosti);
    kucaIgra(partija);
    azurirajStanjaNoveTablice(novaTablicaVrijednosti, partija);
  }

  console.log('brojac:', brojac)
  
  brojac++
} while(JSON.stringify(staraTablicaVrijednosti) !== JSON.stringify(formirajNovuTablicu(novaTablicaVrijednosti)))
// }while(usporediTablice(staraTablicaVrijednosti.sAsom, formirajNovuTablicu(novaTablicaVrijednosti).sAsom)+
// usporediTablice(staraTablicaVrijednosti.bezAsa, formirajNovuTablicu(novaTablicaVrijednosti).bezAsa) <=2)
ispirintajTablicu(formirajNovuTablicu(novaTablicaVrijednosti))