import React, {createContext, useContext, useReducer} from 'react';
import {AppControllerAction} from 'src/types/providers/appController/actions.js';
import {
	ScraperSelector_AppControllerState,
	AppControllerState,
} from 'src/types/providers/appController/states.js';
import {reducer} from './reducer.js';
import {Manager} from 'checksync-scraper/dist/index.js';

const initialState: ScraperSelector_AppControllerState = {
	state: 'scraperSelector',
	scrapers: {} as ScraperSelector_AppControllerState['scrapers'],
};

const context = createContext<
	[AppControllerState, React.Dispatch<AppControllerAction>]
>([initialState, () => {}]);

export const AppControllerProvider: React.FC<{
	children: React.ReactNode;
	scrapers: ReturnType<Manager>['scrapers'];
}> = ({children, scrapers}) => {
	const appReducer = useReducer(reducer, {...initialState, scrapers});
	return <context.Provider value={appReducer}>{children}</context.Provider>;
};

export const useAppController = () => useContext(context);
