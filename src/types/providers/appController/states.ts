import {Scraper, Scrapers} from 'checksync-scraper';

type State = {
	scrapers: Scrapers;
};

export interface ExitDialogState extends State {
	state: 'exitDialog';
}
export interface ScraperSelector_AppControllerState extends State {
	state: 'scraperSelector';
}

export interface ScraperController_AppControllerState extends State {
	state: 'scraperController';
	scraper: Scraper;
}

export type AppControllerState =
	| ScraperSelector_AppControllerState
	| ScraperController_AppControllerState
	| ExitDialogState;
