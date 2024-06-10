import {ScraperControllerTransition} from '../../../types/providers/scraperController/common.js';
import {
	IdleState,
	StatusState,
	Status_ErrorState,
	Status_LoadingState,
	Status_SuccessState,
} from '../../../types/providers/scraperController/states.js';

export const fetchHandler: ScraperControllerTransition = (state, action) => {
	const {status, scraper} = state as StatusState;
	if (status === 'initial')
		return {
			scraper,
			state: 'status',
			status: 'loading',
			scraperStatus: state.scraperStatus,
		} satisfies Status_LoadingState;

	if (status === 'loading') {
		if ('scraperStatus' in action)
			return {
				scraper,
				state: 'status',
				status: 'success',

				scraperStatus: state.scraperStatus,
			} satisfies Status_SuccessState;
		if ('error' in action) {
			return {
				scraper,
				state: 'status',
				status: 'error',
				error: action.error,
				scraperStatus: state.scraperStatus,
			} satisfies Status_ErrorState;
		}
	}

	if (status === 'error' || status === 'success')
		return {
			scraper,
			state: 'idle',
			scraperStatus: state.scraperStatus,
		} satisfies IdleState;

	return state;
};
