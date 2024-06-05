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
		const {loginHandler} = action as LoginAction;
		return {
			scraper,
			loginHandler,
			state: 'login',
			status: 'loading',
		} satisfies Login_LoadingState;
	}

	if (status === 'loading') {
		if ('error' in action) {
			return {
				scraper,
				state: 'login',
				status: 'error',
				error: action.error,
			} satisfies Login_ErrorState;
		}

		if (scraper.getSessionCookies().length > 0) {
			return {
				scraper,
				state: 'login',
				status: 'success',
			} satisfies Login_SuccessState;
		}
	}

	return state;
};
