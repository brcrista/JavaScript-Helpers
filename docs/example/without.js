'use strict';

// Create a deck of cards and then deal 5 random cards to 4 players, each.

// Create the deck.
const numbers = [];
for (let i = 2; i <= 10; i++) {
    numbers.push(i);
}

const deck = [];
for (const suit of ['Hearts', 'Diamonds', 'Clubs', 'Spades']) {
    for (const rank of numbers.concat(['J', 'Q', 'K', 'A'])) {
        deck.push({ suit, rank });
    }
}

// Shuffle the deck.
const shuffledDeck = new Array(deck.length);
for (const card of deck) {
    // Assign a random index in the shuffled deck.
    let index = Math.floor(Math.random() * Math.floor(shuffledDeck.length));

    // If the index is taken, find the next available index.
    while (shuffledDeck[index] !== undefined) {
        index = (index + 1) % shuffledDeck.length;
    }
    shuffledDeck[index] = card;
}

// Deal each player 5 cards.
const players = [
    { name: "Paul" },
    { name: "John" },
    { name: "George" },
    { name: "Ringo" }
];

for (const player of players) {
    player.hand = [];
    for (let i = 0; i < 5; i++) {
        player.hand.push(shuffledDeck.pop());
    }
    console.log(`${player.name}'s hand: ${JSON.stringify(player.hand)}`);
}