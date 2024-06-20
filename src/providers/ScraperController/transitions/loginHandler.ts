import {LoginAction} from '../../../types/providers/scraperController/actions.js';
import {ScraperControllerTransition} from '../../../types/providers/scraperController/common.js';
import {
	LoginState,
	Login_ErrorState,
	Login_LoadingState,
	Login_SuccessState,
} from '../../../types/providers/scraperController/states.js';

export const loginHandler: ScraperControllerTransition = (state, action) => {
	const {status, scraper} = state as LoginState;
	if (status === 'initial') {
		const {launchLogin} = action as LoginAction;
		return {
			scraper,
			launchLogin,
			state: 'login',
			status: 'loading',
			scraperStatus: state.scraperStatus,
		} satisfies Login_LoadingState;
	}

	if (status === 'loading') {
		if ('error' in action) {
			return {
				scraper,
				state: 'login',
				status: 'error',
				error: action.error,
				scraperStatus: state.scraperStatus,
			} satisfies Login_ErrorState;
		}

		return {
			scraper,
			state: 'login',
			status: 'success',
			scraperStatus: state.scraperStatus,
		} satisfies Login_SuccessState;

		if (scraper.getStatus().logged) {
		}
	}

	return state;
};
