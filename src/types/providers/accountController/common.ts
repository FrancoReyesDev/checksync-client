import {Effect, Transition} from 'src/types/providers/common.js';
import {AccountControllerState} from './states.js';
import {AccountControllerAction} from './actions.js';

export type AccountControllerEffect = Effect<
	AccountControllerState,
	AccountControllerAction
>;

export type AccountControllerTransition = Transition<
	AccountControllerState,
	AccountControllerAction
>;
