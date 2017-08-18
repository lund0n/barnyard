function drawBackground({ canvas, context }) {
	context.fillStyle = '#000'
	context.fillRect(0, 0, canvas.width, canvas.height)
}

function drawPlayer({ context }, { icon, x, y }) {
	const size = 20
	context.font = '20px sans-serif'
	context.textBaseline = 'top'
	context.fillText(icon, x - size / 2 - 1, y - size / 2 + 1, size)
}

function drawTrail({ context }, { color, points }) {
	context.lineWidth = 4
	context.lineCap = 'round'
	context.lineJoin = 'round'
	context.strokeStyle = color
	context.beginPath()
	points.forEach(({ x, y }, i) => {
		if (i === 0) {
			context.moveTo(x, y)
		} else {
			context.lineTo(x, y)
		}
	})
	context.stroke()
}

function drawGameOver({ canvas, context }) {
	context.font = '48px serif'
	context.textAlign = 'center'
	context.textBaseline = 'alphabetic'
	context.fillStyle = '#fc0'
	context.fillText('Game Over', canvas.width / 2, canvas.height / 2)
}

const sceneRenderer = canvas => {
	const context = canvas.getContext('2d')
	const helpers = { canvas, context }
	return function(player) {
		if (player.alive) {
			const head = { ...player, ...player.points[player.points.length - 1] }
			drawBackground(helpers)
			drawTrail(helpers, player)
			drawPlayer(helpers, head)
		} else {
			drawGameOver(helpers)
		}
	}
}

export default sceneRenderer
