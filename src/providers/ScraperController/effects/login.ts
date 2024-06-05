import {
	LoginState,
	Login_LoadingState,
} from 'src/types/providers/scraperController/states.js';
import {
	Login_ErrorAction,
	Login_SuccessAction,
} from 'src/types/providers/scraperController/actions.js';
import {ScraperControllerEffect} from 'src/types/providers/scraperController/common.js';

export const loginEffect: ScraperControllerEffect = (state, dispatch) => {
	const {status, scraper} = state as LoginState;

	if (status === 'initial') {
		dispatch({
			type: 'login',
			loginHandler: scraper.loginClientHandler(),
		});

		return;
	}

	if (status === 'loading') {
		const {loginHandler} = state as Login_LoadingState;
		const {login} = loginHandler;
		login().then(res => {
			if (!res)
				// and login in server.
				return dispatch({
					type: 'login',
					error: 'error al loguear, vuelva a intentarlo',
					loginHandler,
				} satisfies Login_ErrorAction);

			dispatch({
				loginHandler,
				type: 'login',
			} satisfies Login_SuccessAction);
		});
	}
};
