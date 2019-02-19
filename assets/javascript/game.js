// 
var rpgGame = {
  gameStarted: false,
  playerChosen: null,
  enemyChosen: null,
  attacking: false,
  characters: [],
  setupGame: function () {
    // reset everything
    $('.gameWrapper').empty();
    this.characters = [];
    this.playerChosen = null;
    this.enemyChosen = null;

    // setup character select area
    $('.gameWrapper').append('<div id="characterSelect"></div>');
    // generateCharacters
    this.generateCharacters();
    this.stageCharacters();
  },

  generateCharacters: function () {
    var that = this;

    function addCharacter(name, health, attack, counterAttack) {
      var character = {
        name: name,
        health: health,
        attack: attack,
        currentAttack: attack,
        counterAttack: counterAttack,
        defeated: false
      }
      that.characters.push(character);
    }

    //name, health, attack, counterAttack
    addCharacter('darth vader', 200, 25, 22);
    addCharacter('yoda', 190, 24, 20);
    addCharacter('luke skywalker', 160, 20, 15);
    addCharacter('kylo ren', 140, 18, 20);
    addCharacter('rey', 130, 15, 15);
    addCharacter('boba fett', 120, 10, 15);
    addCharacter('chewbacca', 160, 22, 25);

  },

  characterCard: function (a, ind, classy) {
    // setup and return a character card
    var defeatedCheck = (a.defeated) ? ' defeated' : '';
    return "<div class='characterCard " + classy + defeatedCheck + "' data-character='" + ind + "'><h3>" 
      + a.name + "</h3><div class='stats'>" + a.health + "</div></div>"
  },

  reRenderCards: function () {
    // maybe just change out health here?
    $('#player1').empty();
    $('#player1').append(this.characterCard(this.characters[this.playerChosen], this.playerChosen, 'chosen'));
    $('#competitors').empty();
    $('#competitors').append(this.characterCard(this.characters[this.enemyChosen], this.enemyChosen, 'chosenCompetitor'));
  },

  stageCharacters: function () {
    $.each(this.characters, function (index, value) {
      $('#characterSelect').append(this.characterCard(value, index, 'select'));
    }.bind(this))

    $('.select').click(function () {
      rpgGame.choosePlayer($(this).data("character"))
    })
  },

  choosePlayer: function (a) {
    this.playerChosen = a;

    // clear board and setup competion layout
    $('.select').off();
    $('#characterSelect').remove();
    $('.gameWrapper').append('<div id="battlefield"></div>');
    $('#battlefield').append('<div id="player1"><button id="chooseNew">Change character.</button></div>');
    $('#battlefield').append('<div id="competitors"></div>');

    $('#player1').prepend(this.characterCard(this.characters[a], a, 'chosen'));

    this.stageEnemies();

  },

  stageEnemies: function () {
    $('#competitors').empty();

    $.each(this.characters, function (index, value) {
      if (index !== this.playerChosen) {
        $('#competitors').append(this.characterCard(value, index, 'selectCompetitor'));
      }
    }.bind(this))

    $('.selectCompetitor').click(function () {
      $('#chooseNew').off();
      $('#chooseNew').remove();
      $('.selectCompetitor').off();
      rpgGame.chooseEnemy($(this).data('character'));
    });

    $('#chooseNew').click(function () {
      rpgGame.setupGame();
    })
  },

  chooseEnemy: function (a) {
    $('#competitors').empty();
    this.enemyChosen = a;
    $('#competitors').append(this.characterCard(this.characters[a], a, 'chosenCompetitor'));
    $('#battlefield').append('<div class="controls"><button id="attack">Attack!</button>');

    $('#attack').click(function () {
      if (!rpgGame.attacking) {
        rpgGame.attack();
      }
    })
  },

  attack: function () {
    var Player = this.characters[this.playerChosen];
    var Enemy = this.characters[this.enemyChosen];
    this.attacking = true;

    // attack the enemy
    var updatedEnemyHealth = Enemy.health - Player.currentAttack;
    Enemy.health = (updatedEnemyHealth <= 0) ? 0 : updatedEnemyHealth;
    Enemy.defeated = (Enemy.health === 0) ? true : false;
    // increase the attack power
    Player.currentAttack = Player.currentAttack + Player.attack;
    this.reRenderCards();

    setTimeout(function() {
      var updatedHealth = Player.health - Enemy.counterAttack;
      Player.health = (updatedHealth <= 0) ? 0 : updatedHealth;
      console.log(Player.health)
      this.reRenderCards();
      this.attacking = false;

      this.score();
    }.bind(this), 1500)
    
    

  },

  score: function () {
    var playerDefeated = (this.characters[this.playerChosen].health <= 0) ? true : false;
    var enemyDefeated = (this.characters[this.enemyChosen].health <= 0) ? true : false;

    if (playerDefeated) {
      $('#attack').remove();
      alert('you lose!');
    }

    if (enemyDefeated) {
      setTimeout(function() {
        this.stageEnemies();
        $('#attack').remove();
        if (this.checkIfAllDefeated()) {
          alert('you won!');
        }
      }.bind(this), 1500);
    }

  },

  checkIfAllDefeated: function() {
    var allDefeated = true;
    $.each(this.characters, function(index, value) {
      if (index !== this.playerChosen) {
        if (value.defeated === false) {
          allDefeated = false;
          return;
        }
      }
    }.bind(this));
    return allDefeated;
  }
}



rpgGame.setupGame();
rpgGame.checkIfAllDefeated();