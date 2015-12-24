/* **** Global Variables **** */
// try to eliminate these global variables in your project, these are here just to start.

var playersGuess;
var winningNumber = generateWinningNumber();
var guessesRemaining = 7;
var guessListArr = [];

/* **** Guessing Game Functions **** */

// Generate the Winning Number
function generateWinningNumber(){
	return Math.ceil(Math.random()*100);
}

// Fetch the Players Guess
function playersGuessSubmission() {
	var duplicateGuess = false;

	var playersGuessFloat = parseFloat($("#playersGuess").val());
	playersGuess = parseInt($("#playersGuess").val(), 10);

	for(var i = 0; i < guessListArr.length; i++) {
		if(guessListArr[i] === playersGuess) duplicateGuess = true;
	}
	
	$("#playersGuess").val("");

	if( isNaN(playersGuess) || playersGuess < 1 || playersGuess > 100) {
		$("#status").html("<span style='color:red'><b>Error: </b></span>Please enter a valid target distance (1-100).");
	} else if(playersGuess != playersGuessFloat) {
		$("#status").html("<span style='color:red'><b>Error: </b></span>Targeting system only accepts <b>whole numbers</b>.");
	} else if(duplicateGuess) {
		$("#status").html("<span style='color:red'><b>Error: </b></span>Previously targeted. Enter a new target distance.");		
	} else {
		guessListArr.push(playersGuess);
		guessesRemaining--;
		checkGuess();
		$("#prevGuesses").append("<h5>" + playersGuess +" " + "</h5>");
	}
}

// Determine if the next guess should be a lower or higher number
function lowerOrHigher(){
	return playersGuess - winningNumber;
	// add code here
}

// Check if the Player's Guess is the winning number 
function checkGuess(){
	if(playersGuess === winningNumber) onWin();
	else if(guessesRemaining === 0) onLose();
	else onTryAgain();
}

// Create a provide hint button that provides additional clues to the "Player"
function provideHint(){
	$("#status").text( (winningNumber%2===0) ? "The enemy ship is an even number of km away." : "The enemy ship is an odd number of km away." );
}

// Allow the "Player" to Play Again
function playAgain(){
	enableGameStuff();
	winningNumber = generateWinningNumber();
	guessesRemaining = 7;
	guessListArr = [];
	updateAttemptsRem();
	$("#status").text("");
	$("h5").remove();
}

// When the player wins
function onWin() {
	$("#status").text("You hit and sunk their Battleship!");
	disableGameStuff();
}

// When the player misses but still has attempts give them directional/proximity info.
function onTryAgain() {
	var diff = lowerOrHigher();
	var direction = (diff > 0 ? "overshot" : "undershot");
	var distanceEst = Math.abs(diff) + (10 - (Math.abs(diff)%10));
	$("#status").text("You " + direction + " your target by less than " + distanceEst +"km.");
	updateAttemptsRem();
}

// When the player misses with no attempts left
function onLose() {
	$("#status").text("You lose, evil wins. Try again.");
	disableGameStuff();
}

//Update the number of attempts remaining message
function updateAttemptsRem() {
	$("#attemptsRem").text(guessesRemaining + " attempts left.");
}

//Disable some buttons and input field after game is over, before restarting.
function disableGameStuff() {
	$("#submitGuess").prop("disabled", true).removeClass("btn-success").addClass("btn-default");
	$("#hint").prop("disabled", true).removeClass("btn-info").addClass("btn-default");
	$("#playersGuess").prop("disabled", true);
	$("#attemptsRem").text("");
}

//Enable buttons and input field
function enableGameStuff() {
	$("#submitGuess").prop("disabled", false).removeClass("btn-default").addClass("btn-success");
	$("#hint").prop("disabled", false).removeClass("btn-default").addClass("btn-info");
	$("#playersGuess").prop("disabled", false);
}

$("#buttons").append("<div id='prevGuesses'><h2>Previous Guesses:</h2></div>");

//Initially populate the number of attempts remaining text
updateAttemptsRem();

/* **** Event Listeners/Handlers ****  */
$("#submitGuess").on("click", playersGuessSubmission);

//Enter button
$("#playersGuess").on("keypress", function(event) {
	if(event.which == 13) playersGuessSubmission();
});

//Hint button
$("#hint").on("click", provideHint);

//restart button
$("#restartSim").on("click", playAgain);






