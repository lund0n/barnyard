import { BehaviorSubject, Observable, Scheduler } from 'rxjs/Rx'
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

const noop = Observable.never()
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

const vectorControl$ = new BehaviorSubject(true).switchMap(
	on => (on ? vector$ : noop)
)

const socket$ = Observable.webSocket(
	process.env.NODE_ENV === 'production'
		? 'wss://' + window.location.hostname
		: 'ws://' + window.location.hostname + ':3000'
)
socket$
	.sample(gameRate$)
	.do(({ alive }) => {
		if (!alive) {
			vectorControl$.next(false)
		}
	})
	.subscribe(renderScene)

vectorControl$
	.map(payload => JSON.stringify({ type: 'update-vector', payload }))
	.subscribe(socket$)
