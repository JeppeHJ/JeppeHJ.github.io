const buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = []; // The pattern of colors that the game will show to the user
let userClickedPattern = []; // The pattern of colors that the user has clicked
var userClickCount = 0; // The number of clicks that the user has made

/**
 * Generates a random integer between 0 (inclusive) and the specified maximum value (exclusive).
 * @param {number} max - The maximum value (exclusive).
 * @return {number} A random integer between 0 (inclusive) and max (exclusive).
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

var started = false; // Whether the game has started
let level = 0; // The current level of the game

/**
 * Starts the game when the space bar is pressed.
 */
$(document).keypress(function(event) {
    // Only start the game if the space bar is pressed
    if (event.which === 32 && !started) {
      level = 1;
      $("#level-title").text("Level " + level);
      nextSequence();
      started = true;
    }
  });

/**
 * Handles a button click event.
 */
$(".btn").click(function() {
    if (started) {
        var userChosenColor = $(this).attr("id"); // The color of the button that was clicked
        userClickedPattern.push(userChosenColor);
        playSound(userChosenColor);
        animatePress(userChosenColor);
        checkAnswer(userClickedPattern.length);
        }
    }
    );


/**
 * Plays the sound for the specified color.
 * @param {string} name - The name of the color.
 */
function playSound(name) {
    const audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

/**
 * Shows the next sequence of colors to the user.
 */
async function nextSequence() {
    randomNumber = getRandomInt(3); // Generate a random number between 0 and 3
    randomChosenColor = buttonColors[randomNumber]; // Choose a random color from the buttonColors array
    gamePattern.push(randomChosenColor); // Add the random color to the game pattern
    $("h1").text("Level " + level);
    for (var i = 0; i < gamePattern.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for half a second before showing the next color
        $("#" + gamePattern[i]).fadeIn(100).fadeOut(100).fadeIn(100); // Flash the button for the current color
        playSound(gamePattern[i]); // Play the sound for the current color
    }
    started = true; // Allow the user to click the buttons again
    userClickedPattern = []; // Reset the user's clicked pattern
    userClickCount = 0; // Reset the user click count
}

/**
 * Animates the press of the specified button.
 * @param {string} currentColor - The color of the button to animate.
 */
function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed"); // Add the "pressed" class to the button
    setTimeout(function () {
        $("#" + currentColor).removeClass("pressed"); // Remove the "pressed" class after 100ms
      }, 100);
}

/**
 * Checks the user's answer against the current level.
 * @param {number} currentLevel - The current level.
 */
function checkAnswer(currentLevel) {
    var continueGame = true; // Whether the game should continue
    for (var i = userClickCount; i < currentLevel; i++) {
      // If the user's clicked pattern doesn't match the game pattern, the game is over
      if (userClickedPattern[userClickCount] !== gamePattern[userClickCount]) {
        continueGame = false;
        gameOver();
      }
    }

    userClickCount += 1; // Increment the user click count
  
    if (userClickCount === level && continueGame) {
      started = false;
      level += 1; // Increment the level
      setTimeout(function() {
        nextSequence(); // Show the next sequence to the user
      }, 1000);
    }
  }

/**
 * Flashes the background red.
 */
function gameOverFlash() {
    $("body").css("background-color", "red"); // Set the background color to red
    setTimeout(function() {
        $("body").css("background-color", "#011F3F"); // Set the background color back to the original color after 200ms
    }, 200)
}
  
/**
 * Handles the game over event.
 */
function gameOver() {
    playSound("wrong"); // Play the wrong sound
    gameOverFlash(); // Flash the background red
    started = false; // Prevent the user from clicking any buttons
    userClickCount = 0; // Reset the user click count
    userClickedPattern = []; // Reset the user's clicked pattern
    gamePattern = []; // Reset the game pattern

    $("#level-title").text("Du fuckede up, skat. Godt du er jurist. Tryk på en knap for at forsøge igen"); // Update the title
  }