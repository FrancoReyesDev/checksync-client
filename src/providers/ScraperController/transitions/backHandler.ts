import {ScraperControllerTransition} from '../../../types/providers/scraperController/common.js';
import {IdleState} from 'src/types/providers/scraperController/states.js';

export const backHandler: ScraperControllerTransition = state => {
	const {scraper} = state;

	return 'status' in state && state.status !== 'loading'
		? ({state: 'idle', scraper} satisfies IdleState)
		: state;
};
