import React, {
	Dispatch,
	createContext,
	useContext,
	useEffect,
	useReducer,
} from 'react';
import {Config} from '../config.js';
import {
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

interface Login_InitialState extends FetchedState {
	state: 'login';
	status: 'initial';
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

type LoginState =
	| Login_InitialState
	| Login_ErrorState
	| Login_LoadingState
	| Login_SuccessState;

interface Logout_InitialState extends FetchedState {
	state: 'logout';
	status: 'initial';
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

type LogoutState =
	| Logout_InitialState
	| Logout_ErrorState
	| Logout_SuccessState
	| Logout_LoadingState;

interface Status_InitialState extends FetchedState {
	state: 'status';
	status: 'initial';
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

type StatusState =
	| Status_InitialState
	| Status_LoadingState
	| Status_ErrorState
	| Status_SuccessState;

interface Scrap_InitialState extends FetchedState {
	state: 'scrap';
	status: 'initial';
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

type ScrapState =
	| Scrap_ErrorState
	| Scrap_InitialState
	| Scrap_LoadingState
	| Scrap_SuccessState;

type WithStatusState = LoginState | LogoutState | StatusState | ScrapState;

type AccountControllerState = InitialState | IdleState | WithStatusState;
// Actions
type InitAction = {
	type: 'init';
	account: Config['accounts'][number];
};
type Fetch_InitialAction = {
	type: 'fetch';
};

interface Fetch_SuccessAction extends Fetch_InitialAction {
	data: string;
}

interface Fetch_ErrorAction extends Fetch_InitialAction {
	error: string;
}

type BackAction = {
	type: 'back';
};

type FetchAction =
	| Fetch_InitialAction
	| Fetch_SuccessAction
	| BackAction
	| Fetch_ErrorAction;

type AccountControllerAction = FetchAction | InitAction;

type EffectsMachine = {
	[state in AccountControllerState['state']]?: (
		state: AccountControllerState,
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
	const stateMachine: StateMachine = {
		initial: {
			init: (_, action) => ({
				state: 'status',
				logged: false,
				status: 'initial',
				account: (action as InitAction).account,
			}),
		},
		idle: {},
		login: {},
		logout: {},
		status: {
			fetch: (state, action) => {
				const {status} = state as WithStatusState;
				if (status === 'initial')
					return {
						...state,
						state: 'status',
						status: 'loading',
						logged: false,
					} as WithStatusState;
				if (status === 'loading') {
					if ('data' in action)
						return {
							...state,
							state: 'status',
							status: 'success',
							logged: true,
						} as WithStatusState;
					if ('error' in action)
						return {
							...state,
							state: 'status',
							status: 'error',
							logged: false,
						} as WithStatusState;
				}
				return state;
			},
			back: state => {
				const {account, logged, status} = state as WithStatusState;
				return status === 'loading' ? state : {state: 'idle', account, logged};
			},
		},
		scrap: {},
	};

	console.log({state, action});
	return stateMachine[state.state]?.[action.type]?.(state, action) ?? state;
};

export const AccountControllerProvider: React.FC<{
	children: React.ReactNode;
}> = ({children}) => {
	const [appState] = useApp();
	const accountControllerReducer = useAccountController();
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		console.log('soy un efecto');
		const effectsMachine: EffectsMachine = {
			initial: () =>
				dispatch({
					type: 'init',
					account: (appState as AppAccountControllerState).account,
				}),
			status: () => {
				const {status} = state as WithStatusState;
				if (status === 'initial') return dispatch({type: 'fetch'});
				if (status === 'loading') {
					// Get status
					() => {};

					return dispatch({type: 'fetch', data: 'logged'});
				}
			},
		};

		const stateEffect = effectsMachine[state.state];
		stateEffect !== undefined && stateEffect(state);
	}, [state]);

	return (
		<context.Provider value={accountControllerReducer}>
			{children}
		</context.Provider>
	);
};

export const useAccountController = () => useContext(context);
