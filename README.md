# JavaScript Helpers

[![GitHub Actions build badge](https://github.com/brcrista/JavaScript-Helpers/workflows/CI/badge.svg)](https://github.com/brcrista/JavaScript-Helpers/actions?query=workflow%3ACI)


Zero-dependency library that makes coding in JavaScript a little nicer.

## Example

Consider some code to
1. create a deck of cards
1. deal 5 random cards each to 4 players

### Plain JavaScript

```js
'use strict';

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
```

### With JavaScript Helpers

```js
'use strict';
const iterable = require('js-helpers/iterable');
const random = require('js-helpers/random');

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
```