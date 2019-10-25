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


  // GERE LE TIMER
  function diminuerTimer() {
      // DIMINUE DE 1 SECONDE LE TIMER GRÂCE A SA VARIABLE COMPTEUR
      compteur = Number(compteurElt.textContent); // Variable qui transforme ce "X" en Nombre
      if (compteur >= 1) {
          compteurElt.textContent = compteur - 1; // Affiche X secondes "en texte"
      } else {
        clearInterval(intervalId); // Désactive le timer pour le figer à 0 secondes
        $(document).off('keydown'); // Désactive les touches du clavier
        $('button').attr('disabled','disabled'); // Désactive les boutons
        swal('TEMPS ÉCOULÉ!', 'Refresh la page pour une nouvelle partie!', 'warning');
      }
  }

  // JOUE TEL SON A TEL MOMENT
  function jouerSon(joueur) {
    let audio;
    // SON DEPLACEMENT
    if(mouvement < MAXMOUVEMENT) {
      const audio2 = new Audio('sons/bruitdePas.mp3');
      audio = audio2;
    // SON TOUR SUIVANT
    } else if(mouvement >= MAXMOUVEMENT) {
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