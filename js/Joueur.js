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
    $(`${this.arme.afficherArme()}`).prependTo($(`p#${this.nom}`)); // Affiche l'image de l'arme équipée par défaut
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