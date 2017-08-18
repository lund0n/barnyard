import { Observable, Scheduler } from 'rxjs/Rx'
import _ from 'lodash'
import sceneRenderer from './scene-renderer'
import { steer } from './keycode-handlers'
import { isOutOfBounds } from './util'

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

const start$ = Observable.of(function() {
	return {
		icon: '🐷',
		color: '#00f',
		alive: true,
		bearing: '?',
		points: [{ x: 400, y: 300 }],
	}
})
const position$ = vector$.map(
	({ x, y, bearing }) =>
		function(state) {
			const lastPos = state.points[state.points.length - 1]
			const nextPos = { x: lastPos.x + x, y: lastPos.y + y }
			if (
				state.points.length === 0 ||
				(bearing !== state.bearing && bearing !== '?')
			) {
				return {
					...state,
					bearing,
					points: state.points.concat(nextPos),
				}
			}
			return {
				...state,
				bearing,
				points: state.points.slice(0, -1).concat(nextPos),
			}
		}
)
const isNotInBounds = (width, height) => state => {
	if (state.alive) {
		const currentPos = state.points[state.points.length - 1]
		return {
			...state,
			alive: !isOutOfBounds(currentPos.x, currentPos.y, width, height),
		}
	}
	return state
}

const stateReducers = _.flowRight(isNotInBounds(WIDTH, HEIGHT))

Observable.merge(start$, position$)
	.scan((state, reducer) => {
		return stateReducers(reducer(state))
	}, {})
	.subscribe(renderScene)
