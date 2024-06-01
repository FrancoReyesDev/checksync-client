import {
	AccountControllerState,
	WithStatusState,
} from 'src/types/providers/accountController/states.js';
import {execHandler} from './execHandler.js';
import {AccountControllerTransition} from 'src/types/providers/accountController/common.js';

export const execIfTerminalStatus: AccountControllerTransition = (
	state,
	action,
) => {
	const {status} = state as WithStatusState;
	if (status === 'error' || status === 'success')
		return execHandler(state, action);
	return state satisfies AccountControllerState;
};
