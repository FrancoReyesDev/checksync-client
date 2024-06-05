import {States} from '../providers/common.js';
import {
	ScraperControllerState,
	IdleState,
} from '../providers/scraperController/states.js';

export type LogMachine = {
	[state in Exclude<States, 'idle' | 'initial'>]: {
		[status in
			| Exclude<ScraperControllerState, IdleState>['status']
			| 'default']: string;
	};
};
