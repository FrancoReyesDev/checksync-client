// import {initHandler} from 'src/providers/ScraperController/transitions/initHandler.js';
import {execHandler} from '../../providers/ScraperController/transitions/execHandler.js';
import {loginHandler} from '../../providers/ScraperController/transitions/loginHandler.js';
import {backHandler} from '../../providers/ScraperController/transitions/backHandler.js';
import {fetchHandler} from './transitions/fetchHandler.js';
import {scrapHandler} from './transitions/scrapHandler.js';

import {TransitionsMachine} from '../../types/providers/common.js';
import {ScraperControllerState} from '../../types/providers/scraperController/states.js';
import {ScraperControllerAction} from '../../types/providers/scraperController/actions.js';

export const reducer = (
	state: ScraperControllerState,
	action: ScraperControllerAction,
): ScraperControllerState => {
	const transitions: TransitionsMachine<
		ScraperControllerState,
		ScraperControllerAction
	> = {
		idle: {
			exec: execHandler,
		},
		login: {
			login: loginHandler,
			back: backHandler,
			exec: execHandler,
		},
		logout: {},
		status: {
			fetch: fetchHandler,
			back: backHandler,
			exec: execHandler,
		},
		scrap: {
			scrap: scrapHandler,
			back: backHandler,
			exec: execHandler,
		},
	};

	return transitions[state.state]?.[action.type]?.(state, action) ?? state;
};
