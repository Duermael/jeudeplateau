// Le programme commence dès l'ouverture du site web.
$(document).ready(function() {

  // Classe Joueur avec nom, santé, et arme en main
  class Joueur {
      constructor(nom) {
      this.nom = nom;
      this.sante = 100;
      this.arme = 'epee';
      }
      afficherJoueur() {
        return `<img src="images/joueurs/visuel/${this.nom}_epee.png" id="${this.nom}">`;
      }
  };

  // Classe Arme avec nom et nombre de dégâts
  class Arme {
      constructor(nom, degats) {
      this.nom = nom;
      this.degats = degats;
      }
      afficherArme() {
        return `<img src="images/armes/${this.nom}.png">`;
      }
  };

  // Création des différents joueurs
  const joueur1 = new Joueur('joueur1');
  const joueur2 = new Joueur('joueur2');
  // Création des différentes armes
  const epee = new Arme('epee', 10);
  const marteau = new Arme('marteau', 25);
  const epeeXL = new Arme('epeeXL', 20);
  const sabre = new Arme('sabre', 15);

  // Tableau des divs avec id différents
  let divs = []; //['div #1','div #2',...]




  // Génération des divs et du tableau divs avec id différents
  for(let i=0; i < 100; i++) {
    $('.row').append('<div class="col-sm-1" id="'+i+'"></div>');
    divs.push('div #'+i);
  };

  // Génération aléatoire des murs sur le plateau
  $('.row div').each( function() { 
      if(Math.random() < 0.3) {
      $(this).addClass('mur');
    }
  });

// Index i des joueurs pour les déplacer
let iJoueur1 ='';
let iJoueur2 ='';

  function spawnAleatoire(image, min, max, type) {
    let i = '';
    i = Math.floor(Math.random() * (max - min + 1)) + min;
  
    // Permet d'empêcher que les joueurs soient bloqués
    if(type === 'joueur1') {
      let chemin1 = $((divs)[i+10]);
      let chemin2 = $((divs)[i+20]);
      let chemin3 = $((divs)[i+30]);
      let chemin4 = $((divs)[i+40]);
      let chemin5 = $((divs)[i+1]);
      $(chemin1).removeClass('mur');
      $(chemin2).removeClass('mur');
      $(chemin3).removeClass('mur');
      $(chemin4).removeClass('mur');
      $(chemin5).removeClass('mur');
      iJoueur1 = i;
    }
    else if(type === 'joueur2') {
      let chemin1 = $((divs)[i-10]);
      let chemin2 = $((divs)[i-20]);
      let chemin3 = $((divs)[i-30]);
      let chemin4 = $((divs)[i-40]);
      let chemin5 = $((divs)[i-1]);
      $(chemin1).removeClass('mur');
      $(chemin2).removeClass('mur');
      $(chemin3).removeClass('mur');
      $(chemin4).removeClass('mur');
      $(chemin5).removeClass('mur');
      iJoueur2 = i;
    }
    else if(type === 'marteau') {
      let chemin1 = $((divs)[i-1]);
      let chemin2 = $((divs)[i-2]);
      let chemin3 = $((divs)[i+1]);
      let chemin4 = $((divs)[i+2]);
      $(chemin1).removeClass('mur');
      $(chemin2).removeClass('mur');
      $(chemin3).removeClass('mur');
      $(chemin4).removeClass('mur');
    }

    // Permet de ne pas avoir une arme sur un joueur dès le départ ?????
    $(image).prependTo($((divs)[i]));
    $((divs)[i]).removeClass('mur');
}

  // Appel de la fonction spawnAleatoire pour la position des différents joueurs
  spawnAleatoire(joueur1.afficherJoueur(),0,9,'joueur1');
  spawnAleatoire(joueur2.afficherJoueur(),90,99,'joueur2');

  // Appel de la même fonction mais pour la position des différentes armes
  spawnAleatoire(marteau.afficherArme(),53,56,'marteau');
  // Permet de changer la zone de spawn des armes
  let i = '';
  i = Math.floor(Math.random() * 2);
    if(i < 1) {
      spawnAleatoire(epeeXL.afficherArme(),10,49,'arme');
      spawnAleatoire(sabre.afficherArme(),60,89,'arme');
    } else {
      spawnAleatoire(sabre.afficherArme(),10,49,'arme');
      spawnAleatoire(epeeXL.afficherArme(),60,89,'arme');
    }



// ### DEPLACEMENTS ###

  let mouvement = 0;
  let tourJoueur1 = true;
  let tourJoueur2 = true;
  const bordsHaut = [0,1,2,3,4,5,6,7,8,9];
  const bordsBas = [90,91,92,93,94,95,96,97,98,99];
  const bordsDroite = [9,19,29,39,49,59,69,79,89,99];
  const bordsGauche = [-1,10,20,30,40,50,60,70,80,90];

  console.log(iJoueur1); // POUR TESTERRRRRRRRRRRRRRRRRRRRRR

  // Permet de gérer les collisions du plateau
  function estDifferent(element) {
    return element !== iJoueur1;
  }

  // Chacun son tour
  if(tourJoueur1 === true) {
    iJoueur = iJoueur1;
    imgJoueur = 'img#joueur1';
  } else {
    iJoueur = iJoueur2;
    imgJoueur = 'img#joueur2';
  }

  $(document).keydown(function(e){
    // Tant que le joueur n'a pas fait 3 cases de déplacement..
    if(mouvement < 3) {
      // Collisions plateau et mur à DROITE
      if(bordsDroite.every(estDifferent) && !$((divs)[iJoueur1+1]).hasClass('mur')) {
        // Touche clavier DROITE .which code ASCII
        if (e.which === 39) {
          iJoueur1++;
          $('img#joueur1').prependTo($((divs)[iJoueur1]));
          mouvement++;
        }
      }
      // Collisions plateau et mur à GAUCHE
      if(bordsGauche.every(estDifferent) && !$((divs)[iJoueur1-1]).hasClass('mur')) {
        // Touche clavier GAUCHE .which code ASCII
        if (e.which === 37) {
          iJoueur1--;
          $('img#joueur1').prependTo($((divs)[iJoueur1]));
          mouvement++;
        }
      }
      // Collisions plateau et mur vers le BAS
      if(bordsBas.every(estDifferent) && !$((divs)[iJoueur1+10]).hasClass('mur')) {
        // Touche clavier BAS .which code ASCII
        if (e.which === 40) {
          iJoueur1 = iJoueur1 + 10;
          $('img#joueur1').prependTo($((divs)[iJoueur1]));
          mouvement++;
        }
      }
      // Collisions plateau et mur vers le HAUT
      if(bordsHaut.every(estDifferent) && !$((divs)[iJoueur1-10]).hasClass('mur')) {
        // Touche clavier HAUT .which code ASCII
        if (e.which === 38) {
          iJoueur1 = iJoueur1 - 10;
          $('img#joueur1').prependTo($((divs)[iJoueur1]));
          mouvement++;
        }
      }
      console.log(iJoueur1); // POUR TESTERRRRRRRRRRRRRRRRRRRRRR
    }
    tourJoueur1 = false;
  });



});