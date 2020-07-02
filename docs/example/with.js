'use strict';
const iterable = require('../../dist/iterable');
const random = require('../../dist/random');

// Create a deck of cards and then deal 5 random cards to 4 players, each.

// Create the deck.
const deck = iterable.map(
    iterable.product(
        ['Hearts', 'Diamonds', 'Clubs', 'Spades'],
        // TODO: issues with iterating over a generator multiple times
        [...iterable.concat(iterable.range(2, 11), ['J', 'Q', 'K', 'A'])]
    ),
    x => { return { suit: x[0], rank: x[1] } }
);

// Shuffle the deck.
// TODO: issues with iterating over a generator multiple times
const shuffledDeck = [...random.shuffle(deck)];

// Deal each player 5 cards.
const players = [
    { name: "Paul" },
    { name: "John" },
    { name: "George" },
    { name: "Ringo" }
];

for (const player of players) {
    // TODO: issues with iterating over a generator multiple times
    // player.hand = [...shurffledDeck.take(5)];
    player.hand = [];
    for (let i = 0; i < 5; i++) {
        player.hand.push(shuffledDeck.pop());
    }
    console.log(`${player.name}'s hand: ${JSON.stringify(player.hand)}`);
}