import {
	AppControllerAction,
	SelectScraperAction,
} from 'src/types/providers/appController/actions.js';
import {
	ScraperController_AppControllerState,
	ScraperSelector_AppControllerState,
	AppControllerState,
	ExitDialogState,
} from 'src/types/providers/appController/states.js';
import {TransitionsMachine} from 'src/types/providers/common.js';

const back = (state: AppControllerState) =>
	({...state, state: 'exitDialog'} satisfies ExitDialogState);

export const reducer = (
	state: AppControllerState,
	action: AppControllerAction,
): AppControllerState => {
	const transitions: TransitionsMachine<
		AppControllerState,
		AppControllerAction
	> = {
		exitDialog: {
			cancelExit: state =>
				({
					...state,
					state: 'scraperSelector',
				} satisfies ScraperSelector_AppControllerState),
		},
		scraperSelector: {
			back: back,
			select: (state, action) =>
				({
					...state,
					state: 'scraperController',
					scraper: (action as SelectScraperAction).scraper,
				} satisfies ScraperController_AppControllerState),
		},
		scraperController: {
			back: back,
			backToExit: state => ({...state, state: 'exitDialog'}),
		},
	};

	return transitions?.[state.state]?.[action.type]?.(state, action) ?? state;
};
