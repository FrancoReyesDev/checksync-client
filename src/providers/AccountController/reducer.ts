import {initHandler} from 'src/providers/AccountController/transitions/initHandler.js';
import {execHandler} from 'src/providers/AccountController/transitions/execHandler.js';
import {loginHandler} from 'src/providers/AccountController/transitions/loginHandler.js';
import {backHandler} from 'src/providers/AccountController/transitions/backHandler.js';
import {fetchHandler} from './transitions/fetchHandler.js';
import {scrapHandler} from './transitions/scrapHandler.js';
import {AccountControllerState} from 'src/types/providers/accountController/states.js';
import {AccountControllerAction} from 'src/types/providers/accountController/actions.js';
import {TransitionsMachine} from 'src/types/providers/common.js';

export const reducer = (
	state: AccountControllerState,
	action: AccountControllerAction,
): AccountControllerState => {
	const transitions: TransitionsMachine<
		AccountControllerState,
		AccountControllerAction
	> = {
		initial: {
			init: initHandler,
		},
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
