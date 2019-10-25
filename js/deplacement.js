// L'ACTIVATION DES TOUCHES CLAVIER
activeEventListeningKeydown();

  // NOMBRE DE MOUVEMENTS D'UN JOUEUR
  let mouvement = 0;

  // TABLEAU DES BORDS DU PLATEAU
  const bordsHaut = [0,1,2,3,4,5,6,7,8,9];
  const bordsBas = [90,91,92,93,94,95,96,97,98,99];
  const bordsDroite = [9,19,29,39,49,59,69,79,89,99];
  const bordsGauche = [-1,10,20,30,40,50,60,70,80,90];

  // TABLEAU DE L'INDEX DES CASES SE TROUVANT AUTOUR DES JOUEURS (adjacentes)
  const casesAdjacentes = [10, -10, +1, -1];


  // VERIFIE SI LE JOUEUR ACTIF EST SUR UNE CASE EN BORDURE DE PLATEAU OU NON (ex: à droite)
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
    if(mouvement >= MAXMOUVEMENT) {
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
    // Ex: index position Joueur 1 = 10; case adjacente du bas = index 20
    $(casesAdjacentes).each( function() {
      // On ajoute +10, +1, -1 et -10 à la position du Joueur 2 pour qu'elle soit égale aux cases adjacentes du Joueur 1
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

  // DEPLACEMENTS GRÂCE AUX TOUCHES CLAVIER ACTIF
  function activeEventListeningKeydown() {
    $(document).on("keydown", function(e) {
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
  $('#finTour').on("click", function(e){
    mouvement = MAXMOUVEMENT; // Le nombre de mouvements du Joueur qui clique devient 3 pour que le tour soit passé
    jouerSon();
    compteMouvementgereTour(); // Appelle la fonction gère tours pour les déplacements
  })