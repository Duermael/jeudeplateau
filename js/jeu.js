// ATH (Affichage Tête Haute) = le bloc d'informations (image, arme, vie, tour..) d'un joueur

  // CONSTANTES de la propriété defense classe Joueur
  const ENDEFENSE = 2;
  const SANSDEFENSE = 1;

  // CLASSE JOUEUR
  class Joueur {
    constructor(nom, prenom, arme, backgroundColor) {
      this.nom = nom; // exemple: joueur1
      this.prenom = prenom; // JOUEUR 1
      this.sante = 100;
      this.arme = arme;
      this.defense = SANSDEFENSE;
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
        $("p.tour").text('FIN').css('color','black').removeClass('OUI'); // FIN affiché dans l'ATH des joueurs
      }
    }

    attaquer(cible) {
      // VERIFIER SI CIBLE SE DEFEND OU NON
      if(cible.defense === ENDEFENSE) {
        jouerSon('seDefend'); // bruit bouclier frappé
        $(`section#${cible.nom} button.defense`).css('border-width','1px'); // Retirer le design du Bouton Defense
        $(`section#${this.nom} button.defense`).css('border-width','1px'); // ~ pour les deux joueurs 
      } else {
        jouerSon('attaque'); // bruit arme qui frappe
        cible.defense = SANSDEFENSE;
        }
      // SI ATTAQUANT EST EN VIE
      if(this.sante > 0) {
        cible.sante -= this.arme.degats / cible.defense; // Selon les dégâts la santé de la cible diminue
        cible.defense = SANSDEFENSE; // La cible n'est plus en défense
        $(`section#${cible.nom} .progress-bar`).css('width',`${cible.sante}%`); // Mis à jour de la barre de vie de la cible
        $(`section#${cible.nom} #sante`).text(cible.sante); // Mis à jour du nombre de point de vie dans l'ATH de la cible
        // SI CIBLE EST MORTE
        if(cible.sante <= 0) {
          jouerSon('mort'); // Bruit mort
          $(`img#${cible.nom}, section#${cible.nom} img`).css('transform','rotate(-90deg)'); // Couche les images de la cible
          cible.sante = 0; // Santé mise à 0 pour ne pas afficher une santé négative
          $(`section#${cible.nom} #sante`).text(cible.sante); // ~ dans l'ATH de la cible
          compteurElt.textContent = compteur; // Affiche X secondes
          clearInterval(intervalId); // Désactive le timer pour le figer à X secondes
          $('button').attr('disabled','disabled'); // Désactive les boutons de combat
          swal(`LE ${cible.prenom} EST MORT !`, `Refresh la page pour une nouvelle partie !`, 'error'); // Utilisation de swal() pour des alert magnifiques
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

  // CREATION OBJETS ARMES
  const epee1 = new Arme('epee1', 10);
  const epee2 = new Arme('epee2', 10);
  const marteau = new Arme('marteau', 25);
  const epeeXL = new Arme('epeeXL', 20);
  const sabre = new Arme('sabre', 15);
  // TABLEAU ARMES
  const armes = [epee1, epee2, marteau, epeeXL, sabre];
  // CREATION OBJETS JOUEURS
  const joueur1 = new Joueur('joueur1', 'JOUEUR 1', epee1, 'skyblue');
  const joueur2 = new Joueur('joueur2', 'JOUEUR 2', epee2, 'burlywood');
  // TABLEAU PLATEAU
  let damier = [];

  // RETIRE LES MURS AUTOUR DES JOUEURS ET DU MARTEAU LORS DE LEUR SPAWN
  const zoneDegageeJoueur1 = [10, 20, 30, 40, 1]; // Retire les murs Devant lui
  const zoneDegageeJoueur2 = [-10, -20, -30, -40, -1]; // Retire les murs Devant lui
  const zoneDegageeMarteau = [-1, -2, -3, -4, -5, -6, 1, 2, 3, 4, 5, 6]; // Retire les murs à sa Gauche et à sa Droite

  // VARIABLES DES JOUEURS (pour les Tours & Déplacements)
  let tourJoueur1 = 0; // Est-ce le tour du joueur1 ?
  let joueur; // Permet de gérer les 2 joueurs dans certaine fonctions

  // CONSTANTE du maximum de mouvement possible
  const MAXMOUVEMENT = 3;


  // GENERE LES CASES ET LES MURS
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
    // L'ANNULATION DU REFRESH-PAGE POUR LES BOUTONS
    $('button').on("click", function(e){
      e.preventDefault();
    })
  }

  // INITIALISE LE JEU
  genererJeu();