import {LoginHandler} from 'checksync-scraper/lib/loginClosure.js';
import {Config} from 'checksync-scraper/types/Config.js';
import {Cookie} from 'puppeteer';
import {States} from '../common.js';

// Actions
export type InitAction = {
	type: 'init';
	account: Config['accounts'][number];
};
export type Fetch_InitialAction = {
	type: 'fetch';
};

export interface Fetch_SuccessAction extends Fetch_InitialAction {
	statusData: {lastId: string; cookiesExpiration: number};
}

export interface Fetch_ErrorAction extends Fetch_InitialAction {
	error: string;
}

export type Scrap_InitialAction = {
	type: 'scrap';
};

export interface Scrap_LoadingAction extends Scrap_InitialAction {
	account: Config['accounts'][number];
	sessionCookies: Cookie[];
}

export interface Scrap_ErrorAction extends Scrap_InitialAction {
	error: string;
}

export interface Scrap_SuccessAction extends Scrap_InitialAction {
	scrapData: string;
}

export type ScrapAction =
	| Scrap_InitialAction
	| Scrap_LoadingAction
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
	loginHandler: LoginHandler;
};

export interface Login_ErrorAction extends Login_InitialAction {
	error: string;
}

export interface Login_SuccessAction extends Login_InitialAction {
	sessionCookies: Cookie[];
}

export type LoginAction =
	| Login_InitialAction
	| Login_ErrorAction
	| Login_SuccessAction;

export type AccountControllerAction =
	| ScrapAction
	| BackAction
	| FetchAction
	| InitAction
	| ExecAction
	| LoginAction;
