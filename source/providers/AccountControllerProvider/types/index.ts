import {Cookie} from 'puppeteer';

import {Config} from '../../../config.js';
import {LoginHandler} from '../../../lib/login.js';

export type Actions = 'login' | 'logout' | 'status' | 'scrap';

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
	target: 'login' | 'logout' | 'status' | 'scrap';
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

export type EffectsMachine = {
	[state in AccountControllerState['state']]?: (
		state: AccountControllerState,
	) => void;
};

export type StateMachine = {
	[state in AccountControllerState['state']]: {
		[action in AccountControllerAction['type']]?: (
			state: AccountControllerState,
			action: AccountControllerAction,
		) => AccountControllerState;
	};
};
