import {ExecAction} from '../../../types/providers/scraperController/actions.js';
import {ScraperControllerTransition} from '../../../types/providers/scraperController/common.js';
import {
	ScraperControllerState,
	IdleState,
	Login_InitialState,
	// Scrap_InitialState,
	Status_InitialState,
} from '../../../types/providers/scraperController/states.js';
import {States} from '../../../types/providers/common.js';

export const execHandler: ScraperControllerTransition = (state, action) => {
	const {target} = action as ExecAction;
	const {scraper} = state;

	if ('status' in state && state.status === 'loading') return state;

	const execMachine: Record<Exclude<States, 'idle'>, ScraperControllerState> = {
		login: {
			state: 'login',
			status: 'initial',
			scraper,
			scraperStatus: state.scraperStatus,
		} satisfies Login_InitialState,

		logout: {
			// meanwhile nothing
			state: 'idle',
			scraper,
			scraperStatus: state.scraperStatus,
		} satisfies IdleState,

		status: {
			state: 'status',
			status: 'initial',
			scraper,
			scraperStatus: state.scraperStatus,
		} satisfies Status_InitialState,

		// scrap: {
		// 	state: 'scrap',
		// 	status: 'initial',
		// 	scraper,
		// } satisfies Scrap_InitialState,
	};

	return execMachine[target];
};
