import {AccountControllerTransition} from 'src/types/providers/accountController/common.js';
import {
	Scrap_ErrorState,
	Scrap_LoadingState,
	Scrap_SuccessState,
	WithStatusState,
} from 'src/types/providers/accountController/states.js';

export const scrapHandler: AccountControllerTransition = (state, action) => {
	const {status, account} = state as WithStatusState;
	if (status === 'initial')
		return {
			...state,
			state: 'scrap',
			status: 'loading',

			account,
		} satisfies Scrap_LoadingState;

	if (status === 'loading' && 'error' in action)
		return {
			...state,
			state: 'scrap',
			status: 'error',
			error: action.error,
			account,
		} satisfies Scrap_ErrorState;

	if (status === 'loading' && 'scrapData' in action)
		return {
			...state,
			state: 'scrap',
			status: 'success',
			scrapData: action.scrapData,
			account,
		} satisfies Scrap_SuccessState;

	return state;
};
