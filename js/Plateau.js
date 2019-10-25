// CLASSE PLATEAU
class Plateau {
  constructor() {
    this.taille = 100;
    this.cases = [];
    this.bordsHaut = [0,1,2,3,4,5,6,7,8,9];
    this.bordsBas = [90,91,92,93,94,95,96,97,98,99];
    this.bordsDroite = [9,19,29,39,49,59,69,79,89,99];
    this.bordsGauche = [0,10,20,30,40,50,60,70,80,90];
  }

  genererPlateau() {
    // CREATION DES CASES (100 cases)
    for(let i=0; i < this.taille; i++) {
      $('.row').append('<div class="col-sm-1" id="'+i+'"></div>'); // Une case = une div
        this.cases.push('div #'+i); // Chacune est ajoutée dans le tableau cases
      };
    // GENERATION ALEATOIRE DES MURS (30% de chances pour une div de devenir un mur)
    $('.row div').each( function() { 
        if(Math.random() < 0.3) {
        $(this).addClass('mur'); // La classe mur donne à la div choisit un aspect mural
      }
    });
  }
};