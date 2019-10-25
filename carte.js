$(document).ready(function() {

  class Joueur {
    constructor(nom, pvID) {
      this.nom = nom;
      this.sante = {
        pv: 100,
        ID: pvID
      }
      this.arme = {
        nom: 'epee',
        degats: 10
      }
    }
    afficherJoueur() {
      return `<img src="images/joueurs/visuel/${this.nom}_epee.png" id="${this.nom}">`;
    }
    attaquer(cible) {
      if(this.sante.pv > 0) {
        cible.sante.pv -= this.arme.degats;
        $(cible.sante.ID).html(cible.sante.pv);
        if(cible.sante.pv <= 0) {
          alert('FIN');
        }
      }
    }
    seDefendre(cible) {
      if(this.sante.pv > 0) {
        this.sante.pv -= cible.arme.degats / 2;
        $(this.sante.ID).html(this.sante.pv);
        if(this.sante.pv <= 0) {
          alert('FIN');
        }
      }
    }
  };

  class Arme {
      constructor(nom, degats) {
      this.nom = nom;
      this.degats = degats;
      }
      afficherArme() {
        return `<img src="images/armes/${this.nom}.png">`;
      }
  };

  const joueur1 = new Joueur('joueur1', '#pvJoueur1');
  const joueur2 = new Joueur('joueur2', '#pvJoueur2');
  const epee = new Arme('epee', 10);
  const marteau = new Arme('marteau', 25);
  const epeeXL = new Arme('epeeXL', 20);
  const sabre = new Arme('sabre', 15);

  let divs = [];

  let iJoueur1 = '';
  let iJoueur2 = '';
  let iJoueur = '';
  let imgJoueur = '';

  const videsJoueur1 = [10, 20, 30, 40, 1];
  const videsJoueur2 = [-10, -20, -30, -40, -1];
  const videsMarteau = [-1, -2, -3, -4, +1, +2, +3, +4];

  for(let i=0; i < 100; i++) {
    $('.row').append('<div class="col-sm-1" id="'+i+'"></div>');
    divs.push('div #'+i);
  };

  $('.row div').each( function() { 
      if(Math.random() < 0.3) {
      $(this).addClass('mur');
    }
  });

  function spawnAleatoire(image, min, max, type) {
    let i = '';
    i = Math.floor(Math.random() * (max - min + 1)) + min;
    if(type === 'joueur1') {
      iJoueur1 = i;
      $(videsJoueur1).each( function() {
        $((divs)[i+this]).removeClass('mur');
      });
    }
    else if(type === 'joueur2') {
      iJoueur2 = i;
      $(videsJoueur2).each( function() {
        $((divs)[i+this]).removeClass('mur');
      });
    }
    else if(type === 'marteau') {
      $((divs)[i]).addClass('marteau');
      $(videsMarteau).each( function() {
        $((divs)[i+this]).removeClass('mur');
      });
    }
    $(image).prependTo($((divs)[i]));
    $((divs)[i]).removeClass('mur');
}

  spawnAleatoire(joueur1.afficherJoueur(),0,9,'joueur1');
  spawnAleatoire(joueur2.afficherJoueur(),90,99,'joueur2');

  spawnAleatoire(marteau.afficherArme(),53,56,'marteau');
  let aleatoire = Math.floor(Math.random() * 2);
    if(aleatoire < 1) {
      spawnAleatoire(epeeXL.afficherArme(),10,49,'arme');
      spawnAleatoire(sabre.afficherArme(),60,89,'arme');
    } else {
      spawnAleatoire(sabre.afficherArme(),10,49,'arme');
      spawnAleatoire(epeeXL.afficherArme(),60,89,'arme');
    }


// #################################
// ### DEPLACEMENTS & COLLISIONS ###
// #################################
  let mouvement = 0;
  let quiCommence = 0;

  const bordsHaut = [0,1,2,3,4,5,6,7,8,9];
  const bordsBas = [90,91,92,93,94,95,96,97,98,99];
  const bordsDroite = [9,19,29,39,49,59,69,79,89,99];
  const bordsGauche = [-1,10,20,30,40,50,60,70,80,90];

  // JOUEUR qui JOUE le PREMIER
  quiCommence = Math.floor(Math.random() * 2);
  if(quiCommence < 1) {
    $('#tourJoueur1').text('MON TOUR').css('color','green');
    $('#tourJoueur2').text('EN ATTENTE').css('color','red');
    iJoueur = iJoueur1;
    imgJoueur = 'img#joueur1';
  } else {
    $('#tourJoueur2').text('MON TOUR').css('color','green');
    $('#tourJoueur1').text('EN ATTENTE').css('color','red');
    iJoueur = iJoueur2;
    imgJoueur = 'img#joueur2';
  }
  seDeplacer(); // ACTIVE FONCTION DEPLACEMENTS

  // VERIFIE COLLISIONS MURS et PLATEAU
  function estDifferent(element) {
    return element !== iJoueur;
  }

  // VERIFIE SI un JOUEUR a fait 3 MOUVEMENTS
  // TOUR SUIVANT = L'AUTRE JOUEUR
  function verifieMouvement() {
    mouvement++;
    if(mouvement >= 3) {
      if(quiCommence < 1) {
        $('#tourJoueur2').text('MON TOUR').css('color','green');
        $('#tourJoueur1').text('EN ATTENTE').css('color','red');
        iJoueur = iJoueur2;
        imgJoueur = 'img#joueur2';
        quiCommence++;
      } else {
        $('#tourJoueur1').text('MON TOUR').css('color','green');
        $('#tourJoueur2').text('EN ATTENTE').css('color','red');
        iJoueur = iJoueur1;
        imgJoueur = 'img#joueur1';
        quiCommence--;
      }
      mouvement = 0;
    }
  }

  // ENREGISTRE la NOUVELLE POSITION de chaque JOUEUR
  function verifieJoueur() {
    if(quiCommence < 1) {
      iJoueur1 = iJoueur;
    } else {
      iJoueur2 = iJoueur;
    }
    verifieCombat();
    console.log(iJoueur1);
    console.log(iJoueur2);
  }

  // DEPLACEMENTS
  function seDeplacer() {
    $(document).keydown(function(e) {
        if(bordsDroite.every(estDifferent) && !$((divs)[iJoueur+1]).hasClass('mur')) {
          // Touche clavier DROITE
          if (e.which === 39) {
            iJoueur++;
            $(imgJoueur).prependTo($((divs)[iJoueur]));
            verifieJoueur();
            verifieMouvement();
          }
        }
        if(bordsGauche.every(estDifferent) && !$((divs)[iJoueur-1]).hasClass('mur')) {
          // Touche clavier GAUCHE
          if (e.which === 37) {
            iJoueur--;
            $(imgJoueur).prependTo($((divs)[iJoueur]));
            verifieJoueur();
            verifieMouvement();
          }
        }
        if(bordsBas.every(estDifferent) && !$((divs)[iJoueur+10]).hasClass('mur')) {
          // Touche clavier BAS
          if (e.which === 40) {
            iJoueur = iJoueur + 10;
            $(imgJoueur).prependTo($((divs)[iJoueur]));
            verifieJoueur();
            verifieMouvement();
          }
        }
        if(bordsHaut.every(estDifferent) && !$((divs)[iJoueur-10]).hasClass('mur')) {
          // Touche clavier HAUT
          if (e.which === 38) {
            iJoueur = iJoueur - 10;
            $(imgJoueur).prependTo($((divs)[iJoueur]));
            verifieJoueur();
            verifieMouvement();
          }
        }
    });
  }

  // Si JOUEUR veut faire 0, 1 ou 2 MOUVEMENTS
  // ANTI-REFRESH PAGE
  $('button').click(function(e){
    e.preventDefault();
    mouvement = 3;
    verifieJoueur();
    verifieMouvement();
  })


// ##############
// ### COMBAT ###
// ##############
let combatTour = 0;
let monTour = '';

function verifieCombat() {
  if(iJoueur1 === iJoueur2) {
    seCombattre();
  }
}

function seCombattre() {
  alert('COMBAT!');

  $('button').click(function(e){
    verifieCombatTour();
    monTour;
  })
}

function verifieCombatTour() {
    combatTour++;
    if(combatTour >= 1) {
      if(quiCommence < 1) {
        monTour = joueur1.attaquer(joueur2);
        $('#tourJoueur2').text('MON TOUR').css('color','green');
        $('#tourJoueur1').text('EN ATTENTE').css('color','red');
        quiCommence++;
      } else {
        monTour = joueur2.attaquer(joueur1);
        $('#tourJoueur1').text('MON TOUR').css('color','green');
        $('#tourJoueur2').text('EN ATTENTE').css('color','red');
        quiCommence--;
      }
    combatTour = 0;
  }
};


});