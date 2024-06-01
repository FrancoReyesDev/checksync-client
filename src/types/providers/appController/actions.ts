import {Config} from 'checksync-scraper/types/Config.js';

export type CancelExit = {
	type: 'cancelExit';
};
export type BackAction = {
	type: 'back';
};

export type SelectAccountAction = {
	type: 'select';
	account: Config['accounts'][number];
};

export type BackToExit = {
	type: 'backToExit';
};

/**
 * Posible Actions
 */
export type AppControllerAction =
	| BackAction
	| SelectAccountAction
	| CancelExit
	| BackToExit;
