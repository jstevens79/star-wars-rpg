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

    var header = $('<header>');
    header.append('<image class="logo" alt="star wars logo" src="' + './assets/images/Star_Wars_Logo.png' + '">');
    $('#gameWrapper').append(header);

    // create characters object
    this.generateCharacters();

    var stage = $('<div>').addClass('stage');

    // setup character select area
    var characterSelect = $("<div>").addClass("characterSelect");
    stage.append(characterSelect);

    // setup the controls area
    var controls = $('<div>').addClass('controls').toggle();    
    $('#gameWrapper').append(stage).append(controls);

    // add characters to characterSelect
    this.stageCharacters();
    
   
  },

  generateCharacters: function () {
    var that = this;

    function addCharacter(name, health, attack, counterAttack, image) {
      var character = {
        name: name,
        health: health,
        attack: attack,
        currentAttack: attack,
        counterAttack: counterAttack,
        defeated: false,
        image: image
      }
      that.characters.push(character);
    }

    //name, health, attack, counterAttack, image
    addCharacter('luke skywalker', 160, 20, 15, './assets/images/skywalker.jpg');
    addCharacter('darth vader', 200, 25, 22, './assets/images/vader.jpg');
    addCharacter('yoda', 190, 24, 20, './assets/images/yoda.jpg');
    addCharacter('kylo ren', 140, 18, 20, './assets/images/kylo.jpg');
    addCharacter('rey', 130, 15, 15, './assets/images/rey.jpg');
    addCharacter('chewbacca', 160, 22, 25, './assets/images/chewy.jpg');

  },

  characterCard: function (a, ind, classy) {
    // setup and return a character card
    var defeatedCheck = (a.defeated) ? ' defeated' : '';
    
    var card = $("<div>")
      .addClass('characterCard')
      .addClass(classy)
      .addClass(defeatedCheck)
      .attr('data-character', ind)
      .append("<img alt='" + a.name + "' src='" + a.image + "'>");

    var stats = $("<div>")
      .addClass('characterStats')
      .append("<h3>" + a.name + "</h3>")
      .append("<span class='stats'><i class='fas fa-heart'></i></i> " + a.health + "</span>");

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
      if (rpgGame.playerChosen === null) {
        rpgGame.choosePlayer($(this).data("character"));
        $(this).remove();
      } else {
        rpgGame.chooseEnemy($(this).data("character"));
      }
    })
  },

  choosePlayer: function (a) {
      this.playerChosen = a;
      this.updatePlayerDash();
      $('.controls').toggle("slow");
  },

  updatePlayerDash: function () {
    var player = this.characters[this.playerChosen];
    var playerPic = $('<img>')
      .attr('src', player.image)
      .attr('alt', player.name + '_icon')
      .addClass('playerIcon');
    var yourPlayer = $('<h1>').text('Your player');
    var playerName = $('<h3>').text(player.name);
    var powers = $('<div>')
      .addClass('powerStats')
      .append("<div class='stats'><i class='fas fa-heart'></i></i> " + player.health + " <span class='blue'>// Attack Power: " + player.currentAttack + "<span></div>"); 
    

    $('.controls').append(yourPlayer).append(playerPic).append(playerName).append(powers);
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
    $('.characterSelect').fadeTo("fast", 0);
    this.enemyChosen = a;
    $('.enemyStats').text(this.characters[a].name);
    $('.enemy').empty().append(this.characterCard(this.characters[a], a, 'chosenCompetitor'));
    
    //$('#chooseNew').remove();
    
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
