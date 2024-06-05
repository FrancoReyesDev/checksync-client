import {Effect, Transition} from '../../../types/providers/common.js';
import {ScraperControllerState} from './states.js';
import {ScraperControllerAction} from './actions.js';

export type ScraperControllerEffect = Effect<
	ScraperControllerState,
	ScraperControllerAction
>;

export type ScraperControllerTransition = Transition<
	ScraperControllerState,
	ScraperControllerAction
>;
