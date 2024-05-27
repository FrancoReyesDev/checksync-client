import React, {
	Dispatch,
	createContext,
	useContext,
	useEffect,
	useReducer,
} from 'react';
import {Config} from '../config.js';
import {
	AccountSelectorState,
	AccountControllerState as AppAccountControllerState,
	useApp,
} from './AppProvider.js';

// States
interface FetchedState {
	logged: boolean;
	account: Config['accounts'][number];
}

type InitialState = {
	state: 'initial';
};

interface IdleState extends FetchedState {
	state: 'idle';
}

interface Login_LoadingState extends FetchedState {
	state: 'login';
	status: 'loading';
}

interface Login_ErrorState extends FetchedState {
	state: 'login';
	status: 'error';
	error: string;
}

interface Login_SuccessState extends FetchedState {
	state: 'login';
	status: 'success';
	data: string;
}

interface Logout_LoadingState extends FetchedState {
	state: 'logout';
	status: 'loading';
}
interface Logout_ErrorState extends FetchedState {
	state: 'logout';
	status: 'error';
	error: string;
}

interface Logout_SuccessState extends FetchedState {
	state: 'logout';
	status: 'success';
	data: string;
}

interface Status_LoadingState extends FetchedState {
	state: 'status';
	status: 'loading';
}

interface Status_ErrorState extends FetchedState {
	state: 'status';
	status: 'error';
	error: string;
}

interface Status_SuccessState extends FetchedState {
	state: 'status';
	status: 'success';
	data: string;
}

interface Scrap_LoadingState extends FetchedState {
	state: 'scrap';
	status: 'loading';
}

interface Scrap_ErrorState extends FetchedState {
	state: 'scrap';
	status: 'error';
	error: string;
}

interface Scrap_SuccessState extends FetchedState {
	state: 'scrap';
	status: 'loading';
	data: string;
}

type WithStatusState =
	| Login_LoadingState
	| Login_ErrorState
	| Login_SuccessState
	| Logout_LoadingState
	| Logout_ErrorState
	| Logout_SuccessState
	| Status_LoadingState
	| Status_ErrorState
	| Status_SuccessState
	| Scrap_LoadingState
	| Scrap_ErrorState
	| Scrap_SuccessState;

type AccountControllerState = InitialState | IdleState | WithStatusState;
// Actions
type InitAction = {
	type: 'init';
	account: Config['accounts'][number];
};

type AccountControllerAction = InitAction;

type EffectsMachine = {
	[state in AccountControllerState['state']]?: (
		state: AccountControllerState,
		action: AccountControllerAction,
	) => void;
};

type StateMachine = {
	[state in AccountControllerState['state']]: {
		[action in AccountControllerAction['type']]?: (
			state: AccountControllerState,
			action: AccountControllerAction,
		) => AccountControllerState;
	};
};

const initialState: InitialState = {state: 'initial'};
const context = createContext<
	[AccountControllerState, Dispatch<AccountControllerState>]
>([initialState, () => {}]);

const reducer = (
	state: AccountControllerState,
	action: AccountControllerAction,
): AccountControllerState => {
	action;
	return state;
};

export const AccountControllerProvider: React.FC<{
	children: React.ReactNode;
}> = ({children}) => {
	const [appState] = useApp();
	const accountControllerReducer = useAccountController();
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		const effectsMachine: EffectsMachine = {
			initial: () =>
				dispatch({
					type: 'init',
					account: (appState as AppAccountControllerState).account,
				}),
		};
	}, [appState]);

	return (
		<context.Provider value={accountControllerReducer}>
			{children}
		</context.Provider>
	);
};

export const useAccountController = () => useContext(context);
