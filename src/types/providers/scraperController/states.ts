import {
	LoginClientHandler,
	// LoginHandler,
	Scraper,
} from 'checksync-scraper';
// import {Cookie} from 'puppeteer';

// States

interface State {
	scraper: Scraper;
}

export interface IdleState extends State {
	state: 'idle';
}

export interface Login_InitialState extends State {
	state: 'login';
	status: 'initial';
}

export interface Login_LoadingState extends State {
	state: 'login';
	status: 'loading';
	loginHandler: LoginClientHandler;
}

export interface Login_ErrorState extends State {
	state: 'login';
	status: 'error';
	error: string;
}

export interface Login_SuccessState extends State {
	state: 'login';
	status: 'success';
}

export type LoginState =
	| Login_InitialState
	| Login_ErrorState
	| Login_LoadingState
	| Login_SuccessState;

export interface Logout_InitialState extends State {
	state: 'logout';
	status: 'initial';
}

export interface Logout_LoadingState extends State {
	state: 'logout';
	status: 'loading';
}
export interface Logout_ErrorState extends State {
	state: 'logout';
	status: 'error';
	error: string;
}

export interface Logout_SuccessState extends State {
	state: 'logout';
	status: 'success';
}

export type LogoutState =
	| Logout_InitialState
	| Logout_ErrorState
	| Logout_SuccessState
	| Logout_LoadingState;

export interface Status_InitialState extends State {
	state: 'status';
	status: 'initial';
}

export interface Status_LoadingState extends State {
	state: 'status';
	status: 'loading';
}

export interface Status_ErrorState extends State {
	state: 'status';
	status: 'error';
	error: string;
}

export interface Status_SuccessState extends State {
	state: 'status';
	status: 'success';
	statusData: {lastId: string; cookiesExpiration: number};
}

export type StatusState =
	| Status_InitialState
	| Status_LoadingState
	| Status_ErrorState
	| Status_SuccessState;

export interface Scrap_InitialState extends State {
	state: 'scrap';
	status: 'initial';
}

export interface Scrap_LoadingState extends State {
	state: 'scrap';
	status: 'loading';
}

export interface Scrap_ErrorState extends State {
	state: 'scrap';
	status: 'error';
	error: string;
}

export interface Scrap_SuccessState extends State {
	state: 'scrap';
	status: 'success';
	scrapData: string;
}

export type ScrapState =
	| Scrap_ErrorState
	| Scrap_InitialState
	| Scrap_LoadingState
	| Scrap_SuccessState;

export type ScraperControllerState =
	| IdleState
	| LoginState
	| LogoutState
	| StatusState
	| ScrapState;
