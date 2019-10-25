$(document).ready(function() {

  // CLASSE JOUEUR
  class Joueur {
    constructor(nom, arme, backgroundColor) {
      this.nom = nom;
      this.sante = 100;
      this.arme = arme;
      this.combat = 'defense';
      this.image = `img#${this.nom}`;
      this.position = 0;
      this.backgroundColor = backgroundColor;
    }
    afficherJoueur() {
      return `<img src="images/joueurs/${this.nom}/${this.nom}_${this.arme.nom}.png" class="joueur" id="${this.nom}">`;
    }
    creationATH() {
      $(`section#${this.nom}`).css('background-color',this.backgroundColor); // COULEUR FOND ATH
      $(`${this.arme.image}`).prependTo($(`p#${this.nom}`)); // IMAGE ARME EQUIPEE
      $(`span#${this.nom}Degats`).text(`${this.arme.degats}`);
    }
    passeSonTourAu(joueurActif) {
      $(`p.tour#${joueurActif.nom}Tour`).text('OUI').css('color','green').addClass('OUI');
      $(`p.tour#${this.nom}Tour`).text('NON').css('color','#ef0404').removeClass('OUI'); //rouge
    }
    attaquer(cible) {
      if(this.sante > 0) {
        cible.sante -= this.arme.degats;
        //$(cible.sante).html(cible.sante);
        if(cible.sante <= 0) {
          alert('FIN');
        }
      }
    }
    seDefendre(cible) {
      if(this.sante > 0) {
        this.sante -= cible.arme.degats / 2;
        //$(this.sante).html(this.sante);
        if(this.sante <= 0) {
          alert('FIN');
        }
      }
    }
  };

  // CLASSE ARME
  class Arme {
      constructor(nom, degats) {
      this.nom = nom;
      this.degats = degats;
      this.image = `img#${this.nom}`;
      this.position = 0;
      }
      afficherArme() {
        return `<img src="images/armes/${this.nom}.png" id="${this.nom}">`;
      }
  };

  // CREATION ARMES
  const epee1 = new Arme('epee1', 10);
  const epee2 = new Arme('epee2', 10);
  const marteau = new Arme('marteau', 25);
  const epeeXL = new Arme('epeeXL', 20);
  const sabre = new Arme('sabre', 15);
  // CREATION JOUEURS
  const joueur1 = new Joueur('joueur1', epee1, 'skyblue');
  const joueur2 = new Joueur('joueur2', epee2, 'burlywood');
  
  // CREATION PLATEAU
  let damier = [];

  // CASES VIDES AUTOUR des JOUEURS et du MARTEAU
  const zoneDegageeJoueur1 = [10, 20, 30, 40, 1]; // Devant
  const zoneDegageeJoueur2 = [-10, -20, -30, -40, -1]; // Devant
  const zoneDegageeMarteau = [-1, -2, -3, -4, +1, +2, +3, +4]; // Gauche et Droite


// #######################
// ### GENERER LE JEU ####
// #######################

  function genererPlateau() {
    // CREATION DES CASES
    for(let i=0; i < 100; i++) {
      $('.row').append('<div class="col-sm-1" id="'+i+'"></div>');
      damier.push('div #'+i);
    };
    // CREATION MURS ALEATOIRE
    $('.row div').each( function() { 
        if(Math.random() < 0.3) {
        $(this).addClass('mur');
      }
    });
  }

  function spawnAleatoire(image, min, max, type) {
    let i = '';
    i = Math.floor(Math.random() * (max - min + 1)) + min;
    // CASES VIDES DEVANT JOUEUR1
    if(type === 'joueur1') {
      joueur1.position = i;
      $(zoneDegageeJoueur1).each( function() {
        $((damier)[i+this]).removeClass('mur');
      });
    }
    // CASES VIDES DEVANT JOUEUR2
    else if(type === 'joueur2') {
      joueur2.position = i;
      $(zoneDegageeJoueur2).each( function() {
        $((damier)[i+this]).removeClass('mur');
      });
    }
    // CASES VIDES GAUCHE DROITE MARTEAU
    else if(type === 'marteau') {
      marteau.position = i;
      $(zoneDegageeMarteau).each( function() {
        $((damier)[i+this]).removeClass('mur');
      });
    }
    // SPAWN JOUEURS ARMES
    $(image).prependTo($((damier)[i]));
    $((damier)[i]).removeClass('mur');
  }

  function genererJeu() {
  // Création Plateau
    genererPlateau();
    // Spawn Joueurs
    spawnAleatoire(joueur1.afficherJoueur(),0,9,'joueur1');
    spawnAleatoire(joueur2.afficherJoueur(),90,99,'joueur2');
    // Spawn Armes
    spawnAleatoire(marteau.afficherArme(),53,56,'marteau');
    let aleatoire = Math.floor(Math.random() * 2);
      if(aleatoire < 1) {
        spawnAleatoire(epeeXL.afficherArme(),10,49,'epeeXL');
        spawnAleatoire(sabre.afficherArme(),60,89,'sabre');
      } else {
        spawnAleatoire(sabre.afficherArme(),10,49,'sabre');
        spawnAleatoire(epeeXL.afficherArme(),60,89,'epeeXL');
      }
    // CREATION IMAGE ARME EPEE
    spawnAleatoire(epee1.afficherArme(),0,0,'epee1');
    spawnAleatoire(epee2.afficherArme(),0,0,'epee2');
    // Création ATH Joueurs
    joueur1.creationATH();
    joueur2.creationATH();
  }

  // GENERE LE JEU
  genererJeu();



// #################################
// ### DEPLACEMENTS & COLLISIONS ###
// #################################
  let mouvement = 0; // Nombre de mouvements d'un joueur
  let tourJoueur1 = 0; // Est-ce le tour du joueur1 ?
  let joueur; // Permet de gérer les 2 joueurs

  // COLLISIONS BORDS PLATEAU
  const bordsHaut = [0,1,2,3,4,5,6,7,8,9];
  const bordsBas = [90,91,92,93,94,95,96,97,98,99];
  const bordsDroite = [9,19,29,39,49,59,69,79,89,99];
  const bordsGauche = [-1,10,20,30,40,50,60,70,80,90];

  // SON FIN DE TOUR et SON MOUVEMENTS
  function activerSon() {
    let audio;
    if(mouvement < 3) {
      const audio2 = new Audio('sons/bruitdePas.mp3');
      audio = audio2;
    } else if(mouvement >= 3) {
      const audio1 = new Audio('sons/diiing.mp3');
      audio = audio1;
    }
    audio.play(); // PETIT SON
  }

  // CHOISIS le JOUEUR qui JOUE le PREMIER TOUR
  function choisisQuiCommence() {
    tourJoueur1 = Math.floor(Math.random() * 2);
    // Au 1ER TOUR si tourJoueur1 = 0 (inférieur à 1) c'est son tour!
    if(tourJoueur1 < 1) {
      joueur2.passeSonTourAu(joueur1);
      joueur = joueur1;
    // Au 1ER TOUR si tourJoueur1 = 1 (supérieur à 1) c'est PAS son tour!
    } else {
      joueur1.passeSonTourAu(joueur2);
      joueur = joueur2;
    }
  }

  choisisQuiCommence(); // Choisis quel joueur fera le 1er tour
  activeEventKeydown(); // Active les déplacements clavier

  // GERE COLLISIONS PLATEAU (X = direction)
  // Si position du joueur est différente des cases en bordure X du plateau : Déplacement X possible
  function estDifferent(element) {
    return element !== joueur.position;
  }

  // Exemple: marteau
  // SI JOUEUR PASSE SUR ARME il LA RAMASSE et DEPOSE SON ANCIENNE ARME
  function echangerArme() {
    if(joueur.position === marteau.position) {
      $(marteau.image).prependTo($(`p#${joueur.nom}`)); // ARME RAMASSEE ATH
      $(joueur.arme.image).appendTo($((damier)[joueur.position])); // ARME DEPOSEE
      joueur.arme = marteau; // ARME EQUIPEE
      marteau.position = 0; // SUPPRESSION ANCIENNE POSITION ARME
      $(`span#${joueur.nom}Degats`).text(`${marteau.degats}`); // DEGATS ARME EQUIPEE
      $(joueur.image).remove(); // SUPPRESSION ANCIENNE IMAGE JOUEUR
      $(joueur.afficherJoueur()).prependTo($((damier)[joueur.position])); // IMAGE JOUEUR ARME EQUIPEE 
    }
  }

  // VERIFIE SI un JOUEUR a FINI son TOUR
  // TOUR SUIVANT = L'AUTRE JOUEUR
  function compteMouvementgereTour() {
    activerSon();
    mouvement++;
    if(mouvement >= 3) {
      activerSon();
      // Si tourJoueur1 = 0 (inférieur à 1) ce N'est PLUS son tour!
      if(tourJoueur1 < 1) {
        joueur1.passeSonTourAu(joueur2);
        joueur = joueur2;
        tourJoueur1++;
      // Si tourJoueur1 = 1 (supérieur à 1) c'est son tour!
      } else {
        joueur2.passeSonTourAu(joueur1);
        joueur = joueur1;
        tourJoueur1--;
      }
      mouvement = 0;
    }
  }

  // SI JOUEUR est sur une CASE ADJACENTE à l'AUTRE JOUEUR
  function verifieSiJoueurAdjacent() {
    if(joueur1.position === joueur2.position-10 || joueur1.position === joueur2.position-1 || 
      joueur1.position === joueur2.position+1 || joueur1.position === joueur2.position+10) {
      $(document).off('keydown'); // DESACTIVE L'EVENT KEYDOWN
      alert('COMBAT');
      lancerCombat();
    }
  }

  // Si JOUEUR veut STOPPER son TOUR à 0, 1 ou 2 MOUVEMENTS
  // BOUTON FIN DE TOUR ANTI-REFRESH PAGE
  $('button').click(function(e){
    e.preventDefault();
    mouvement = 3;
    activerSon();
    compteMouvementgereTour();
  })

  // DEPLACEMENTS CLAVIER
  function activeEventKeydown() {
    $(document).keydown(function(e) {
        if(bordsDroite.every(estDifferent) && !$((damier)[joueur.position+1]).hasClass('mur')) {
          // Touche clavier DROITE
          if (e.which === 39) {
            joueur.position++;
            $(joueur.image).prependTo($((damier)[joueur.position]));
            echangerArme();
            compteMouvementgereTour();
            verifieSiJoueurAdjacent();
          }
        }
        if(bordsGauche.every(estDifferent) && !$((damier)[joueur.position-1]).hasClass('mur')) {
          // Touche clavier GAUCHE
          if (e.which === 37) {
            joueur.position--;
            $(joueur.image).prependTo($((damier)[joueur.position]));
            echangerArme();
            compteMouvementgereTour();
            verifieSiJoueurAdjacent();
          }
        }
        if(bordsBas.every(estDifferent) && !$((damier)[joueur.position+10]).hasClass('mur')) {
          // Touche clavier BAS
          if (e.which === 40) {
            joueur.position = joueur.position + 10;
            $(joueur.image).prependTo($((damier)[joueur.position]));
            echangerArme();
            compteMouvementgereTour();
            verifieSiJoueurAdjacent();
          }
        }
        if(bordsHaut.every(estDifferent) && !$((damier)[joueur.position-10]).hasClass('mur')) {
          // Touche clavier HAUT
          if (e.which === 38) {
            joueur.position = joueur.position - 10;
            $(joueur.image).prependTo($((damier)[joueur.position]));
            echangerArme();
            compteMouvementgereTour();
            verifieSiJoueurAdjacent();
          }
        }
    });
  }



// ##############
// ### COMBAT ###
// ##############
  // LANCE LE MODE COMBAT
  function lancerCombat() {
    // SI JOUEUR CLIQUE SUR SLIDER = CHANGE POSITION DE COMBAT
    $('.slider').click(function(){
      alert('je change la valeur de joueur.combat');
    });
  }


});