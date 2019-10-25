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