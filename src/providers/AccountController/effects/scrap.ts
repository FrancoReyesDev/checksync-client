import {scrap} from 'checksync-scraper/lib/scrap.js';
import {ScrapState} from 'src/types/providers/accountController/states.js';
import {
	Scrap_ErrorAction,
	Scrap_InitialAction,
	Scrap_SuccessAction,
} from 'src/types/providers/accountController/actions.js';
import {AccountControllerEffect} from 'src/types/providers/accountController/common.js';

export const scrapEffect: AccountControllerEffect = (state, dispatch) => {
	const {status, account, sessionCookies, statusData} = state as ScrapState;
	if (status === 'initial') {
		return dispatch({type: 'scrap'} satisfies Scrap_InitialAction);
	}

	if (status === 'loading') {
		if (sessionCookies === undefined)
			return dispatch({
				type: 'scrap',
				error: 'Primero debes loguear',
			} satisfies Scrap_ErrorAction);

		scrap({account, sessionCookies, statusData}).then(res =>
			'error' in res
				? dispatch({
						type: 'scrap',
						error: res.error,
				  } satisfies Scrap_ErrorAction)
				: dispatch({
						type: 'scrap',
						scrapData: res.data,
				  } satisfies Scrap_SuccessAction),
		);
	}
};
