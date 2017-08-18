## Barnyard

A simple game to demonstrate using Browser tech (and RxJS) to build a simple network game.

* [slides](https://docs.google.com/presentation/d/1Ib80GSRHJDP5fhUyfSO7bTaHvbba2hYvB9Hyie2B5rM/edit?usp=sharing)

### Quick Start

```bash
$ git clone https://github.com/lund0n/barnyard
$ cd barnyard
$ yarn install # or npm install
$ yarn dev # or yarn start on barnyard-basic and barnyard-trail branches
```

### Task List

- [x] Move the player
- [x] Checkout for out of bounds
- [x] Add player's trail
- [x] Add collision detection
- [x] Randomize starting position, icon character, and trail color
- [x] Move state management to web sockets
- [ ] Add start, ending, and replay game management
- [ ] Render multiple players
- [ ] Multiple player collision detection
- [ ] Allow multiple players to sign up for a single game
- [ ] Multiple game creation and management

### Available branches:

* `master` - latest code
* `barnyard-basic` - moving the animal around, checks out of bounds conditions.
* `barnyard-trail` - adds the trail behind the animal, adds collision detection.
* `barnyard-network` - moves the state to the server, uses web sockets for data interchange.

### Deploy to now.sh

```bash
now # Yes, that's it!
```
