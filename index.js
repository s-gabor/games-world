var apiGames = "https://games-world.herokuapp.com/games/";
var container = document.getElementById("list-games");


// onLoad display the games from API
document.addEventListener("DOMContentLoaded", onHtmlLoaded);
function onHtmlLoaded() {
	$.get(apiGames)
		.then(function(games) {
			for (var i = 0; i < games.length; i++) {
				displayGame(games[i]);
			}
		})
		.catch(function(err) {
			alert('The following error occured: ', err);
		})
}


// create an article with the following structure: title, description, image and 2 buttons(Edit and Delete)
function displayGame(game) {
	    var html = document.createElement("article");
	    html.setAttribute("game-id", game._id);
	    html.innerHTML = `<h2> ${game.title} </h2>
	                      <p> ${game.description} </p>
	                      <button class="btn-edit">Edit game</button>
	                      <button class="btn-delete">Delete game</button>
	                      <img src='${game.imageUrl}' width='500px' height='auto'>`;
	    html.querySelector(".btn-delete").addEventListener("click", function() {
	    	var selectedGame = this.parentNode;
	    	var userConfirmation = prompt('Are you sure you want to delete the game? To confirm type "yes"');
	    	if (userConfirmation === 'yes') {
	    		deleteGame(selectedGame);
	    	} else {
	    		alert('Action cancelled.');
	    	}
		});
	    container.appendChild(html);
}