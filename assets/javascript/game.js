// 
var rpgGame = {
  gameStarted: false,
  playerChosen: false,
  startGame: function() {
    // can probably be in handles in choosing the character
  }, 
  setupGame: function() {
    // generateCharacters
    this.generateCharacters();
    this.stageCharacters();
  },
  characters: [],
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
  },
  choosePlayer: function(a) {
    this.characters[a].chosen = true;
    this.playerChosen = true;
    
    // clear board and setup competion layout
    $('#characterSelect').remove();
    $('#player1').append(
      '<div class="characterCard chosen"><h3>'
        + this.characters[a].name +
      '</h3></div>'
    )

    $.each(this.characters, function(index, value) {
      if (!value.chosen) {
        $('#competitors').append(
          '<div class="characterCard select" data-character=' + index + '><h3>'
            + value.name +
          '</h3></div>')
      }
    })
    

  },
  chooseEnemy: function() {},
  attack: function() {},
  score: function() {},
}

rpgGame.setupGame();

$('.select').click(function() {
  if (!rpgGame.playerChosen) {
    rpgGame.choosePlayer($(this).data("character"))
  } else {
    console.log('choose enemy...')
  }
})

