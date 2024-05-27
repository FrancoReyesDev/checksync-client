import React, {createContext, useContext, useReducer} from 'react';
import {Config} from '../config.js';

// States
export type ExitDialogState = {
	view: 'exitDialog';
};
export type AccountSelectorState = {
	view: 'accountSelector';
};

export type AccountControllerState = {
	view: 'accountController';
	account: Config['accounts'][number];
};

/**
 * Posible States
 */
type AppState = AccountSelectorState | AccountControllerState | ExitDialogState;

// Actions
type CancelExit = {
	type: 'cancelExit';
};
type BackAction = {
	type: 'back';
};

type SelectAccountAction = {
	type: 'select';
	account: Config['accounts'][number];
};

type BackToExit = {
	type: 'backToExit';
};

/**
 * Posible Actions
 */
type AppAction = BackAction | SelectAccountAction | CancelExit | BackToExit;

type AppStateMachine = {
	[state in AppState['view']]: {
		[action in AppAction['type']]?: (
			state: AppState,
			action: AppAction,
		) => AppState;
	};
};

const initialState: AccountSelectorState = {view: 'accountSelector'};

const context = createContext<[AppState, React.Dispatch<AppAction>]>([
	initialState,
	() => {},
]);

const reducer = (state: AppState, action: AppAction): AppState => {
	const stateMachine: AppStateMachine = {
		exitDialog: {
			cancelExit: () => ({view: 'accountSelector'}),
		},
		accountSelector: {
			back: () => ({view: 'exitDialog'}),
			select: (_, action) => ({
				view: 'accountController',
				account: (action as SelectAccountAction).account,
			}),
		},
		accountController: {
			back: () => ({view: 'accountSelector'}),
			backToExit: () => ({view: 'exitDialog'}),
		},
	};

	return stateMachine[state.view] !== undefined &&
		stateMachine[state.view][action.type] !== undefined
		? stateMachine[state.view][action.type]!(state, action)
		: state;
};

export const AppProvider: React.FC<{children: React.ReactNode}> = ({
	children,
}) => {
	const appReducer = useReducer(reducer, initialState);
	return <context.Provider value={appReducer}>{children}</context.Provider>;
};

export const useApp = () => useContext(context);
