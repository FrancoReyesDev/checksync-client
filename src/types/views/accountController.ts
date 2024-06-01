import {WithStatusState} from '../providers/accountController/states.js';
import {States} from '../providers/common.js';

export type LogMachine = {
	[state in Exclude<States, 'idle' | 'initial'>]: {
		[status in WithStatusState['status'] | 'default']: string;
	};
};
