const randomColor = require('random-color')
const getAnimal = require('./animals')
const { isCollision, isOutOfBounds, randomPoint } = require('./util')

const newPlayer = (width, height) => () => ({
	icon: getAnimal(),
	color: randomColor().hexString(),
	alive: true,
	bearing: '?',
	points: [{ x: randomPoint(width), y: randomPoint(height) }],
})

const isNotInBounds = (width, height) => state => {
	if (state.alive) {
		const currentPos = state.points[state.points.length - 1]
		return Object.assign(state, {
			alive: !isOutOfBounds(currentPos.x, currentPos.y, width, height),
		})
	}
	return state
}

const hasCollision = state => {
	if (state.alive) {
		const currentPos = state.points[state.points.length - 1]
		return Object.assign(state, {
			alive:
				state.points.length <= 2 ||
				!isCollision(currentPos.x, currentPos.y, state.points.slice(0, -1)),
		})
	}
	return state
}

module.exports = { newPlayer, isNotInBounds, hasCollision }
