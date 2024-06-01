import {AccountControllerTransition} from 'src/types/providers/accountController/common.js';
import {
	IdleState,
	WithStatusState,
} from 'src/types/providers/accountController/states.js';

export const backHandler: AccountControllerTransition = state => {
	const {account, status} = state as WithStatusState;
	return status === 'loading'
		? state
		: ({...state, state: 'idle', account} satisfies IdleState);
};
