// import {ScraperControllerTransition} from 'src/types/providers/scraperController/common.js';
// import {
// 	ScrapState,
// 	Scrap_ErrorState,
// 	Scrap_LoadingState,
// 	Scrap_SuccessState,
// } from 'src/types/providers/scraperController/states.js';

// export const scrapHandler: ScraperControllerTransition = (state, action) => {
// 	const {status, scraper} = state as ScrapState;
// 	if (status === 'initial')
// 		return {
// 			state: 'scrap',
// 			status: 'loading',

// 			scraper,
// 		} satisfies Scrap_LoadingState;

// 	if (status === 'loading' && 'error' in action)
// 		return {
// 			state: 'scrap',
// 			status: 'error',
// 			error: action.error,
// 			scraper,
// 		} satisfies Scrap_ErrorState;

// 	if (status === 'loading' && 'scrapData' in action)
// 		return {
// 			state: 'scrap',
// 			status: 'success',
// 			scrapData: action.scrapData,
// 			scraper,
// 		} satisfies Scrap_SuccessState;

// 	return state;
// };
