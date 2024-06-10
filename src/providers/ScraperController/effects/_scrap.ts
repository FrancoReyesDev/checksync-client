// // import {scrap} from 'checksync-scraper/lib/scrap.js';
// // import {ScrapState} from 'src/types/providers/scraperController/states.js';
// import {
// 	Scrap_ErrorAction,
// 	Scrap_InitialAction,
// 	Scrap_SuccessAction,
// } from 'src/types/providers/scraperController/actions.js';
// import {ScraperControllerEffect} from 'src/types/providers/scraperController/common.js';

// export const scrapEffect: ScraperControllerEffect = (state, dispatch) => {
// 	const {status, scraper} = state as ScrapState;
// 	if (status === 'initial') {
// 		return dispatch({type: 'scrap'} satisfies Scrap_InitialAction);
// 	}

// 	if (status === 'loading') {
// 		if (scraper.getSessionCookies().length === 0)
// 			return dispatch({
// 				type: 'scrap',
// 				error: 'Primero debes loguear',
// 			} satisfies Scrap_ErrorAction);

// 		scraper.scrap(true);
// 		dispatch({
// 			type: 'scrap',
// 			scrapData: 'fake scrap',
// 		} satisfies Scrap_SuccessAction);

// 		// scrap({account, sessionCookies, statusData}).then(res =>
// 		// 	'error' in res
// 		// 		? dispatch({
// 		// 				type: 'scrap',
// 		// 				error: res.error,
// 		// 		  } satisfies Scrap_ErrorAction)
// 		// 		: dispatch({
// 		// 				type: 'scrap',
// 		// 				scrapData: res.data,
// 		// 		  } satisfies Scrap_SuccessAction),
// 		// );
// 	}
// };
