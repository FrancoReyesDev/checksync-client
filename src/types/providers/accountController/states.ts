import {LoginHandler} from 'checksync-scraper/lib/loginClosure.js';
import {Config} from 'checksync-scraper/types/Config.js';
import {Cookie} from 'puppeteer';

// States

export interface FetchedState {
	account: Config['accounts'][number];
	statusData?: {lastId: string; cookiesExpiration: number};
	sessionCookies?: Cookie[];
}

export type InitialState = {
	state: 'initial';
};

export interface IdleState extends FetchedState {
	state: 'idle';
}

export interface Login_InitialState extends FetchedState {
	state: 'login';
	status: 'initial';
}

export interface Login_LoadingState extends FetchedState {
	state: 'login';
	status: 'loading';
	loginHandler: LoginHandler;
}

export interface Login_ErrorState extends FetchedState {
	state: 'login';
	status: 'error';
	error: string;
}

export interface Login_SuccessState extends FetchedState {
	state: 'login';
	status: 'success';
	sessionCookies: Cookie[];
}

export type LoginState =
	| Login_InitialState
	| Login_ErrorState
	| Login_LoadingState
	| Login_SuccessState;

export interface Logout_InitialState extends FetchedState {
	state: 'logout';
	status: 'initial';
}

export interface Logout_LoadingState extends FetchedState {
	state: 'logout';
	status: 'loading';
}
export interface Logout_ErrorState extends FetchedState {
	state: 'logout';
	status: 'error';
	error: string;
}

export interface Logout_SuccessState extends FetchedState {
	state: 'logout';
	status: 'success';
}

export type LogoutState =
	| Logout_InitialState
	| Logout_ErrorState
	| Logout_SuccessState
	| Logout_LoadingState;

export interface Status_InitialState extends FetchedState {
	state: 'status';
	status: 'initial';
}

export interface Status_LoadingState extends FetchedState {
	state: 'status';
	status: 'loading';
}

export interface Status_ErrorState extends FetchedState {
	state: 'status';
	status: 'error';
	error: string;
}

export interface Status_SuccessState extends FetchedState {
	state: 'status';
	status: 'success';
	statusData: {lastId: string; cookiesExpiration: number};
}

export type StatusState =
	| Status_InitialState
	| Status_LoadingState
	| Status_ErrorState
	| Status_SuccessState;

export interface Scrap_InitialState extends FetchedState {
	state: 'scrap';
	status: 'initial';
}

export interface Scrap_LoadingState extends FetchedState {
	state: 'scrap';
	status: 'loading';
}

export interface Scrap_ErrorState extends FetchedState {
	state: 'scrap';
	status: 'error';
	error: string;
}

export interface Scrap_SuccessState extends FetchedState {
	state: 'scrap';
	status: 'success';
	scrapData: string;
}

export type ScrapState =
	| Scrap_ErrorState
	| Scrap_InitialState
	| Scrap_LoadingState
	| Scrap_SuccessState;

export type WithStatusState =
	| LoginState
	| LogoutState
	| StatusState
	| ScrapState;

export type AccountControllerState = InitialState | IdleState | WithStatusState;
