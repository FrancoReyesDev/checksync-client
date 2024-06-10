// import {Config} from 'checksync-scraper/types/Config.js';
// import {Cookie} from 'puppeteer';
import {States} from '../common.js';
import {Scraper, ScraperStatus} from 'checksync-scraper';

// Actions
export type Fetch_InitialAction = {
	type: 'fetch';
};

export interface Fetch_SuccessAction extends Fetch_InitialAction {
	scraperStatus: ScraperStatus;
}

export interface Fetch_ErrorAction extends Fetch_InitialAction {
	error: string;
}

export type Scrap_InitialAction = {
	type: 'scrap';
};

export interface Scrap_ErrorAction extends Scrap_InitialAction {
	error: string;
}

export interface Scrap_SuccessAction extends Scrap_InitialAction {
	scrapData: string;
}

export type ScrapAction =
	| Scrap_InitialAction
	| Scrap_ErrorAction
	| Scrap_SuccessAction;

export type BackAction = {
	type: 'back';
};

export type ExecAction = {
	type: 'exec';
	target: Exclude<States, 'idle'>;
};

export type FetchAction =
	| Fetch_InitialAction
	| Fetch_SuccessAction
	| Fetch_ErrorAction;

export type Login_InitialAction = {
	type: 'login';
	launchLogin: Scraper['launchLogin'];
};

export interface Login_ErrorAction extends Login_InitialAction {
	error: string;
}

export interface Login_SuccessAction extends Login_InitialAction {
	// sessionCookies: Cookie[];
}

export type LoginAction =
	| Login_InitialAction
	| Login_ErrorAction
	| Login_SuccessAction;

export type ScraperControllerAction =
	| ScrapAction
	| BackAction
	| FetchAction
	| ExecAction
	| LoginAction;
