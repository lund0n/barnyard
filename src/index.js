import { Observable, Scheduler } from 'rxjs/Rx'
import sceneRenderer from './scene-renderer'
import { steer } from './keycode-handlers'
import { isOutOfBounds } from './util'

const canvas = document.createElement('canvas')
canvas.width = 500
canvas.height = 400
document.body.appendChild(canvas)

const renderScene = sceneRenderer(canvas)

const FRAME_RATE = 30 // frames/second
const VELOCITY = 100 // pixels/second
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
	})
).sample(gameRate$)

const start$ = Observable.of(function() {
	return {
		icon: '🐷',
		alive: true,
		x: 400,
		y: 300,
	}
})
const position$ = vector$.map(
	({ x, y }) =>
		function(state) {
			return { ...state, x: state.x + x, y: state.y + y }
		}
)
Observable.merge(start$, position$)
	.scan((state, reducer) => {
		// Changes based on outside actions.
		const nextState = reducer(state)
		// Changes based on state changes.
		if (nextState.alive) {
			nextState.alive = !isOutOfBounds(
				nextState.x,
				nextState.y,
				canvas.width,
				canvas.height
			)
		}
		return nextState
	}, {})
	.subscribe(renderScene)
