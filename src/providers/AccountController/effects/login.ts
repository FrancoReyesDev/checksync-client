import {loginClosure} from 'checksync-scraper/lib/loginClosure.js';

import {
	LoginState,
	Login_LoadingState,
} from 'src/types/providers/accountController/states.js';
import {
	Login_ErrorAction,
	Login_SuccessAction,
} from 'src/types/providers/accountController/actions.js';
import {AccountControllerEffect} from 'src/types/providers/accountController/common.js';

export const loginEffect: AccountControllerEffect = (state, dispatch) => {
	const {status, account} = state as LoginState;

	if (status === 'initial') {
		loginClosure(account.loginUrl, account.loggedInPathHint).then(
			loginHandler => {
				dispatch({type: 'login', loginHandler});
			},
		);
		return;
	}
	if (status === 'loading') {
		const {loginHandler} = state as Login_LoadingState;
		const {login} = loginHandler;
		login().then(res => {
			if ('error' in res)
				return dispatch({
					type: 'login',
					error: res.error,
					loginHandler,
				} satisfies Login_ErrorAction);
			if ('cookies' in res)
				dispatch({
					sessionCookies: res.cookies,
					loginHandler,
					type: 'login',
				} satisfies Login_SuccessAction);
		});
	}
};
