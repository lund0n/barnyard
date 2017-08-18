import { Observable, Scheduler } from 'rxjs/Rx'

export const msElapsed = (
	frameRate = 60,
	scheduler = Scheduler.animationFrame
) =>
	// Wrap in defer() so that start is calculated when observable is created.
	Observable.defer(() => {
		const start = scheduler.now()

		return Observable.interval(1000 / frameRate, scheduler).map(
			() => scheduler.now() - start
		)
	})
