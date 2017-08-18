import { Observable, Scheduler } from 'rxjs/Rx'
import sceneRenderer from './scene-renderer'
import { steer } from './keycode-handlers'

const WIDTH = 500
const HEIGHT = 400
const FRAME_RATE = 60 // frames/second
const VELOCITY = 100 // pixels/second

const canvas = document.createElement('canvas')
canvas.width = WIDTH
canvas.height = HEIGHT
document.body.appendChild(canvas)

const renderScene = sceneRenderer(canvas)

const gameRate = (frameRate = 60, scheduler = Scheduler.animationFrame) =>
	Observable.interval(1000 / frameRate, scheduler).map(() => scheduler.now())

const gameRate$ = gameRate(FRAME_RATE)
const velocity$ = gameRate$
	.pairwise()
	.map(([prev, current]) => current - prev)
	.map(ms => VELOCITY * ms / 1000)
const keyCode$ = Observable.fromEvent(document, 'keydown').pluck('keyCode')
const direction$ = keyCode$.let(steer)
const vector$ = Observable.combineLatest(
	velocity$,
	direction$,
	(velocity, { x, y }) => ({
		x: velocity * x,
		y: velocity * y,
		bearing: x !== 0 ? 'H' : y !== 0 ? 'V' : '?',
	})
).sample(gameRate$)

const socket$ = Observable.webSocket(
	'ws://' + window.location.hostname + ':3000'
)
socket$.subscribe(renderScene)

vector$
	.map(payload => JSON.stringify({ type: 'update-vector', payload }))
	.subscribe(socket$)
