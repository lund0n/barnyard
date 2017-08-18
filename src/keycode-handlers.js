export const toDirection = obs =>
	obs
		// convert key into vector direction
		.map(keyCode => {
			switch (keyCode) {
				case 65: // a
					return { x: -1, y: 0 }
				case 68: // d
					return { x: 1, y: 0 }
				case 87: // w
					return { x: 0, y: -1 }
				case 83: // s
					return { x: 0, y: 1 }
			}
		})
		// start w/o movement
		.startWith({ x: 0, y: 0 })
		// remove any undefined values (caused by pressing unsupported keys)
		.filter(vector => vector)

const directions = [
	{ x: -1, y: 0 },
	{ x: 0, y: -1 },
	{ x: 1, y: 0 },
	{ x: 0, y: 1 },
]

export const steer = obs =>
	obs
		// Select direction to rotate around array.
		.map(keyCode => {
			switch (keyCode) {
				case 65: // a
					return -1
				case 68: // d
					return 1
				default:
					// anything else, don't turn.
					return 0
			}
		})
		// Start by going left.
		.startWith(0)
		// Select index of new vector to use.
		.scan(
			(prev, curr) =>
				prev + curr < 0
					? directions.length - 1
					: (prev + curr) % directions.length
		)
		// Return vector matching index.
		.map(direction => directions[direction])
