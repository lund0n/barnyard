/* eslint-disable no-console */
const { Observable, Subject } = require('rxjs/Rx')
const _ = require('lodash')
const { hasCollision, isNotInBounds, newPlayer } = require('./reducers')

const WIDTH = 500
const HEIGHT = 400

module.exports = function connectionHandler(conn) {
	console.log('Connection established')

	const start$ = Observable.of(newPlayer(WIDTH, HEIGHT))
	const vector$ = new Subject({ x: 0, y: 0, bearing: '?' })
	const position$ = vector$.map(
		({ x, y, bearing }) =>
			function(state) {
				const lastPos = state.points[state.points.length - 1]
				const nextPos = { x: lastPos.x + x, y: lastPos.y + y }
				if (
					state.points.length === 0 ||
					(bearing !== state.bearing && bearing !== '?')
				) {
					return Object.assign(state, {
						bearing,
						points: state.points.concat(nextPos),
					})
				}
				return Object.assign(state, {
					bearing,
					points: state.points.slice(0, -1).concat(nextPos),
				})
			}
	)
	const stateReducers = _.flowRight(hasCollision, isNotInBounds(WIDTH, HEIGHT))

	const subscription = Observable.concat(start$, position$)
		.scan((state, reducer) => {
			return stateReducers(reducer(state))
		}, {})
		.subscribe(state => {
			conn.send(JSON.stringify(state))
		})

	conn.on('message', msg => {
		const action = JSON.parse(msg)
		switch (action.type) {
			case 'update-vector':
				vector$.next(action.payload)
				break
			default:
				break
		}
	})
	conn.on('close', () => {
		console.log('Connection closed.')
		if (subscription) {
			subscription.unsubscribe()
		}
	})
}
