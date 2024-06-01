import {
	AppControllerAction,
	SelectAccountAction,
} from 'src/types/providers/appController/actions.js';
import {
	AccountController_AppControllerState,
	AppControllerState,
	ExitDialogState,
} from 'src/types/providers/appController/states.js';
import {TransitionsMachine} from 'src/types/providers/common.js';

export const reducer = (
	state: AppControllerState,
	action: AppControllerAction,
): AppControllerState => {
	const transitions: TransitionsMachine<
		AppControllerState,
		AppControllerAction
	> = {
		exitDialog: {
			cancelExit: () => ({state: 'accountSelector'}),
		},
		accountSelector: {
			back: () => ({state: 'exitDialog'} satisfies ExitDialogState),
			select: (_, action) =>
				({
					state: 'accountController',
					account: (action as SelectAccountAction).account,
				} satisfies AccountController_AppControllerState),
		},
		accountController: {
			back: () => ({state: 'accountSelector'}),
			backToExit: () => ({state: 'exitDialog'}),
		},
	};

	return transitions?.[state.state]?.[action.type]?.(state, action) ?? state;
};
