// #### LEXIQUE ####
// ATH (Affichage Tête Haute) = le bloc d'informations (image, arme, vie, tour..) d'un joueur

$(document).ready(function() {

// #################
// ### 2 CLASSES ###
// #################

  // CONSTANTES de la propriété defense classe Joueur
  const enDefense = 2;
  const sansDefense = 1;

  // CLASSE JOUEUR
  class Joueur {
    constructor(nom, arme, backgroundColor) {
      this.nom = nom;
      this.sante = 100;
      this.arme = arme;
      this.defense = sansDefense;
      this.image = `img#${this.nom}`; // Id de l'image
      this.position = null;
      this.backgroundColor = backgroundColor; // Couleur de fond de l'ATH du Joueur
    }

    afficherJoueur() {
      return `<img src="images/joueurs/${this.nom}/${this.nom}_${this.arme.nom}.png" class="joueur" id="${this.nom}">`;
    }

    creationATH() {
      $(`section#${this.nom}`).css('background-color',this.backgroundColor); // Applique le backgroundColor
      $(`${this.arme.image}`).prependTo($(`p#${this.nom}`)); // Affiche l'image de l'arme équipée par défaut
      $(`span#${this.nom}Degats`).text(`${this.arme.degats}`); // Affiche les dégâts de cette arme
    }

    passeSonTourAu(joueurActif) {
      $(`p.tour#${joueurActif.nom}Tour`).text('OUI').css('color','green').addClass('OUI'); // SON TOUR
      $(`p.tour#${this.nom}Tour`).text('NON').css('color','#ef0404').removeClass('OUI'); // PAS SON TOUR (couleur rouge)
      // Si l'un des deux joueurs est mort.. Affiche FIN à la place de OUI et NON dans l'ATH des 2 joueurs
      if(joueurActif.sante <= 0 || this.sante <= 0) {
        $("p.tour").text('FIN').css('color','black').removeClass('OUI');; // FIN affiché dans l'ATH des joueurs
      }
    }

    attaquer(cible) {
      // VERIFIER SI CIBLE SE DEFEND OU NON
      if(cible.defense === enDefense) {
        jouerSon('seDefend'); // bruit bouclier frappé
        $(`section#${cible.nom} button.defense`).css('border-width','1px'); // Retirer le design du Bouton Defense
        $(`section#${this.nom} button.defense`).css('border-width','1px'); // ~ pour les deux joueurs 
      } else {
        jouerSon('attaque'); // bruit arme qui frappe
        cible.defense = sansDefense;
        }
      // SI ATTAQUANT EST EN VIE
      if(this.sante > 0) {
        cible.sante -= this.arme.degats / cible.defense; // Selon les dégâts la santé de la cible diminue
        cible.defense = sansDefense; // La cible n'est plus en défense
        $(`section#${cible.nom} .progress-bar`).css('width',`${cible.sante}%`); // Mis à jour de la barre de vie de la cible
        $(`section#${cible.nom} #sante`).text(cible.sante); // Mis à jour du nombre de point de vie dans l'ATH de la cible
        // SI CIBLE EST MORTE
        if(cible.sante <= 0) {
          jouerSon('mort'); // Bruit mort
          $(`img#${cible.nom}, section#${cible.nom} img`).css('transform','rotate(-90deg)'); // Couche les images de la cible
          alert(`${cible.nom} EST MORT ! Refresh la page pour une nouvelle partie !`);
          cible.sante = 0; // Santé mise à 0 pour ne pas afficher une santé négative
          $(`section#${cible.nom} #sante`).text(cible.sante); // ~ dans l'ATH de la cible
          compteurElt.textContent = compteur; // Affiche X secondes
          clearInterval(intervalId); // Désactive le timer pour le figer à X secondes
          tourJoueur1 = undefined; // Stop les tours (pour que les boutons de combat deviennent inactifs)
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
      this.position = null;
      }
      afficherArme() {
        return `<img class="arme" src="images/armes/${this.nom}.png" id="${this.nom}">`;
      }
  };


// ##################
// ### VARIABLES ####
// ##################

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
  // TABLEAU PLATEAU
  let damier = [];

  // RETIRE LES MURS AUTOUR DES JOUEURS ET DU MARTEAU LORS DE LEUR SPAWN
  const zoneDegageeJoueur1 = [10, 20, 30, 40, 1]; // Retire les murs Devant lui
  const zoneDegageeJoueur2 = [-10, -20, -30, -40, -1]; // Retire les murs Devant lui
  const zoneDegageeMarteau = [-1, -2, -3, -4, -5, -6, 1, 2, 3, 4, 5, 6]; // Retire les murs à sa Gauche et à sa Droite

  // VARIABLES DES JOUEURS (pour les Tours & Déplacements)
  let tourJoueur1 = 0; // Est-ce le tour du joueur1 ?
  let joueur; // Permet de gérer les 2 joueurs dans certaine fonctions

  // CREATION TIMER
  // Prend la valeur du nombre écrit dans l'index HTML <span id="compteur">nombre</span>
  let compteurElt = document.getElementById("compteur");
  // Variable qui transforme ce "nombre" en Nombre
  let compteur = Number(compteurElt.textContent);
  // Variable qui diminue de 1 seconde le timer toutes les secondes
  let intervalId = setInterval(diminuerTimer, 1000); // 1000 millisecondes

  // LISTE DES SONS DU JEU
  const audio3 = new Audio('sons/bruitAttaque.mp3');
  const audio4 = new Audio('sons/bruitDefense.mp3');
  const audio5 = new Audio('sons/bruitMort.mp3');

  // CONSTANTE du maximum de mouvement possible
  const maxMouvement = 3;


// #####################################
// ### 4 FONCTIONS D'INITIALISATION ####
// #####################################

  // GERE LES CASES ET LES MURS
  function genererPlateau() {
    // CREATION DES CASES (100 cases)
    for(let i=0; i < 100; i++) {
      $('.row').append('<div class="col-sm-1" id="'+i+'"></div>'); // Une case = une div
      damier.push('div #'+i); // Chacune est ajoutée dans le tableau damier
    };
    // GENERATION ALEATOIRE DES MURS (30% de chances pour une div de devenir un mur)
    $('.row div').each( function() { 
        if(Math.random() < 0.3) {
        $(this).addClass('mur'); // La classe mur donne à la div choisit un aspect mural
      }
    });
  }

  // GERE LE SPAWN DES JOUEURS ET DES ARMES
  function spawnAleatoire(image, min, max, type) {
    let i = ''; // L'index Position
    i = Math.floor(Math.random() * (max - min + 1)) + min; // Position aléatoire de X calculée selon sa zone de spawn (son intervalle min-max)
    // RETIRE LES MURS DEVANT LE JOUEUR 1
    if(type === 'joueur1') {
      joueur1.position = i; // Position du Joueur 1 mise à jour
      $(zoneDegageeJoueur1).each( function() {
        $((damier)[i+this]).removeClass('mur'); // Index position Joueur 1 + Index de son tableau zoneDegagee = Index des cases devant lui
      }); // ~ A qui on retire la classe mur
    }
    // RETIRE LES MURS DEVANT LE JOUEUR 2
    else if(type === 'joueur2') {
      joueur2.position = i; // Position du Joueur 2 mise à jour
      $(zoneDegageeJoueur2).each( function() {
        $((damier)[i+this]).removeClass('mur'); // Pareil
      });
    }
    // RETIRE LES MURS A GAUCHE ET A DROITE DU MARTEAU
    else if(type === 'marteau') {
      marteau.position = i; // Position du Marteau mise à jour
      $(zoneDegageeMarteau).each( function() {
        $((damier)[i+this]).removeClass('mur'); // Pareil
      });
    }
    // POSITION DU SABRE MISE A JOUR 
    else if(type === 'sabre') {
      sabre.position = i;
    }
    // POSITION DE L'EPEEXL MISE A JOUR
    else if(type === 'epeeXL') {
      epeeXL.position = i;
    }
    // AJOUT DES IMAGES DE CHACUN
    $(image).prependTo($((damier)[i])); // Sur la case/div d'index [leur Position]
    $((damier)[i]).removeClass('mur'); // Supprime les murs se trouvant sur leurs positions
  }

   // CHOISIS ALEATOIREMENT LE JOUEUR QUI JOUE LE PREMIER TOUR
  function choisisQuiCommence() {
    tourJoueur1 = Math.floor(Math.random() * 2);
    // AU 1ER TOUR Si tourJoueur1 = 0 (inférieur à 1) TOUR JOUEUR 1
    if(tourJoueur1 < 1) {
      joueur2.passeSonTourAu(joueur1);
      joueur = joueur1;
    // AU 1ER TOUR Si tourJoueur1 = 1 (supérieur à 1) TOUR JOUEUR 2
    } else {
      joueur1.passeSonTourAu(joueur2);
      joueur = joueur2;
    }
  }

  // APPELLE TOUTES LES FONCTIONS D'INITIALISATION
  function genererJeu() {
  // LE PLATEAU
    genererPlateau();
    // LE SPAWN DES JOUEURS
    spawnAleatoire(joueur1.afficherJoueur(),0,9,'joueur1');
    spawnAleatoire(joueur2.afficherJoueur(),90,99,'joueur2');
    // LE SPAWN DES ARMES
    spawnAleatoire(marteau.afficherArme(),53,56,'marteau');
    // Change 1 fois sur 2 la zone de spawn de l'epeeXL avec celle du sabre (vis versa)
    let aleatoire = Math.floor(Math.random() * 2);
    if(aleatoire < 1) {
      spawnAleatoire(epeeXL.afficherArme(),10,49,'epeeXL');
      spawnAleatoire(sabre.afficherArme(),60,89,'sabre');
    } else {
      spawnAleatoire(sabre.afficherArme(),10,49,'sabre');
      spawnAleatoire(epeeXL.afficherArme(),60,89,'epeeXL');
    }
    // LE SPAWN DES EPEES (uniquement en tant qu'image d'arme par défaut dans l'ATH des joueurs)
    spawnAleatoire(epee1.afficherArme(),0,0,'epee1');
    spawnAleatoire(epee2.afficherArme(),0,0,'epee2');
    // LA CREATION DE L'ATH DES JOUEURS
    joueur1.creationATH();
    joueur2.creationATH();
    // LE CHOIX DE QUEL JOUEUR COMMENCE LE JEU
    choisisQuiCommence();
    // L'ACTIVATION DES TOUCHES CLAVIER
    activeEventListeningKeydown();
    // L'ANNULATION DU REFRESH-PAGE POUR LES BOUTONS
    $('button').click(function(e){
      e.preventDefault();
    })
  }

  // INITIALISE LE JEU
  genererJeu();


// ####################
// ### TIMER & SON ####
// ####################

  // GERE LE TIMER
  function diminuerTimer() {
      // DIMINUE DE 1 SECONDE LE TIMER GRÂCE A SA VARIABLE COMPTEUR
      compteur = Number(compteurElt.textContent); // Variable qui transforme ce "X" en Nombre
      if (compteur >= 1) {
          compteurElt.textContent = compteur - 1; // Affiche X secondes "en texte"
      } else {
        clearInterval(intervalId); // Désactive le timer pour le figer à 0 secondes
        alert('TEMPS ECOULE! Refresh la page pour une nouvelle partie!');
        $(document).off('keydown'); // Désactive les touches du clavier
      }
  }

  // JOUE TEL SON A TEL MOMENT
  function jouerSon(joueur) {
    let audio;
    // SON DEPLACEMENT
    if(mouvement < maxMouvement) {
      const audio2 = new Audio('sons/bruitdePas.mp3');
      audio = audio2;
    // SON TOUR SUIVANT
    } else if(mouvement >= maxMouvement) {
      const audio1 = new Audio('sons/bruitTourSuivant.mp3');
      audio = audio1;
    }
    // SON ATTAQUE
    if(joueur === 'attaque') {
      audio = audio3;
    // SON DEFENSE
    } else if(joueur === 'seDefend') {
      audio = audio4;
    }
    // SON JOUEUR MORT
    if(joueur === 'mort') {
      audio = audio5;
    }
    // JOUE LE SON
    audio.play();
  }





// #################################
// ### DEPLACEMENTS & COLLISIONS ###
// #################################

// ##################
// ### VARIABLES ####
// ##################

  // NOMBRE DE MOUVEMENTS D'UN JOUEUR
  let mouvement = 0;

  // TABLEAU DES BORDS DU PLATEAU
  const bordsHaut = [0,1,2,3,4,5,6,7,8,9];
  const bordsBas = [90,91,92,93,94,95,96,97,98,99];
  const bordsDroite = [9,19,29,39,49,59,69,79,89,99];
  const bordsGauche = [-1,10,20,30,40,50,60,70,80,90];

  // TABLEAU DE L'INDEX DES CASES SE TROUVANT AUTOUR DES JOUEURS (adjacentes)
  const casesAdjacentes = [10, -10, +1, -1];


// ####################
// ### 5 FONCTIONS ####
// ####################

  // VERIFIE SI LE JOUEUR ACTIF EST SUR UNE CASE EN BORDURE DE PLATEAU OU NON (exemple: à droite)
  // Si sa position (index) est différente de l'index des cases en bordure droite du plateau
  // ~ (donc en gros il n'est pas sur l'une d'entre elles) alors il pourra se déplacer sur la case de droite
  function estDifferent(element) {
    return element !== joueur.position;
  }

  // SI UN JOUEUR SE DEPLACE SUR UNE ARME DU PLATEAU IL L'ECHANGE AVEC SON ANCIENNE ARME
  function verifieSiEchangerArme() {
    // POUR CHAQUE ARME DU JEU (tableau des armes)
    for(let i=0; i < armes.length; i++) {
      // ON VERIFIE SI LE JOUEUR EST SUR UNE CASE POSSEDANT CETTE ARME
      if(joueur.position === armes[i].position) {
        // SI C'EST LE CAS.. AR = Arme Ramassée | AD = Arme Déposée
        $(armes[i].image).prependTo($(`p#${joueur.nom}`)); // L'image de l'AR se retrouve dans l'ATH du joueur
        $(joueur.arme.image).appendTo($((damier)[joueur.position])); // L'image de l'AD se retrouve sur la case du joueur
        joueur.arme.position = armes[i].position; // La position de l'AD devient celle de la case du joueur
        joueur.arme = armes[i]; // L'AR par le joueur est ajoutée dans ses caractéristiques d'objet joueur
        armes[i].position = null; // La position de l'AR devient null
        $(`span#${joueur.nom}Degats`).text(`${armes[i].degats}`); // Les dégâts de l'AR sont affichés dans l'ATH du joueur
        $(joueur.image).remove(); // L'image de l'AR se trouvant sur le plateau est supprimée
        $(joueur.afficherJoueur()).prependTo($((damier)[joueur.position])); // L'image du joueur change selon l'AR
        i = armes.length; // FIN DE LA VERIFICATION
      }
    }
  }

  // GERE LE NOMBRE DE MOUVEMENT D'UN JOUEUR
  // ET VERIFIE SI CE JOUEUR A FINI SON TOUR (3 mouvements)
  function compteMouvementgereTour() {
    jouerSon(); // Bruit de pas
    mouvement++; // 1 mouvement de fait
    if(mouvement >= maxMouvement) {
      jouerSon(); // Bruit de cloche "ting"
      // SI tourJoueur1 = 0 (inférieur à 1) TOUR JOUEUR 2
      if(tourJoueur1 < 1) {
        joueur1.passeSonTourAu(joueur2); // Change le texte de MON TOUR dans l'ATH des joueurs en OUI ou NON
        joueur = joueur2;
        tourJoueur1++; // Ajoute 1 à tourJoueur1 pour qu'il vaille 1 et donc que ce soit au tour du Joueur 1 juste après
      // SI tourJoueur1 = 1 (supérieur à 1) TOUR JOUEUR 1
      } else {
        joueur2.passeSonTourAu(joueur1); // Pareil
        joueur = joueur1;
        tourJoueur1--; // Retire 1 à tourJoueur1 pour qu'il vaille 0 et donc que ce soit au tour du Joueur 2 juste après
      }
      mouvement = 0; // Réinitialise le nombre de mouvements pour le Joueur Actif (celui à qui c'est le tour)
    }
  }

  // SI LES JOUEURS SONT CÔTE à CÔTE (cases adjacentes)
  function verifieSiJoueurAdjacent() {
    // POUR CHAQUE CASE ADJACENTE (ex: index position Joueur 1 = 10; donc la case adjacente du bas a comme index 20.
    // ~ Si le Joueur 2 se trouve sur cette case, alors son index position sera de 20)
    $(casesAdjacentes).each( function() {
      // SI LA POSITION DU JOUEUR 1 EST EGALE A CELLE DU JOUEUR 2 DONT ON A AJOUTE A SON INDEX 10, 1, -1 ou -10
      // ~ (ex: L'index position du Joueur 2 qui vaut 20 est soustrait par -10 à un moment. Ainsi on obtient 10.
      // ~ 10 étant l'index position du Joueur 1.. cela veut dire que le Joueur 2 est sur une case adjacente du Joueur 1)
      if(joueur1.position === joueur2.position+this) {
        $(document).off('keydown'); // Désactive les touches clavier (le déplacement)
        lancerCombat(); // Lance les fonctions de combat
      }
    });
  }

  // A CHAQUE MOUVEMENT LANCE LES 3 FONCTIONS SUIVANTES
  function lancePourChaqueMouvementFonctions() {
    verifieSiEchangerArme();
    compteMouvementgereTour();
    verifieSiJoueurAdjacent();
  }


// ###########################
// ### EVENEMENT & BOUTON ####
// ###########################

  // DEPLACEMENTS GRÂCE AUX TOUCHES CLAVIER ACTIF
  function activeEventListeningKeydown() {
    $(document).keydown(function(e) {
        // On vérifie selon chaque type de déplacement si le Joueur Actif a un mur en case adjacente
        // ~ ou si il est en bord de plateau (appel de la fonction dédiée). Si ce n'est pas le cas il a le droit de se déplacer.
        if(bordsDroite.every(estDifferent) && !$((damier)[joueur.position+1]).hasClass('mur')) {
          // Touche clavier fléche DROITE
          if (e.which === 39) {
            joueur.position++; // On ajoute +1 à l'index position du Joueur Actif car les cases de gauche à droite sont croisssantes
            $(joueur.image).prependTo($((damier)[joueur.position])); // Ainsi l'image du Joueur Actif se déplace dans la case de droite à sa nouvelle position
            lancePourChaqueMouvementFonctions(); // Lance 2 fonctions de vérifications et celle qui gère les mouvements et les tours
          }
        }
        if(bordsGauche.every(estDifferent) && !$((damier)[joueur.position-1]).hasClass('mur')) {
          // Touche clavier fléche GAUCHE
          if (e.which === 37) {
            joueur.position--;
            $(joueur.image).prependTo($((damier)[joueur.position]));
            lancePourChaqueMouvementFonctions();
          }
        }
        if(bordsBas.every(estDifferent) && !$((damier)[joueur.position+10]).hasClass('mur')) {
          // Touche clavier fléche BAS
          if (e.which === 40) {
            joueur.position = joueur.position + 10;
            $(joueur.image).prependTo($((damier)[joueur.position]));
            lancePourChaqueMouvementFonctions();
          }
        }
        if(bordsHaut.every(estDifferent) && !$((damier)[joueur.position-10]).hasClass('mur')) {
          // Touche clavier fléche HAUT
          if (e.which === 38) {
            joueur.position = joueur.position - 10;
            $(joueur.image).prependTo($((damier)[joueur.position]));
            lancePourChaqueMouvementFonctions();
          }
        }
    });
  }

  // SI LE JOUEUR ACTIF VEUT PASSER SON TOUR EN NE FAISANT QUE 0, 1 ou 2 MOUVEMENTS
  // IL SUFFIT DE CLIQUER SUR LE BOUTON FINTOUR
  $('#finTour').click(function(e){
    mouvement = maxMouvement; // Le nombre de mouvements du Joueur qui clique devient 3 pour que le tour soit passé
    jouerSon();
    compteMouvementgereTour(); // Appelle la fonction gère tours pour les déplacements
  })



// ##############
// ### COMBAT ###
// ##############

// ####################
// ### 3 FONCTIONS ####
// ####################

  // INITIALISE LE MODE COMBAT
  function lancerCombat() {
    alert('!!! COMBAT A MORT !!!');
    gereTourCombat(); // Lance la nouvelle fonction qui gère les tours

    // BOUTON FINTOUR REINITIALISÉ POUR LE COMBAT
    // SI LE JOUEUR ACTIF VEUT JUSTE PASSER SON TOUR IL LE PEUT
    $('button #finTour').click(function(e){
        jouerSon(); // Bruit cloche "ting"
        gereTourCombat(); // Appelle la fonction gère tours pour le combat
    })
  }

  // GERE LES TOURS AVEC UN APPEL DE LA FONCTION AttaqueOuDefense A LA PLACE DES MOUVEMENTS
  function gereTourCombat() {
      // SI tourJoueur1 = 0 au départ TOUR JOUEUR 1
      if(tourJoueur1 < 1) { // tourJoueur1 vaut 0 au début
        joueur2.passeSonTourAu(joueur1); // Change le texte de MON TOUR dans l'ATH des joueurs en OUI ou NON
        AttaqueOuDefense(); // Demande au joueur 2 de choisir si il attaque ou se défend
        tourJoueur1++; // mais il vaudra 1 pour la fonction et pour passer de tour
      // SI tourJoueur1 = 1 au départ TOUR JOUEUR 2
      } else { // l'inverse se produit
        joueur1.passeSonTourAu(joueur2);
        AttaqueOuDefense();
        tourJoueur1--;
      }
  }

  // GERE SELON LE JOUEUR ACTIF, SON CHOIX DE COMBAT GRÂCE A DES BOUTONS ATTAQUE OU DEFENSE
  function AttaqueOuDefense() {
    // JOUEUR 1 - BOUTON ATTAQUE
    $('section#joueur1 button.attaque').click(function(e){
      if(tourJoueur1 >= 1) {
        joueur1.defense = sansDefense; // Retire la défense du joueur1
        joueur1.attaquer(joueur2); // Attaque le joueur2
        gereTourCombat(); // Fin du tour du joueur1
      }
    })
    // JOUEUR 1 - BOUTON DEFENSE
    $('section#joueur1 button.defense').click(function(e){
      if(tourJoueur1 >= 1) {
        $("section#joueur1 button.defense").css('border-width','5px'); // Bouton design activée
        joueur1.defense = enDefense; // Se défend contre le prochain coup
        gereTourCombat(); // Fin du tour du joueur1
      }
    })
    // JOUEUR 2 - BOUTON ATTAQUE
    $('section#joueur2 button.attaque').click(function(e){
      if(tourJoueur1 < 1) {
        joueur2.defense = sansDefense; // Pareil
        joueur2.attaquer(joueur1); // Pareil
        gereTourCombat(); // Pareil
      }
    })
    // JOUEUR 2  - BOUTON DEFENSE
    $('section#joueur2 button.defense').click(function(e){
      if(tourJoueur1 < 1) {
        $("section#joueur2 button.defense").css('border-width','5px');  // Pareil
        joueur2.defense = enDefense; // Pareil
        gereTourCombat(); // Pareil
      }
    })
  }

});