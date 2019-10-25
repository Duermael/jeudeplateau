// CLASSE JEU
class Jeu {

  choisisQuiCommence() {
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

  genererJeu() {
    // LA CREATION DU PLATEAU
    plateau.genererPlateau();
    // SPAWN DES ARMES
    $(armes).each( function() {
      // PAS DE SPAWN POUR LES ARMES PAR DEFAUT
      if(this !== epee1 & this !== epee2) {
        this.spawnAleatoireArme();
      }
    });
    // SPAWN DES JOUEURS
    joueur1.spawnAleatoireJoueur();
    joueur2.spawnAleatoireJoueur();
    // LA CREATION DE L'ATH DES JOUEURS
    joueur1.creationATH();
    joueur2.creationATH();
    // LE CHOIX DE QUEL JOUEUR COMMENCE LE JEU
    jeu.choisisQuiCommence();
    // L'ANNULATION DU REFRESH-PAGE POUR LES BOUTONS
    $('button').on("click", function(e){
      e.preventDefault();
    })
  }

  // DEPLACEMENTS GRÂCE AUX TOUCHES CLAVIER ACTIF
  activeEventListeningKeydown() {
    $(document).on("keydown", function(e) {
      // On vérifie selon chaque type de déplacement si le Joueur Actif a un mur en case adjacente
      // ~ ou si il est en bord de plateau (appel de la fonction dédiée). Si ce n'est pas le cas il a le droit de se déplacer.
      if(plateau.bordsDroite.every(estDifferent) && !$((plateau.cases)[joueur.position+1]).hasClass('mur')) {
        // Touche clavier fléche DROITE
        if (e.which === 39) {
          joueur.position++; // On ajoute +1 à l'index position du Joueur Actif car les cases de gauche à droite sont croisssantes
          $(joueur.image).prependTo($((plateau.cases)[joueur.position])); // Ainsi l'image du Joueur Actif se déplace dans la case de droite à sa nouvelle position
          lancePourChaqueMouvementFonctions(); // Lance 2 fonctions de vérifications et celle qui gère les joueur.mouvements et les tours
        }
      }
      if(plateau.bordsGauche.every(estDifferent) && !$((plateau.cases)[joueur.position-1]).hasClass('mur')) {
        // Touche clavier fléche GAUCHE
        if (e.which === 37) {
          joueur.position--;
          $(joueur.image).prependTo($((plateau.cases)[joueur.position]));
          lancePourChaqueMouvementFonctions();
        }
      }
      if(plateau.bordsBas.every(estDifferent) && !$((plateau.cases)[joueur.position+10]).hasClass('mur')) {
        // Touche clavier fléche BAS
        if (e.which === 40) {
          joueur.position = joueur.position + 10;
          $(joueur.image).prependTo($((plateau.cases)[joueur.position]));
          lancePourChaqueMouvementFonctions();
        }
      }
      if(plateau.bordsHaut.every(estDifferent) && !$((plateau.cases)[joueur.position-10]).hasClass('mur')) {
        // Touche clavier fléche HAUT
          if (e.which === 38) {
          joueur.position = joueur.position - 10;
          $(joueur.image).prependTo($((plateau.cases)[joueur.position]));
          lancePourChaqueMouvementFonctions();
        }
      }
    });
  }
};