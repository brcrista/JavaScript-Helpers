'use strict';
const iterable = require('../../dist/iterable');
const random = require('../../dist/random');

// Create a deck of cards and then deal 5 random cards each to 4 players.

// Create the deck.
const deck = iterable.map(
    iterable.product(
        ['Hearts', 'Diamonds', 'Clubs', 'Spades'],
        iterable.concat(iterable.range(2, 11), ['J', 'Q', 'K', 'A'])
    ),
    pair => { return { suit: pair[0], rank: pair[1] } }
);

// Shuffle the deck.
const shuffledDeck = random.shuffle(deck);

// Deal each player 5 cards.
const players = [
    { name: "Paul" },
    { name: "John" },
    { name: "George" },
    { name: "Ringo" }
];

for (const player of players) {
    player.hand = [...iterable.take(5, shuffledDeck)];
    console.log(`${player.name}'s hand: ${JSON.stringify(player.hand)}`);
}