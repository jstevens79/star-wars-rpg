// 
var rpgGame = {
  gameStarted: false,
  playerChosen: null,
  enemyChosen: null,
  attacking: false,
  characters: [],
  setupGame: function () {
    // reset everything
    $('#gameWrapper').empty();
    this.characters = [];
    this.playerChosen = null;
    this.enemyChosen = null;

    // create characters object
    this.generateCharacters();

    // setup character select area
    var characterSelect = $("<div>").addClass("characterSelect");
    //characterSelect.prepend('<div id="instructions"><p>Select your player.</p></div>')
    $('#gameWrapper').append(characterSelect);
    
    // add characters to characterSelect
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
    addCharacter('luke skywalker', 160, 20, 15);
    addCharacter('darth vader', 200, 25, 22);
    addCharacter('yoda', 190, 24, 20);
    addCharacter('kylo ren', 140, 18, 20);
    addCharacter('rey', 130, 15, 15);
    //addCharacter('boba fett', 120, 10, 15);
    addCharacter('chewbacca', 160, 22, 25);

  },

  characterCard: function (a, ind, classy) {
    // setup and return a character card
    var defeatedCheck = (a.defeated) ? ' defeated' : '';
    
    var card = $("<div>")
      .addClass('characterCard')
      .addClass(classy)
      .addClass(defeatedCheck)
      .attr('data-character', ind)
      .append("<img src='https://via.placeholder.com/260x140'>");

    var stats = $("<div>")
      .addClass('characterStats')
      .append("<h3>" + a.name + "</h3>")
      .append("<span class='stats'>// " + a.health + "</span>");

    card.append(stats);

    return card;
    
  },

  reRenderCards: function () {
    // maybe just change out health here?
    $('.player').empty();
    $('.player').append(this.characterCard(this.characters[this.playerChosen], this.playerChosen, 'chosen'));
    $('#competitors').empty();
    $('#competitors').append(this.characterCard(this.characters[this.enemyChosen], this.enemyChosen, 'chosenCompetitor'));
  },

  stageCharacters: function () {
    $.each(this.characters, function (index, value) {
      $('.characterSelect').append(this.characterCard(value, index, 'select'));
    }.bind(this))

    $('.select').click(function () {
      rpgGame.choosePlayer($(this).data("character"))
      $(this).remove();
    })
  },

  choosePlayer: function (a) {

    if ( this.playerChosen === null ) {

      this.playerChosen = a;
    
      var battlefield = $('<div>').addClass('battlefield');
      
      var battlefieldControls = $('<div>').addClass('battlefieldControls');
      battlefieldControls.append('<button id="chooseNew">Change character</button>');

      var battlingCharacters = $('<div>').addClass('battlingCharacters');
      
      var player = $('<div>').addClass('player');
      player.prepend(this.characterCard(this.characters[a], a, 'chosen'));

      var enemy = $('<div>').addClass('enemy').text('Choose an enemy');

      battlingCharacters.append(player).append(enemy);

      battlefield.append(battlingCharacters).append(battlefieldControls);

      $('#gameWrapper').append(battlefield);

    } else {
      this.chooseEnemy(a);
    }

  },

  stageEnemies: function () {
    $('#competitors').empty();
    $('#instructions').empty().append('<p>Choose your opponent.</p>');

    $.each(this.characters, function (index, value) {
      if (index !== this.playerChosen) {
        $('#competitors').append(this.characterCard(value, index, 'selectCompetitor'));
      }
    }.bind(this))

    $('.selectCompetitor').not('.defeated').click(function () {
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
    $('.characterSelect').toggle('slow');
    this.enemyChosen = a;
    $('.enemy').empty().append(this.characterCard(this.characters[a], a, 'chosenCompetitor'));
    $('#chooseNew').remove();
    $('.battlefield').append('<div class="controls"><button id="attack">Attack!</button>');

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

    console.log(Player.currentAttack);

    setTimeout(function() {
      var updatedHealth = Player.health - Enemy.counterAttack;
      Player.health = (updatedHealth <= 0) ? 0 : updatedHealth;
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
      this.restartGameButton('Try again');
    }

    if (enemyDefeated) {
      setTimeout(function() {
        this.stageEnemies();
        $('#attack').remove();
        if (this.checkIfAllDefeated()) {
          this.restartGameButton('Play again');
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
  },

  restartGameButton: function(a) {
    console.log('yeah..')
    $('#gameWrapper').append('<button onclick="rpgGame.setupGame()" id="restart">' + a + '</button>');
  }

}

rpgGame.setupGame();
