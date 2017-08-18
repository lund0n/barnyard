const PLAYER_SIZE = 20
const HALF_SIZE = PLAYER_SIZE / 2

// Ensures random point is far enough away from edges
// to keep player from immediately crashing.
export function randomPoint(max) {
	return Math.floor(Math.random() * max - 100) + 50
}

export function isCollision(x, y, points) {
	// box1 is size of player.
	const box1 = {
		x0: x - HALF_SIZE,
		y0: y - HALF_SIZE,
		x1: x + HALF_SIZE,
		y1: y + HALF_SIZE,
	}
	for (let i = 0; i < points.length - 2; i++) {
		const box2 = {
			...sortX(points[i].x, points[i + 1].x),
			...sortY(points[i].y, points[i + 1].y),
		}
		if (collidesWithBox(box1, box2)) {
			return true
		}
	}
	return false
}

export function isOutOfBounds(x, y, width, height) {
	return (
		x - HALF_SIZE < 0 ||
		x + HALF_SIZE > width ||
		y - HALF_SIZE < 0 ||
		y + HALF_SIZE > height
	)
}

function sortX(x0, x1) {
	return x0 < x1 ? { x0, x1 } : { x0: x1, x1: x0 }
}

function sortY(y0, y1) {
	return y0 < y1 ? { y0, y1 } : { y0: y1, y1: y0 }
}

export function collidesWithBox(box1, box2) {
	return (
		box1.x0 < box2.x1 &&
		box1.x1 > box2.x0 &&
		box1.y0 < box2.y1 &&
		box1.y1 > box2.y0
	)
}
