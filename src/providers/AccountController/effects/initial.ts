import {useAppController} from 'src/providers/AppController/provider.js';
import {InitAction} from 'src/types/providers/accountController/actions.js';
import {AccountControllerEffect} from 'src/types/providers/accountController/common.js';
import {AccountController_AppControllerState} from 'src/types/providers/appController/states.js';

export const initialEffect: AccountControllerEffect = (_, dispatch) => {
	const [appState] = useAppController();

	dispatch({
		type: 'init',
		account: (appState as AccountController_AppControllerState).account,
	} satisfies InitAction);
};
