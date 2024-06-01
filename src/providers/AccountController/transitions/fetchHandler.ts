import {AccountControllerTransition} from 'src/types/providers/accountController/common.js';
import {
	IdleState,
	StatusState,
	Status_ErrorState,
	Status_LoadingState,
	Status_SuccessState,
} from 'src/types/providers/accountController/states.js';

export const fetchHandler: AccountControllerTransition = (state, action) => {
	const {status, account} = state as StatusState;
	if (status === 'initial')
		return {
			...state,
			account,
			state: 'status',
			status: 'loading',
		} satisfies Status_LoadingState;

	if (status === 'loading') {
		if ('statusData' in action)
			return {
				...state,
				account,
				state: 'status',
				status: 'success',
				statusData: action.statusData,
			} satisfies Status_SuccessState;
		if ('error' in action) {
			return {
				...state,
				account,
				state: 'status',
				status: 'error',
				error: action.error,
			} satisfies Status_ErrorState;
		}
	}

	// Actualmente fetch no funciona, es sintetico, pero luego recibira la informacion desde el servidor.
	if (status === 'error' || status === 'success')
		return {
			...state,
			account: account,
			state: 'idle',
			statusData: 'statusData' in state ? state.statusData : undefined,
			sessionCookies:
				'sessionCookies' in state ? state.sessionCookies : undefined,
		} satisfies IdleState;

	return state;
};
