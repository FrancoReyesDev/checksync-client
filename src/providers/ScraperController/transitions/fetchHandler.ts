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
		} satisfies Status_LoadingState;

	if (status === 'loading') {
		if ('statusData' in action)
			return {
				scraper,
				state: 'status',
				status: 'success',
				statusData: action.statusData,
			} satisfies Status_SuccessState;
		if ('error' in action) {
			return {
				scraper,
				state: 'status',
				status: 'error',
				error: action.error,
			} satisfies Status_ErrorState;
		}
	}

	// Actualmente fetch no funciona, es sintetico, pero luego recibira la informacion desde el servidor. Basicamnete replicara la session cookie en las instancias locales y en la base de datos local guardara los movements del scraper.
	if (status === 'error' || status === 'success')
		return {
			scraper,
			state: 'idle',
		} satisfies IdleState;

	return state;
};
