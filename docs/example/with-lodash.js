'use strict';
const _ = require('lodash');

// Create a deck of cards and then deal 5 random cards each to 4 players.

// Create the deck.
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = _.concat(_.range(2, 11), ['J', 'Q', 'K', 'A']);

const deck = Array.from(function* () {
    for (const suit of suits) {
        for (const rank of ranks) {
            yield { suit, rank };
        }
    }
}());

// Shuffle the deck.
const shuffledDeck = _.shuffle(deck);

// Deal each player 5 cards.
const players = [
    { name: "Paul" },
    { name: "John" },
    { name: "George" },
    { name: "Ringo" }
];

for (const player of players) {
    player.hand = _.remove(shuffledDeck, (value, index) => index < 5);
    console.log(`${player.name}'s hand: ${JSON.stringify(player.hand)}`);
}