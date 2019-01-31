var apiGames = "https://games-world.herokuapp.com/games/";


function Games() {
  this.items = [];
}

Games.prototype.getGames = function() {
	return $.get(apiGames).then(function(response) {
		return response;
	});
};