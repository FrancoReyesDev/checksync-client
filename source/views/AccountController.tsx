import React, {useState} from 'react';
import {Box, Newline, Text, useInput} from 'ink';
import {AccountControllerState, useApp} from '../providers/AppProvider.js';
import {config} from '../config.js';
// import {login} from '../lib/login.js';

type Actions = 'login' | 'logout' | 'status' | 'scrap';
type ValidButtons = 'escape' | 'leftArrow' | 'rightArrow' | 'return';

type InputActionMachine = {
	[button in ValidButtons]: {
		default: () => void;
		working?: {
			[action in Actions]?: () => void;
		};
	};
};

export const AccountController: React.FC = () => {
	const [state, dispatch] = useApp();
	const [selectedAction, setSelectedAction] = useState<Actions>('login');
	const [isLogged] = useState(false);
	const [working, setWorking] = useState(false);

	const accounts = config.accounts.map(({id}) => id);

	const actions: Record<Actions, string> = {
		login: 'loguea en tu cuenta o cambia de cuenta.',
		logout: 'cerrar sesion.',
		status: 'consultar estado del scraper.',
		scrap: 'scrapear ahora.',
	};

	const inputActionMachine: InputActionMachine = {
		escape: {
			default: () =>
				accounts.length === 1
					? dispatch({type: 'backToExit'})
					: dispatch({type: 'back'}),
			working: {
				login: () => setWorking(false),
			},
		},
		leftArrow: {
			default: () =>
				setSelectedAction(current => {
					const actionsKeys = Object.keys(actions);
					const indexOfCurrent = actionsKeys.indexOf(current);

					return actionsKeys[indexOfCurrent - 1] !== undefined
						? (actionsKeys[indexOfCurrent - 1] as Actions)
						: current;
				}),
		},
		rightArrow: {
			default: () =>
				setSelectedAction(current => {
					const actionsKeys = Object.keys(actions);
					const indexOfCurrent = actionsKeys.indexOf(current);

					return actionsKeys[indexOfCurrent + 1] !== undefined
						? (actionsKeys[indexOfCurrent + 1] as Actions)
						: current;
				}),
		},
		return: {
			default: () => setWorking(true),
		},
	};

	useInput((_, key) => {
		let button = '';
		if (key.escape) button = 'escape';

		if (key.leftArrow) button = 'leftArrow';

		if (key.rightArrow) button = 'rightArrow';

		if (key.return) button = 'return';

		const actionMachine = inputActionMachine[button as ValidButtons];
		const workingAction = actionMachine?.working?.[selectedAction as Actions];
		const defaultAction = actionMachine.default;

		if (working) {
			return workingAction ? workingAction() : defaultAction();
		}

		return defaultAction();
	});

	return (
		<Box flexDirection="column">
			<Box flexDirection="column" marginBottom={1}>
				<Text>
					Cuenta:{' '}
					<Text
						backgroundColor={(state as AccountControllerState).account.color}
						bold
					>
						{(state as AccountControllerState).account.id}
					</Text>
				</Text>
				<Text>
					Estado:{' '}
					<Text bold color={isLogged ? 'green' : 'red'}>
						{isLogged ? 'logueado' : 'sin loguear'}
					</Text>
				</Text>
			</Box>

			<Text>
				<Text backgroundColor={'black'}> : </Text>
				{actions[selectedAction]}
			</Text>
			<Box gap={1}>
				<Newline />
				<Text backgroundColor={'black'}>{'<'}</Text>
				{Object.keys(actions).map(actionKey => {
					const isSelected = actionKey === selectedAction;
					return (
						<Text
							key={actionKey}
							backgroundColor={isSelected ? 'white' : 'black'}
						>
							{' '}
							{actionKey}{' '}
						</Text>
					);
				})}
				<Text backgroundColor={'black'}>{'>'}</Text>
			</Box>
		</Box>
	);
};
