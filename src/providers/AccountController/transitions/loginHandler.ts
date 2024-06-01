import {LoginAction} from 'src/types/providers/accountController/actions.js';
import {AccountControllerTransition} from 'src/types/providers/accountController/common.js';
import {
	LoginState,
	Login_ErrorState,
	Login_LoadingState,
	Login_SuccessState,
} from 'src/types/providers/accountController/states.js';

export const loginHandler: AccountControllerTransition = (state, action) => {
	const {status, account} = state as LoginState;
	if (status === 'initial') {
		const {loginHandler} = action as LoginAction;
		return {
			...state,
			account,
			loginHandler,
			state: 'login',
			status: 'loading',
		} satisfies Login_LoadingState;
	}

	if (status === 'loading') {
		if ('error' in action) {
			return {
				...state,
				account,
				state: 'login',
				status: 'error',
				error: action.error,
			} satisfies Login_ErrorState;
		}

		if ('sessionCookies' in action) {
			return {
				...state,
				account,
				state: 'login',
				status: 'success',
				sessionCookies: action.sessionCookies,
			} satisfies Login_SuccessState;
		}
	}

	return state;
};
