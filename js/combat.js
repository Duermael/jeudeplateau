  // INITIALISE LE MODE COMBAT
  function lancerCombat() {    
    // BOUTON FINTOUR DESACTIVÉ ET TEXTE MODIFIÉ
    $('button#finTour').attr('disabled','disabled').text('ATTAQUE OU DEFENDS TOI');
    // ALERT MAGNIFIQUE AVEC DEUX BOUTONS AU CHOIX
    swal({
      title: "COMBAT A MORT",
      text: "aucune fuite possible",
      icon: "success",
      buttons: ["ANNULER", "OK"],
    })
    // Promise() then utilisée pour être sûr que la fonction précédente swal soit bien réalisée avant
    // ~ celle-ci nommée ok. Si ok est passée en promise() alors selon le bouton cliqué...
    .then((ok) => { 
      // SI BOUTON OK (fonction ok a un lien avec le bouton ok de base)
      if(ok) {
        swal("GENIAL", "Que le meilleur gagne !!", "success");
      // SI BOUTON ANNULER
      } else {
        swal("T'as essayé d'annuler?", "Dommage pour toi ça marche pas comme ça !", "error");
      }
    });
    // Lance la fonction gère tour spécifique aux combats
    gereTourCombat();
  }

  // GERE LES TOURS AVEC UN APPEL DE LA FONCTION AttaqueOuDefense A LA PLACE DES MOUVEMENTS
  function gereTourCombat() {
    // SI tourJoueur1 = 0 au départ TOUR JOUEUR 1
    if(tourJoueur1 < 1) { // tourJoueur1 vaut 0 au début
      joueur2.passeSonTourAu(joueur1); // Change le texte de MON TOUR dans l'ATH des joueurs en OUI ou NON
      AttaqueOuDefense(); // Demande au joueur 2 de choisir si il attaque ou se défend
      tourJoueur1++; // mais il vaudra 1 pour la fonction et pour passer de tour
    } else {
      joueur1.passeSonTourAu(joueur2);
      AttaqueOuDefense();
      tourJoueur1--;
    }
  }

  // GERE SELON LE JOUEUR ACTIF, SON CHOIX DE COMBAT GRÂCE A DES BOUTONS ATTAQUE OU DEFENSE
  function AttaqueOuDefense() {
    // JOUEUR 1 - BOUTON ATTAQUE
    $('section#joueur1 button.attaque').on("click", function(e){
      if(tourJoueur1 >= 1) {
        joueur1.defense = SANSDEFENSE; // Retire la défense du joueur1
        joueur1.attaquer(joueur2); // Attaque le joueur2
        gereTourCombat(); // Fin du tour du joueur1
      }
    })
    // JOUEUR 1 - BOUTON DEFENSE
    $('section#joueur1 button.defense').on("click", function(e){
      if(tourJoueur1 >= 1) {
        $("section#joueur1 button.defense").css('border-width','5px'); // Bouton design activée
        joueur1.defense = ENDEFENSE; // Se défend contre le prochain coup
        gereTourCombat();
      }
    })
    // JOUEUR 2 - BOUTON ATTAQUE
    $('section#joueur2 button.attaque').on("click", function(e){
      if(tourJoueur1 < 1) {
        joueur2.defense = SANSDEFENSE;
        joueur2.attaquer(joueur1);
        gereTourCombat();
      }
    })
    // JOUEUR 2  - BOUTON DEFENSE
    $('section#joueur2 button.defense').on("click", function(e){
      if(tourJoueur1 < 1) {
        $("section#joueur2 button.defense").css('border-width','5px');
        joueur2.defense = ENDEFENSE;
        gereTourCombat();
      }
    })
  }