var apiGames = "https://games-world.herokuapp.com/games/";


function Game(options={}) {
	this._id = options._id;
	this.title = options.title;
	this.description = options.description;
	this.imageUrl = options.imageUrl;
}


Game.prototype.postGame = function() {
	return $.ajax({
		url: apiGames,
		method: 'POST',
		data: {
			title: this.title,
			description: this.description,
			imageUrl: this.imageUrl
		},
		success: function(response) {
			console.log('Game  posted!', response)
		}
	});
}


Game.prototype.updateGame = function() {
	return $.ajax({
		url: apiGames + this._id,
		method: 'PUT',
		data: {
			title: this.title,
			description: this.description,
			imageUrl: this.imageUrl
		},
		success: function(response) {
			console.log('Game  updated!', response)
		}
	});
}


Game.prototype.deleteGame = function() {
	return $.ajax({
		url: apiGames + this._id,
		method: 'DELETE',
		success: function(response) {
			console.log(response);
		}
	});
}