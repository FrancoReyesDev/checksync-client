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
	IdleState,
	InitAction,
	InitialState,
	Login_InitialState,
	Logout_InitialState,
	Scrap_InitialState,
	StateMachine,
	Status_ErrorState,
	Status_InitialState,
	Status_LoadingState,
	Status_SuccessState,
	WithStatusState,
} from './types/index.js';

const initialState: InitialState = {state: 'initial'};
const context = createContext<
	[AccountControllerState, Dispatch<AccountControllerAction>]
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
		idle: {
			exec: (state, action) => {
				const {target} = action as ExecAction;
				const {account, logged} = state as IdleState;

				if ('status' in state && state.status === 'loading') return state;
				const execMachine: Record<Actions, AccountControllerState> = {
					login: {
						state: 'login',
						status: 'initial',
						account,
						logged,
					} satisfies Login_InitialState,
					logout: {
						state: 'logout',
						status: 'initial',
						account,
						logged,
					} satisfies Logout_InitialState,
					status: {
						state: 'status',
						status: 'initial',
						account,
						logged,
					} satisfies Status_InitialState,
					scrap: {
						state: 'scrap',
						status: 'initial',
						account,
						logged,
					} satisfies Scrap_InitialState,
				};

				return execMachine[target];
			},
		},
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
					const {account} = state as Status_LoadingState;
					if ('data' in action)
						return {
							account,
							state: 'status',
							status: 'success',
							logged: true,
							data: action.data,
						} satisfies Status_SuccessState;
					if ('error' in action) {
						return {
							account,
							state: 'status',
							status: 'error',
							logged: false,
						} as Status_ErrorState;
					}
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
				const {status} = state as WithStatusState;
				if (status === 'initial') return dispatch({type: 'fetch'});
				if (status === 'loading') {
					// Get status
					const fetch = async () => {
						setTimeout(() => {
							dispatch({type: 'fetch', data: 'logged'});
						}, 2000);
					};

					return fetch();
				}
				if (status === 'success')
					return dispatch({type: 'fetch', data: 'conexion correcta'});
				if (status === 'error')
					return dispatch({type: 'fetch', error: 'error de conexion'});
				// if (status === 'success' || status === 'error')
				// 	return dispatch({type: 'back'});
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
