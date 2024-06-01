import {ExecAction} from 'src/types/providers/accountController/actions.js';
import {AccountControllerTransition} from 'src/types/providers/accountController/common.js';
import {
	AccountControllerState,
	IdleState,
	Login_InitialState,
	Scrap_InitialState,
	Status_InitialState,
} from 'src/types/providers/accountController/states.js';
import {States} from 'src/types/providers/common.js';

export const execHandler: AccountControllerTransition = (state, action) => {
	const {target} = action as ExecAction;
	const {account} = state as IdleState;

	if ('status' in state && state.status === 'loading') return state;
	const execMachine: Record<Exclude<States, 'idle'>, AccountControllerState> = {
		login: {
			...state,
			state: 'login',
			status: 'initial',
			account,
		} satisfies Login_InitialState,
		logout: {
			// solo quitamos las cookies de sesion, pero luego iran al servidor y borraran una entrada
			...state,
			state: 'idle',
			sessionCookies: undefined,
			account,
		} satisfies IdleState,
		status: {
			...state,

			state: 'status',
			status: 'initial',
			account,
		} satisfies Status_InitialState,
		scrap: {
			...state,

			state: 'scrap',
			status: 'initial',
			account,
		} satisfies Scrap_InitialState,
	};

	return execMachine[target];
};
