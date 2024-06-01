import React, {createContext, useContext, useReducer} from 'react';
import {AppControllerAction} from 'src/types/providers/appController/actions.js';
import {
	AccountSelector_AppControllerState,
	AppControllerState,
} from 'src/types/providers/appController/states.js';
import {reducer} from './reducer.js';

const initialState: AccountSelector_AppControllerState = {
	state: 'accountSelector',
};

const context = createContext<
	[AppControllerState, React.Dispatch<AppControllerAction>]
>([initialState, () => {}]);

export const AppControllerProvider: React.FC<{children: React.ReactNode}> = ({
	children,
}) => {
	const appReducer = useReducer(reducer, initialState);
	return <context.Provider value={appReducer}>{children}</context.Provider>;
};

export const useAppController = () => useContext(context);
