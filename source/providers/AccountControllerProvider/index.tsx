import React, {
	Dispatch,
	createContext,
	useContext,
	useEffect,
	useReducer,
} from 'react';
import {
	AccountControllerState as AppAccountControllerState,
	useApp,
} from '../AppProvider.js';
import {
	AccountControllerAction,
	AccountControllerState,
	Actions,
	EffectsMachine,
	ExecAction,
	Fetch_SuccessAction,
	IdleState,
	InitAction,
	InitialState,
	LoginAction,
	LoginState,
	Login_ErrorAction,
	Login_ErrorState,
	Login_InitialState,
	Login_LoadingState,
	Login_SuccessAction,
	Login_SuccessState,
	// Logout_InitialState,
	ScrapState,
	Scrap_ErrorAction,
	Scrap_ErrorState,
	Scrap_InitialAction,
	Scrap_InitialState,
	Scrap_LoadingState,
	Scrap_SuccessAction,
	Scrap_SuccessState,
	StateMachine,
	StatusState,
	Status_ErrorState,
	Status_InitialState,
	Status_LoadingState,
	Status_SuccessState,
	WithStatusState,
} from './types/index.js';
import {prepareLoginHandler} from '../../lib/login.js';
import {scrap} from '../../lib/scrap.js';

const initialState: InitialState = {state: 'initial'};
const context = createContext<
	[AccountControllerState, Dispatch<AccountControllerAction>]
>([initialState, () => {}]);

const execHandler = (
	state: AccountControllerState,
	action: AccountControllerAction,
) => {
	const {target} = action as ExecAction;
	const {account} = state as IdleState;

	if ('status' in state && state.status === 'loading') return state;
	const execMachine: Record<Actions, AccountControllerState> = {
		login: {
			...state,
			state: 'login',
			status: 'initial',
			account,
		} satisfies Login_InitialState,
		logout: {
			// solo quitamos las cookies de sesion
			...state,
			state: 'idle',
			sessionCookies: undefined,
			account,
		} satisfies IdleState,
		status: {
			...state,

			state: 'status',
			status: 'initial',
			account,
		} satisfies Status_InitialState,
		scrap: {
			...state,

			state: 'scrap',
			status: 'initial',
			account,
		} satisfies Scrap_InitialState,
	};

	return execMachine[target];
};

const reducer = (
	state: AccountControllerState,
	action: AccountControllerAction,
): AccountControllerState => {
	const stateMachine: StateMachine = {
		initial: {
			init: (state, action) => ({
				...state,
				state: 'status',
				logged: false,
				status: 'initial',

				account: (action as InitAction).account,
			}),
		},
		idle: {
			exec: execHandler,
		},
		login: {
			login: (state, action) => {
				const {status, account} = state as LoginState;
				if (status === 'initial') {
					const {loginHandler} = action as LoginAction;
					return {
						...state,
						account,
						loginHandler,
						state: 'login',
						status: 'loading',
					} satisfies Login_LoadingState;
				}

				if (status === 'loading') {
					if ('error' in action) {
						return {
							...state,
							account,
							state: 'login',
							status: 'error',
							error: action.error,
						} satisfies Login_ErrorState;
					}

					if ('sessionCookies' in action) {
						return {
							...state,
							account,
							state: 'login',
							status: 'success',
							sessionCookies: action.sessionCookies,
						} satisfies Login_SuccessState;
					}
				}

				return state;
			},
			back: state => {
				const {account, status} = state as WithStatusState;
				return status === 'loading'
					? state
					: {...state, state: 'idle', account};
			},
			exec: (state, action) => {
				const {status} = state as WithStatusState;
				if (status === 'error' || status === 'success')
					return execHandler(state, action);
				return state;
			},
		},
		logout: {},
		status: {
			fetch: (state, action) => {
				const {status, account} = state as StatusState;
				if (status === 'initial')
					return {
						...state,
						account,
						state: 'status',
						status: 'loading',
					} satisfies Status_LoadingState;

				if (status === 'loading') {
					if ('statusData' in action)
						return {
							...state,
							account,
							state: 'status',
							status: 'success',
							statusData: action.statusData,
						} satisfies Status_SuccessState;
					if ('error' in action) {
						return {
							...state,
							account,
							state: 'status',
							status: 'error',
							error: action.error,
						} satisfies Status_ErrorState;
					}
				}

				if (status === 'error' || status === 'success')
					return {
						...state,
						account: (state as WithStatusState).account,
						state: 'idle',
						statusData: 'statusData' in state ? state.statusData : undefined,
						sessionCookies:
							'sessionCookies' in state ? state.sessionCookies : undefined,
					} satisfies IdleState;

				return state;
			},
			back: state => {
				const {account, status} = state as WithStatusState;
				return status === 'loading'
					? state
					: {...state, state: 'idle', account};
			},

			exec: (state, action) => {
				const {status} = state as WithStatusState;
				if (status === 'error' || status === 'success')
					return execHandler(state, action);
				return state;
			},
		},
		scrap: {
			scrap: (state, action) => {
				const {status, account} = state as WithStatusState;
				if (status === 'initial')
					return {
						...state,
						state: 'scrap',
						status: 'loading',

						account,
					} satisfies Scrap_LoadingState;

				if (status === 'loading' && 'error' in action)
					return {
						...state,
						state: 'scrap',
						status: 'error',
						error: action.error,
						account,
					} satisfies Scrap_ErrorState;

				if (status === 'loading' && 'scrapData' in action)
					return {
						...state,
						state: 'scrap',
						status: 'success',
						scrapData: action.scrapData,
						account,
					} satisfies Scrap_SuccessState;

				return state;
			},
			back: state => {
				const {account, status} = state as WithStatusState;
				return status === 'loading'
					? state
					: {...state, state: 'idle', account};
			},

			exec: (state, action) => {
				const {status} = state as WithStatusState;
				if (status === 'error' || status === 'success')
					return execHandler(state, action);
				return state;
			},
		},
	};

	return stateMachine[state.state]?.[action.type]?.(state, action) ?? state;
};

export const AccountControllerProvider: React.FC<{
	children: React.ReactNode;
}> = ({children}) => {
	const accountControllerReducer = useReducer(reducer, initialState);
	const [state, dispatch] = accountControllerReducer;
	const [appState] = useApp();

	useEffect(() => {
		const effectsMachine: EffectsMachine = {
			initial: () =>
				dispatch({
					type: 'init',
					account: (appState as AppAccountControllerState).account,
				}),
			status: () => {
				const {status} = state as StatusState;
				if (status === 'initial') return dispatch({type: 'fetch'});
				if (status === 'loading') {
					// Get status
					const fetch = async () => {
						setTimeout(() => {
							dispatch({
								type: 'fetch',
								statusData: 'logged',
							} satisfies Fetch_SuccessAction);
						}, 10);
					};

					fetch();
				}

				// if (status === 'success' || status === 'error')
				// 	return dispatch({type: 'back'});
			},
			scrap: () => {
				const {status, account, sessionCookies} = state as ScrapState;
				if (status === 'initial') {
					return dispatch({type: 'scrap'} satisfies Scrap_InitialAction);
				}

				if (status === 'loading') {
					if (sessionCookies === undefined)
						return dispatch({
							type: 'scrap',
							error: 'Primero debes loguear',
						} satisfies Scrap_ErrorAction);

					scrap({account, sessionCookies}).then(res =>
						'error' in res
							? dispatch({
									type: 'scrap',
									error: res.error,
							  } satisfies Scrap_ErrorAction)
							: dispatch({
									type: 'scrap',
									scrapData: res.data,
							  } satisfies Scrap_SuccessAction),
					);
				}
			},
			login: () => {
				const {status, account} = state as LoginState;

				if (status === 'initial') {
					prepareLoginHandler(account.loginUrl, account.loggedInPathHint).then(
						loginHandler => {
							dispatch({type: 'login', loginHandler});
						},
					);
					return;
				}
				if (status === 'loading') {
					const {loginHandler} = state as Login_LoadingState;
					const {login} = loginHandler;
					login().then(res => {
						if ('error' in res)
							return dispatch({
								type: 'login',
								error: res.error,
								loginHandler,
							} satisfies Login_ErrorAction);
						if ('cookies' in res)
							dispatch({
								sessionCookies: res.cookies,
								loginHandler,
								type: 'login',
							} satisfies Login_SuccessAction);
					});
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
