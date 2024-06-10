import React, {
	Dispatch,
	createContext,
	useContext,
	useEffect,
	useReducer,
} from 'react';

import {reducer} from './reducer.js';
// import {initialEffect} from './effects/initial.js';
import {statusEffect} from './effects/status.js';
// import {scrapEffect} from './effects/scrap.js';
import {loginEffect} from './effects/login.js';

import {ScraperControllerAction} from '../../types/providers/scraperController/actions.js';
import {EffectsMachine} from '../../types/providers/common.js';
import {
	IdleState,
	// InitialState,
	ScraperControllerState,
} from '../../types/providers/scraperController/states.js';
import {Scraper} from 'checksync-scraper';

const initialState: IdleState = {
	state: 'idle',
	scraper: {} as Scraper,
	scraperStatus: {logged: false, working: false, sessionExpirationTimeStamp: 0},
};

const context = createContext<
	[ScraperControllerState, Dispatch<ScraperControllerAction>]
>([initialState, () => {}]);

export const ScraperControllerProvider: React.FC<{
	children: React.ReactNode;
	scraper: Scraper;
}> = ({children, scraper}) => {
	const scraperControllerReducer = useReducer(reducer, {
		...initialState,
		scraper,
	});
	const [state, dispatch] = scraperControllerReducer;

	useEffect(() => {
		const effectsMachine: EffectsMachine<
			ScraperControllerState,
			ScraperControllerAction
		> = {
			status: statusEffect,
			// scrap: scrapEffect,
			login: loginEffect,
		};

		const stateEffect = effectsMachine[state.state];
		stateEffect !== undefined && stateEffect(state, dispatch);
	}, [state]);

	return (
		<context.Provider value={scraperControllerReducer}>
			{children}
		</context.Provider>
	);
};

export const useScraperController = () => useContext(context);
