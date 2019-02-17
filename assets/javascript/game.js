// 
var rpgGame = {
  gameStarted: false,
  playerChosen: false,
  characters: [],
  setupGame: function() {
    // setup character select area
    $('.gameWrapper').append('<div id="characterSelect"></div>');
    // generateCharacters
    this.generateCharacters();
    this.stageCharacters();
  },
  generateCharacters: function(){
    var that = this;
    
    function addCharacters(name, health, attack, counterAttack) {
      var character = { 
        name: name,
        health: health,
        attack: attack,
        counterAttack: counterAttack,
        chosen: false,
        played: false
      }
      that.characters.push(character);
    }

    addCharacters('darth vader', 200, 25, 22);
    addCharacters('luke skywalker', 160, 20, 15);
    addCharacters('kylo ren', 140, 18, 20);
    addCharacters('han solo', 120, 10, 15);
    addCharacters('chewbacca', 160, 22, 25);
  },
  characterChard: function() {},
  stageCharacters: function() {
    $.each(this.characters, function(index, value) {
      $('#characterSelect').append(
        '<div class="characterCard select" data-character=' + index + '><h3>'
          + value.name +
        '</h3></div>');
    }) 

    $('.select').click(function() {
      rpgGame.choosePlayer($(this).data("character"))
    })

  },
  choosePlayer: function(a) {
    this.characters[a].chosen = true;
    this.playerChosen = true;
    
    // clear board and setup competion layout
    $('.select').off();
    $('#characterSelect').remove();
    $('.gameWrapper').append('<div id="battlefield"></div>');
    $('#battlefield').append('<div id="player1"></div>');
    $('#battlefield').append('<div id="competitors"></div>');
    
    $('#player1').append(
      '<div class="characterCard chosen"><h3>'
        + this.characters[a].name +
      '</h3></div>'
    )

    $.each(this.characters, function(index, value) {
      if (!value.chosen) {
        $('#competitors').append(
          '<div class="characterCard selectCompetitor" data-character=' + index + '><h3>'
            + value.name +
          '</h3></div>')
      }
    })

    $('.selectCompetitor').click(function() {
      console.log('select competitor...')
    })
        
  },
  chooseEnemy: function() {},
  attack: function() {

  },
  score: function() {},
}

rpgGame.setupGame();


