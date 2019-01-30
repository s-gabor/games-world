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
	    html.querySelector(".btn-edit").addEventListener("click", function () {
	    	var btnEdit = this;
	    	switchToEditMode(btnEdit);
	    	editGame(html, btnEdit);
	    });
	    html.querySelector(".btn-delete").addEventListener("click", function() {
	    	var userConfirmation = prompt('Are you sure you want to delete the game? To confirm type "yes"');
	    	if (userConfirmation === 'yes') {
	    		deleteGame(html);
	    	} else {
	    		alert('Action cancelled.');
	    	}
		});
	    container.appendChild(html);
}


// delete the game from API and refresh page
function deleteGame(game) {
	var id = game.getAttribute("game-id");
	$.ajax({
		url: apiGames + id,
		method: "DELETE",
		success: function(res) {
			game.remove();
			alert('The game was successfully deleted!');
		}
	});
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
	postGame({
		title: title,
		description: description,
		imageUrl: imageUrl
	});
})

function postGame(dataObj) {
	$.ajax({
	  url: apiGames,
	  method: 'POST',
	  data: dataObj,
	  success: function(response) {
	    console.log(response);
	  }
	});
}


// update game with user modifications(PUT to API)
function editGame(article, btn) {
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
		var data = {
					title: title,
					description: description,
					imageUrl: imageUrl
					}
		updateGame(article, data);
	})
}

function switchToEditMode(btn) {
	$(btn).addClass('btn-edit-mode');
	btn.textContent = 'SAVE CHANGES';
}

function switchFromEditMode(btn) {
	$(btn).removeClass('btn-edit-mode');
	btn.textContent = 'Edit';
}

function updateGame(article, dataObj) {
	var id = article.getAttribute("game-id");
	$.ajax({
		url: apiGames + id,
		method: 'PUT',
		data: dataObj,
		success: function(response) {
			console.log(response);
		}
	})
}