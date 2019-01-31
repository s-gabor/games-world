var apiGames = "https://games-world.herokuapp.com/games/";
var container = document.getElementById("list-games");


// onLoad display the games from API
document.addEventListener("DOMContentLoaded", onHtmlLoaded);
function onHtmlLoaded() {
	var games = new Games();
	games.getGames()
			.then(function(response) {
					console.log('OnHtmlLoaded received: ', response);
					displayGames(response);
				})
			.catch(function(err) {
					console.log('The following error occured: ', err);
				})
}


function displayGames(games) {
	for (var i = 0; i < games.length; i++) {
		displayGame(games[i]);
	}
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
    html.querySelector(".btn-edit").addEventListener("click", editGame);
    html.querySelector(".btn-delete").addEventListener("click", deleteGame);
    container.appendChild(html);

    // remove game
    function deleteGame() {
		var articleHtml = this.parentNode;
		var id = articleHtml.getAttribute("data-id");
		var gameObj = new Game({ _id: id });
		gameObj.deleteGame()
			.then(
				function(response) {
			        console.log("DELETE response", response);
			        articleHtml.remove();
		    	},
				function(error) {
			        alert("Cannot DELETE article");
		    	}
		    );
	}

	// update game with user modifications(PUT to API)
	function editGame() {
		var article = this.parentNode;
		var btn = this;
		switchToEditMode(btn);
		var titleField = article.children[0];
		var descriptionField = article.children[1];
		var imageUrlField = article.children[4];
		var editableFields = [titleField, descriptionField];
		for (var field of editableFields) {
			field.setAttribute('contenteditable', true);
			$(field).addClass('edit-mode');
		}
		btn.addEventListener('click', function() {
			console.log('clicked on save changes!');
			// "for loop" is NOT optional(apparently) because PUT doesn't refresh the page automatically(apparently)
			for (var field of editableFields) {
				field.setAttribute('contenteditable', false);
				$(field).removeClass('edit-mode');
			}
			switchFromEditMode(btn);
			var title = titleField.textContent;
			var description = descriptionField.textContent;
			var imageUrl = imageUrlField.getAttribute('src');
			var id = article.getAttribute("game-id");
			var game = new Game({_id: id});
			game.updateGame({
				title: title,
				description: description,
				imageUrl: imageUrl
			});
		})
	}
}

// create an input article on "Add new game" click. Input from user: title, description and imageURL (id is created automatically by the API)
document.getElementById('btn-add-game').addEventListener('click', function() {
	var html = document.createElement("article");
	html.innerHTML = `<input type="text" placeholder="add game title">
					<textarea placeholder="add game description"></textarea>
					<input type="text" placeholder="add image url">
					<button id="save-new-game"> Save game</button>`;
	$(html).addClass('center');
	container.prepend(html);
})


// post the game with the user input
$('#list-games').on('click', '.center button', function(event) {
	event.preventDefault();
	var title = this.parentNode.children[0].value;
	var description = this.parentNode.children[1].value;
	var imageUrl = this.parentNode.children[2].value;
	var newGame = new Game({
		title: title,
		description: description,
		imageUrl: imageUrl
	});
	newGame.postGame();
})


function switchToEditMode(btn) {
	$(btn).addClass('btn-edit-mode');
	btn.textContent = 'SAVE CHANGES';
}

function switchFromEditMode(btn) {
	$(btn).removeClass('btn-edit-mode');
	btn.textContent = 'Edit';
}





