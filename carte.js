$(document).ready(function() {

  // CLASSE JOUEUR
  class Joueur {
    constructor(nom, arme, backgroundColor) {
      this.nom = nom;
      this.sante = 100;
      this.arme = arme;
      this.defense = 1;
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
      $(`span#${this.nom}Degats`).text(`${this.arme.degats}`); // DEGATS ARME EQUIPEE
    }
    passeSonTourAu(joueurActif) {
      $(`p.tour#${joueurActif.nom}Tour`).text('OUI').css('color','green').addClass('OUI');
      $(`p.tour#${this.nom}Tour`).text('NON').css('color','#ef0404').removeClass('OUI'); //rouge
    }
    attaquer(cible) {
      // VERIFIER SI CIBLE SE DEFEND
      if(cible.defense !== 2) {
        combat = 1; // POUR BRUIT ARME
        activerSon(); // BRUIT ARME
        cible.defense = 1;
      } else {
        combat = 0; // POUR BRUIT BOUCLIER
        activerSon(); // BRUIT BOUCLIER
        $(`section#${cible.nom} button.defense`).css('border-width','1px'); // DEFENSE DESACTIVEE ATH
        $(`section#${this.nom} button.defense`).css('border-width','1px'); // DEFENSE DESACTIVEE ATH
      }
      // SI ATTAQUANT EST EN VIE
      if(this.sante > 0) {
        cible.sante -= this.arme.degats / cible.defense; // SELON DEGATS = SANTE DIMINUE
        cible.defense = 1;
        $(`section#${cible.nom} .progress-bar`).css('width',`${cible.sante}%`); // BARRE DE VIE
        $(`section#${cible.nom} #sante`).text(cible.sante); // TEXTE SANTE
        // SI CIBLE EST MORTE
        if(cible.sante <= 0) {
          activerSon('mort'); // BRUIT MORT
          alert(`${cible.nom} a perdu ! Refresh la page pour une nouvelle partie !`);
          cible.sante = 0; // PAS DE SANTE NEGATIF
          $(`section#${cible.nom} #sante`).text(cible.sante); // TEXTE SANTE
          compteurElt.textContent = compteur; // FIGE TIMER
          clearInterval(intervalId); // FIN TIMER
          tourJoueur1 = undefined; // FIN TOURS
          $('div#finTour').html('<button name="button">PARTIE TERMINEE !</button>'); // FIN BOUTON
          $('script').remove(); // FIN JEU
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
      this.position = undefined;
      }
      afficherArme() {
        return `<img class="arme" src="images/armes/${this.nom}.png" id="${this.nom}">`;
      }
  };

  // CREATION ARMES
  const epee1 = new Arme('epee1', 10);
  const epee2 = new Arme('epee2', 10);
  const marteau = new Arme('marteau', 25);
  const epeeXL = new Arme('epeeXL', 20);
  const sabre = new Arme('sabre', 15);
  // TABLEAU ARME
  const armes = [epee1, epee2, marteau, epeeXL, sabre];
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
    // MIS A JOUR POSITION
    else if(type === 'sabre') {
      sabre.position = i;
    }
    // MIS A JOUR POSITION
    else if(type === 'epeeXL') {
      epeeXL.position = i;
    }
    // SPAWN JOUEURS ARMES
    $(image).prependTo($((damier)[i]));
    $((damier)[i]).removeClass('mur');
  }

  let compteurElt = document.getElementById("compteur");
  let compteur = Number(compteurElt.textContent);

// DIMINUE LE TIMER
function diminuerCompteur() {
    // ATH TIMER DIMINUE DE 1
    compteur = Number(compteurElt.textContent);
    if (compteur > 1) {
        compteurElt.textContent = compteur - 1;
    } else {
      compteurElt.textContent = compteur - 1; // 0
      clearInterval(intervalId); // FIN TIMER
      alert('TEMPS ECOULE! Refresh la page pour une nouvelle partie!');
      $('script').remove(); // FIN JEU
    }
}
    // Diminue de 1 seconde le timer toutes les secondes
    let intervalId = setInterval(diminuerCompteur, 1000); // 1000 millisecondes


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
    // BOUTONS ANTI-REFRESH PAGE
    $('button').click(function(e){
      e.preventDefault();
    })
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
  // COLLISIONS JOUEUR
  const casesAdjacentes = [10, -10, +1, -1];

  // SON FIN DE TOUR et SON MOUVEMENTS
  function activerSon(bruit) {
    let audio;
    // SONSMOUVEMENT et SON TOUR SUIVANT
    if(mouvement < 3) {
      const audio2 = new Audio('sons/bruitdePas.mp3');
      audio = audio2;
    } else if(mouvement >= 3) {
      const audio1 = new Audio('sons/bruitTourSuivant.mp3');
      audio = audio1;
    }
    // SONS COMBAT
    if(combat === 1) {
      const audio3 = new Audio('sons/bruitCombat.mp3');
      audio = audio3;
    } else if(combat === 0) {
      const audio4 = new Audio('sons/bruitDefense.mp3');
      audio = audio4;
    }
    // SON MORT
    if(bruit === 'mort') {
      const audio5 = new Audio('sons/bruitMort.mp3');
      audio = audio5;
    }
    audio.play(); // JOUE LE SON
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

  // SI JOUEUR PASSE SUR ARME il LA RAMASSE et DEPOSE SON ANCIENNE ARME
  function verifieSiEchangerArme() {
    for(let i=0; i < armes.length; i++) {
      if(joueur.position === armes[i].position) {
        $(armes[i].image).prependTo($(`p#${joueur.nom}`)); // ARME RAMASSEE IMAGE ATH
        $(joueur.arme.image).appendTo($((damier)[joueur.position])); // ARME DEPOSEE IMAGE
        joueur.arme.position = armes[i].position; // POSITION ARME DEPOSEE
        joueur.arme = armes[i]; // ARME EQUIPEE
        armes[i].position = undefined; // SUPPRESSION ANCIENNE POSITION ARME
        $(`span#${joueur.nom}Degats`).text(`${armes[i].degats}`); // DEGATS ARME EQUIPEE ATH
        $(joueur.image).remove(); // SUPPRESSION ANCIENNE IMAGE JOUEUR
        $(joueur.afficherJoueur()).prependTo($((damier)[joueur.position])); // IMAGE JOUEUR EQUIPEE
        i = armes.length; // FIN DE LA VERIFICATION
      }
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
    $(casesAdjacentes).each( function() {
      if(joueur1.position === joueur2.position+this) {
        $(document).off('keydown'); // DESACTIVE L'EVENT KEYDOWN
        alert('COMBAT');
        lancerCombat();
      }
    });
  }

  // A CHAQUE MOUVEMENT VERIFIE LES 3 FONCTIONS SUIVANTES
  function pourChaqueMouvement() {
    verifieSiEchangerArme();
    compteMouvementgereTour();
    verifieSiJoueurAdjacent();
  }

  // Si JOUEUR veut STOPPER son TOUR à 0, 1 ou 2 MOUVEMENTS
  // BOUTON FIN DE TOUR pour MOUVEMENTS
  $('button#finTour').click(function(e){
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
            pourChaqueMouvement();
          }
        }
        if(bordsGauche.every(estDifferent) && !$((damier)[joueur.position-1]).hasClass('mur')) {
          // Touche clavier GAUCHE
          if (e.which === 37) {
            joueur.position--;
            $(joueur.image).prependTo($((damier)[joueur.position]));
            pourChaqueMouvement();
          }
        }
        if(bordsBas.every(estDifferent) && !$((damier)[joueur.position+10]).hasClass('mur')) {
          // Touche clavier BAS
          if (e.which === 40) {
            joueur.position = joueur.position + 10;
            $(joueur.image).prependTo($((damier)[joueur.position]));
            pourChaqueMouvement();
          }
        }
        if(bordsHaut.every(estDifferent) && !$((damier)[joueur.position-10]).hasClass('mur')) {
          // Touche clavier HAUT
          if (e.which === 38) {
            joueur.position = joueur.position - 10;
            $(joueur.image).prependTo($((damier)[joueur.position]));
            pourChaqueMouvement();
          }
        }
    });
  }



// ##############
// ### COMBAT ###
// ##############
  let combat = undefined;
  // LANCE LE MODE COMBAT
  function lancerCombat() {
    combat = 1;
    gereTourCombat();
    // BOUTON FIN DE TOUR pour COMBAT
    $('button #finTour').click(function(e){
        activerSon();
        gereTourCombat();
    })
  }

  function gereTourCombat() {
    console.log(tourJoueur1);
      // Si tourJoueur1 = 0 (inférieur à 1) ce N'est PLUS son tour!
      if(tourJoueur1 < 1) {
        joueur1.passeSonTourAu(joueur2);
        AttaqueOuDefense();
        tourJoueur1++;
      // Si tourJoueur1 = 1 (supérieur à 1) c'est son tour!
      } else {
        joueur2.passeSonTourAu(joueur1);
        AttaqueOuDefense();
        tourJoueur1--;
      }
  }

  // SELON le BOUTON CLIQUE PAR le JOUEUR ACTIF = ATTAQUE OU DEFENSE
  function AttaqueOuDefense() {
    // JOUEUR2
    $('section#joueur2 button.attaque').click(function(e){
      if(tourJoueur1 >= 1) {
        joueur2.defense = 1; // SUPPRIME DEFENSE JOUEUR 2
        joueur2.attaquer(joueur1); // JOUEUR 2 ATTAQUE
        gereTourCombat(); // FIN TOUR
      }
    })
    $('section#joueur2 button.defense').click(function(e){
      if(tourJoueur1 >= 1) {
        $("section#joueur2 button.defense").css('border-width','5px'); // DEFENSE ACTIVEE ATH JOUEUR 2
        joueur2.defense = 2; // JOUEUR 2 SE DEFEND POUR LE PROCHAIN COUP
        gereTourCombat(); // FIN TOUR
      }
    })
    // JOUEUR 1
    $('section#joueur1 button.attaque').click(function(e){
      if(tourJoueur1 < 1) {
        joueur1.defense = 1; // SUPPRIME DEFENSE JOUEUR 1
        joueur1.attaquer(joueur2); // JOUEUR 1 ATTAQUE
        gereTourCombat();
      }
    })
    $('section#joueur1 button.defense').click(function(e){
      if(tourJoueur1 < 1) {
        $("section#joueur1 button.defense").css('border-width','5px'); // DEFENSE ACTIVEE ATH JOUEUR 1
        joueur1.defense = 2; // JOUEUR 1 SE DEFEND POUR LE PROCHAIN COUP
        gereTourCombat();
      }
    })
  }

});