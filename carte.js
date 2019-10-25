$(document).ready(function() {

	class Joueur {
  	  	constructor(nom, sante) {
    		this.nom = nom;
    		this.sante = sante;
  	  	}
  	  	afficherJoueur() {
  	  		return `<img src="images/joueurs/visuel/${this.nom}_epee.png">`;
  	  	}
  	};

  	class Arme {
  	  	constructor(nom, degats) {
    		this.nom = nom;
    		this.degats = degats;
  	  	}
  	  	afficherArme() {
  	  		return `<img src="images/armes/${this.nom}.png">`;
  	  	}
  	};

 	const joueur1 = new Joueur('joueur1', 100);
  const joueur2 = new Joueur('joueur2', 100);

  const epee = new Arme('epee', 10);
  const marteau = new Arme('marteau', 25);
  const epeeXL = new Arme('epeeXL', 20);
  const sabre = new Arme('sabre', 15);

  $('.row div').each( function() { 
  		if(Math.random() < 0.3) {
			$(this).addClass('mur');
		}
	});

  	function spawnAleatoire(image) {
		let i = Math.floor(Math.random() * $('.row div').length);
		// SUPPRIMER MUR  $('.row div')[i].removeClass('mur');  POURQUOI CA NE MARCHE PAS ?
		$(image).prependTo($('.row div')[i]);
	}

	spawnAleatoire(joueur1.afficherJoueur());
	spawnAleatoire(joueur2.afficherJoueur());

	spawnAleatoire(marteau.afficherArme());
	spawnAleatoire(epeeXL.afficherArme());
	spawnAleatoire(sabre.afficherArme());

});