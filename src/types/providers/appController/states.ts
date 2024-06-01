import {Config} from 'checksync-scraper/types/Config.js';

export type ExitDialogState = {
	state: 'exitDialog';
};
export type AccountSelector_AppControllerState = {
	state: 'accountSelector';
};

export type AccountController_AppControllerState = {
	state: 'accountController';
	account: Config['accounts'][number];
};

export type AppControllerState =
	| AccountSelector_AppControllerState
	| AccountController_AppControllerState
	| ExitDialogState;
