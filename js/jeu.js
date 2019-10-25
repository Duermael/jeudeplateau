// ATH (Affichage Tête Haute) = le bloc d'informations (image, arme, vie, tour..) d'un joueur

// CONSTANTES de la propriété defense classe Joueur
const ENDEFENSE = 2;
const SANSDEFENSE = 1;

// CLASSE JOUEUR
class Joueur {
  constructor(nom, prenom, arme, backgroundColor, min, max, ZoneDegagee) {
    this.nom = nom; // exemple: joueur1
    this.prenom = prenom; // JOUEUR 1
    this.sante = 100;
    this.arme = arme;
    this.defense = SANSDEFENSE;
    this.image = `img#${this.nom}`; // Id de l'image
    this.position = null;
    this.mouvement = 0;
    this.backgroundColor = backgroundColor; // Couleur de fond de l'ATH du Joueur
    this.min = min; // Intervalle de la zone de spawn des joueurs
    this.max = max; // Intervalle de la zone de spawn des joueurs
    this.ZoneDegagee = ZoneDegagee;
    this.casesAdjacentes = [10, -10, +1, -1];
  }

  afficherJoueur() {
    return `<img src="images/joueurs/${this.nom}/${this.nom}_${this.arme.nom}.png" class="joueur" id="${this.nom}">`;
  }

  spawnAleatoireJoueur() {
    let i = ''; // L'index Position
    // Position aléatoire d'une arme calculée selon sa zone de spawn (son intervalle min-max)
    i = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    // POSITION DU JOUEUR INITIALISEE
    this.position = i;
    // Zones dégagées des joueurs (devant eux) et supprime les murs se trouvant sur leur position
    $(this.ZoneDegagee).each( function() {
        $((plateau.cases)[i+this]).removeClass('mur');
    });
    // AJOUT DE L'IMAGE DU JOUEUR SUR SA CASE POSITION
    $(this.afficherJoueur()).prependTo($((plateau.cases)[i]));
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
  constructor(nom, degats, min, max, ZoneDegagee) {
    this.nom = nom;
    this.degats = degats;
    this.image = `img#${this.nom}`;
    this.position = null;
    this.min = min; // Intervalle de la zone de spawn des armes
    this.max = max; // Intervalle de la zone de spawn des armes
    this.ZoneDegagee = ZoneDegagee;
  }

  afficherArme() {
    return `<img class="arme" src="images/armes/${this.nom}.png" id="${this.nom}">`;
  }

  spawnAleatoireArme() {
    let i = '';
    i = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    // POSITION DE L'ARME INITIALISEE
    this.position = i;
    // Zone dégagée du marteau (gauche et droite) et supprime les murs se trouvant sur la position de chaque arme
    $(this.ZoneDegagee).each( function() {
      $((plateau.cases)[i+this]).removeClass('mur');
    });
    // AJOUT DE L'IMAGE DE L'ARME SUR SA CASE POSITION
    $(this.afficherArme()).prependTo($((plateau.cases)[i]));
  }
};


// CLASSE PLATEAU
class Plateau {
  constructor() {
    this.taille = 100;
    this.cases = [];
    this.bordsHaut = [0,1,2,3,4,5,6,7,8,9];
    this.bordsBas = [90,91,92,93,94,95,96,97,98,99];
    this.bordsDroite = [9,19,29,39,49,59,69,79,89,99];
    this.bordsGauche = [-1,10,20,30,40,50,60,70,80,90];
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
      this.spawnAleatoireArme();
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
};


// CREATION OBJETS ARMES
const epee1 = new Arme('epee1', 10, 0, 0, [0]);
const epee2 = new Arme('epee2', 10, 0, 0, [0]);
const marteau = new Arme('marteau', 25, 53, 56, [0, -1, -2, -3, -4, -5, -6, 1, 2, 3, 4, 5, 6]);
const epeeXL = new Arme('epeeXL', 20, 10, 49, [0]);
const sabre = new Arme('sabre', 15, 60, 89, [0]);
// TABLEAU ARMES
const armes = [epee1, epee2, marteau, epeeXL, sabre];
// CREATION OBJETS JOUEURS
const joueur1 = new Joueur('joueur1', 'JOUEUR 1', epee1, 'skyblue', 0, 9, [0, 10, 20, 30, 40, 1]);
const joueur2 = new Joueur('joueur2', 'JOUEUR 2', epee2, 'burlywood', 89, 99, [0, -10, -20, -30, -40, -1]);
// CREATION OBJET PLATEAU
const plateau = new Plateau();
// CREATION OBJET JEU
const jeu = new Jeu();

// VARIABLES DES JOUEURS (pour les Tours & Déplacements)
let tourJoueur1 = 0; // Est-ce le tour du joueur1 ?
let joueur; // Permet de gérer les 2 joueurs dans certaine fonctions
// CONSTANTE du maximum de mouvement possible
const MAXMOUVEMENT = 3;


// INITIALISE LE JEU
jeu.genererJeu();