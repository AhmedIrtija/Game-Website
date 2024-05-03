// Adding an event listener to the document that waits for the entire HTML document to be fully loaded before executing the function.
document.addEventListener('DOMContentLoaded', function() {
    // Selecting HTML elements by their class names and IDs and assigning them to variables.
    const box = document.querySelector('.dice-box');
    const roll = document.querySelector('.roll');
    const amount = document.getElementById('diceNumber');
    
    // Array of dice image paths, used to show different dice faces.
    const diceImages = [
        'images/dice1.png',
        'images/dice2.png',
        'images/dice3.png',
        'images/dice4.png',
        'images/dice5.png',
        'images/dice6.png'
    ];

    // Adding an event listener to the roll that triggers on clicks.
    roll.addEventListener('click', function() {
        // Calls the updateDice function to update the dice in the dice box based on the number entered by the user.
        updateDice(box, parseInt(amount.value), diceImages);
    });

    // Function to update the display of dice in the dice box.
    function updateDice(box, number, diceImages) {
        // Clears the box's content before adding new dice elements.
        box.innerHTML = ''; 
        // Loops to create a dice element for each number requested.
        for (let i = 0; i < number; i++) {
            const diceDiv = document.createElement('div');
            diceDiv.className = 'dice';
            box.appendChild(diceDiv);
            // Animates the dice by changing its face randomly.
            animateDice(diceDiv, diceImages);
        }
    }

    // Function to animate a single dice by cycling through images.
    function animateDice(diceDiv, diceImages) {
        let count = 0;
        const times = 15; // Number of changes before stopping.

        // Interval that changes the background image of diceDiv every 100ms.
        const interval = setInterval(function() {
            diceDiv.style.backgroundImage = `url(${diceImages[count % diceImages.length]})`;
            count++;

            // Stops the animation after a set number of changes and sets a random face on the dice.
            if (count === times) {
                clearInterval(interval);
                diceDiv.style.backgroundImage = `url(${diceImages[Math.floor(Math.random() * diceImages.length)]})`;
            }

        }, 100); // milliseconds
    }
});
