import {Scraper} from 'checksync-scraper';

export type CancelExit = {
	type: 'cancelExit';
};
export type BackAction = {
	type: 'back';
};

export type SelectScraperAction = {
	type: 'select';
	scraper: Scraper;
};

export type BackToExit = {
	type: 'backToExit';
};

/**
 * Posible Actions
 */
export type AppControllerAction =
	| BackAction
	| SelectScraperAction
	| CancelExit
	| BackToExit;
