import React, {
	Dispatch,
	createContext,
	useContext,
	useEffect,
	useReducer,
} from 'react';

import {reducer} from './reducer.js';
import {initialEffect} from './effects/initial.js';
import {statusEffect} from './effects/status.js';
import {scrapEffect} from './effects/scrap.js';
import {loginEffect} from './effects/login.js';
import {
	InitialState,
	AccountControllerState,
} from 'src/types/providers/accountController/states.js';
import {AccountControllerAction} from 'src/types/providers/accountController/actions.js';
import {EffectsMachine} from 'src/types/providers/common.js';

const initialState: InitialState = {state: 'initial'};

const context = createContext<
	[AccountControllerState, Dispatch<AccountControllerAction>]
>([initialState, () => {}]);

export const AccountControllerProvider: React.FC<{
	children: React.ReactNode;
}> = ({children}) => {
	const accountControllerReducer = useReducer(reducer, initialState);
	const [state, dispatch] = accountControllerReducer;

	useEffect(() => {
		const effectsMachine: EffectsMachine<
			AccountControllerState,
			AccountControllerAction
		> = {
			initial: initialEffect,
			status: statusEffect,
			scrap: scrapEffect,
			login: loginEffect,
		};

		const stateEffect = effectsMachine[state.state];
		stateEffect !== undefined && stateEffect(state, dispatch);
	}, [state]);

	return (
		<context.Provider value={accountControllerReducer}>
			{children}
		</context.Provider>
	);
};

export const useAccountController = () => useContext(context);
