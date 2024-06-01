import {InitAction} from 'src/types/providers/accountController/actions.js';
import {AccountControllerTransition} from 'src/types/providers/accountController/common.js';
import {Status_InitialState} from 'src/types/providers/accountController/states.js';

export const initHandler: AccountControllerTransition = (state, action) =>
	({
		...state,
		state: 'status',
		status: 'initial',

		account: (action as InitAction).account,
	} satisfies Status_InitialState);
