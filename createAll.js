var generator = require('./minter.js');
var cards = require('./json/cards.json');

cards.forEach(function(card) {
	generator.createCard(card, function(res) {
      	console.log(res);
  	});
});
