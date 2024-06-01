import {StatusState} from 'src/types/providers/accountController/states.js';
import {Fetch_SuccessAction} from 'src/types/providers/accountController/actions.js';
import {AccountControllerEffect} from 'src/types/providers/accountController/common.js';

export const statusEffect: AccountControllerEffect = (state, dispatch) => {
	const {status} = state as StatusState;
	if (status === 'initial') return dispatch({type: 'fetch'});
	if (status === 'loading') {
		// Get status
		const fetch = async () => {
			setTimeout(() => {
				//fake status success
				dispatch({
					type: 'fetch',
					statusData: {
						lastId: '75755260635',
						cookiesExpiration: 1719759874000,
					},
				} satisfies Fetch_SuccessAction);
			}, 10);
		};

		fetch();
	}

	// if (status === 'success' || status === 'error')
	// 	return dispatch({type: 'back'});
};
