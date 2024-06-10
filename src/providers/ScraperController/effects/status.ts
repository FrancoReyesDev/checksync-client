import {StatusState} from 'src/types/providers/scraperController/states.js';
import {
	Fetch_ErrorAction,
	Fetch_SuccessAction,
} from 'src/types/providers/scraperController/actions.js';
import {ScraperControllerEffect} from 'src/types/providers/scraperController/common.js';
import {getStatus} from 'src/services/checksync-server/getStatus.js';

export const statusEffect: ScraperControllerEffect = (state, dispatch) => {
	const {status} = state as StatusState;
	if (status === 'initial') return dispatch({type: 'fetch'});
	if (status === 'loading') {
		getStatus(state.scraper.getConfig().name).then(res => {
			if ('error' in res)
				return {
					type: 'fetch',
					error: 'error al conseguir el status.',
				} satisfies Fetch_ErrorAction;
			return {type: 'fetch', scraperStatus: res} satisfies Fetch_SuccessAction;
		});
	}

	// if (status === 'success' || status === 'error')
	// 	return dispatch({type: 'back'});
};
