import {
	LoginState,
	Login_LoadingState,
} from 'src/types/providers/scraperController/states.js';
import {
	Login_ErrorAction,
	Login_SuccessAction,
} from 'src/types/providers/scraperController/actions.js';
import {ScraperControllerEffect} from 'src/types/providers/scraperController/common.js';
import dotenv from 'dotenv';
import {Cookie} from 'puppeteer';
import {origin} from '../../../origin.js';
dotenv.config();

const loginOnServer = async ({sessionCookies}: {sessionCookies: Cookie[]}) => {
	const url = origin + '/mp/login';

	let headersList = {
		Accept: '*/*',
		'Content-Type': 'application/json',
	};

	const config: RequestInit = {
		method: 'POST',
		headers: headersList,
		cache: 'no-store',
		body: JSON.stringify({sessionCookies}),
	};

	const response = await fetch(url, config);

	return response.ok;
};

const startScrapRunner = async () => {
	const url = origin + '/mp/start';

	const config: RequestInit = {
		method: 'POST',
		cache: 'no-store',
	};

	const response = await fetch(url, config);

	return response.ok;
};

export const loginEffect: ScraperControllerEffect = (state, dispatch) => {
	const {status, scraper} = state as LoginState;

	if (status === 'initial') {
		dispatch({
			type: 'login',
			launchLogin: scraper.launchLogin,
		});

		return;
	}

	if (status === 'loading') {
		const {launchLogin} = state as Login_LoadingState;

		launchLogin().then(async res => {
			if ('error' in res)
				// and login in server.
				return dispatch({
					type: 'login',
					error: 'error al loguear, vuelva a intentarlo',
					launchLogin: launchLogin,
				} satisfies Login_ErrorAction);

			const loginOnServerResponse = await loginOnServer({
				sessionCookies: res.cookies,
			});

			if (!loginOnServerResponse)
				return dispatch({
					type: 'login',
					error: 'error al loguear en el servidor, vuelva a intentarlo',
					launchLogin,
				} satisfies Login_ErrorAction);

			startScrapRunner();

			dispatch({
				launchLogin,
				type: 'login',
			} satisfies Login_SuccessAction);
		});
	}
};
