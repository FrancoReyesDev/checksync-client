import React, {useState} from 'react';
import {Box, Newline, Text, useInput} from 'ink';
import {
	AccountControllerState as AppAccountControllerState,
	useApp,
} from '../providers/AppProvider.js';
import {
	AccountControllerProvider,
	useAccountController,
} from '../providers/AccountControllerProvider/index.js';
import {
	Actions,
	AccountControllerState,
	WithStatusState,
	Login_ErrorState,
	Scrap_ErrorState,
	Logout_ErrorState,
} from '../providers/AccountControllerProvider/types/index.js';
import {config} from '../config.js';

type LogMachine = {
	[state in Exclude<AccountControllerState['state'], 'idle' | 'initial'>]: {
		[status in WithStatusState['status'] | 'default']: string;
	};
};

const AccountControllerView: React.FC = () => {
	const [appState, appDispatch] = useApp();
	const [state, dispatch] = useAccountController();

	const [selectedAction, setSelectedAction] = useState<Actions>('login');

	const actionsKeys: Actions[] = ['status', 'login', 'scrap', 'logout'];

	const getActionLog = () => {
		const logMachine: LogMachine = {
			login: {
				default: 'Loguea en una nueva cuenta o actualiza la cuenta',
				error: 'Ha ocurrido un error: ' + (state as Login_ErrorState).error,
				success: 'Se ha logueado con exito!',
				loading: 'Loguea en la ventana emergente',
				initial: 'Iniciando Login',
			},
			logout: {
				default: 'Logout de cuenta',
				error: 'Ha ocurrido un error: ' + (state as Logout_ErrorState).error,
				success: 'Se ha deslogueado con exito!',
				loading: 'Deslogueando...',
				initial: 'Iniciando deslogueo',
			},
			scrap: {
				default: 'Scrapea ahora mismo en local y revisa los pasos del bot',
				error: 'Ha ocurrido un error: ' + (state as Scrap_ErrorState).error,
				success: 'Se ha scrapeado con exito!',
				loading: 'Enviando peticion...',
				initial: 'Iniciando scraper',
			},
			status: {
				default: 'Consulta el estado de la conexion',
				error: 'Ha ocurrido un error: ' + (state as Scrap_ErrorState).error,
				success: 'Consulta exitosa!',
				loading: 'Cargando consulta...',
				initial: 'Enviando consulta',
			},
		};

		return 'status' in state &&
			logMachine[state.state] !== undefined &&
			logMachine[state.state][state.status] !== undefined
			? {log: logMachine[state.state][state.status]}
			: {log: logMachine[selectedAction]['default'], status: 'idle'};
	};

	const {status, log} = getActionLog();

	useInput((_, key) => {
		if (_ === 'c') console.log(state);

		if ((key.leftArrow || key.rightArrow) && state.state !== 'idle')
			dispatch({type: 'back'});

		if (key.leftArrow)
			return setSelectedAction(current => {
				const currentIndex = actionsKeys.indexOf(current);
				return actionsKeys[currentIndex - 1] || current;
			});

		if (key.rightArrow)
			return setSelectedAction(current => {
				const currentIndex = actionsKeys.indexOf(current);
				return actionsKeys[currentIndex + 1] || current;
			});

		if (key.return) return dispatch({type: 'exec', target: selectedAction});

		if (key.escape)
			return state.state === 'idle'
				? config.accounts.length === 1
					? appDispatch({type: 'backToExit'})
					: appDispatch({type: 'back'})
				: dispatch({type: 'back'});
	});

	return (
		<Box flexDirection="column">
			<Box flexDirection="column" marginBottom={1}>
				<Text>
					Cuenta:{' '}
					<Text
						backgroundColor={
							(appState as AppAccountControllerState).account.color
						}
						bold
					>
						{(appState as AppAccountControllerState).account.id}
					</Text>
				</Text>
				<Text>
					Estado:{' '}
					<Text bold color={'sessionCookies' in state ? 'green' : 'red'}>
						{'sessionCookies' in state ? 'logueado' : 'sin loguear'}
					</Text>
				</Text>
			</Box>

			<Text>
				<Text
					backgroundColor={
						status === 'error'
							? 'red'
							: status === 'success'
							? 'green'
							: status === 'loading'
							? 'cyan'
							: 'black'
					}
				>
					{' '}
					:{' '}
				</Text>
				<Text
					color={
						status === 'error'
							? 'red'
							: status === 'success'
							? 'green'
							: status === 'loading'
							? 'cyan'
							: 'black'
					}
				>
					{' '}
					{log}
				</Text>
			</Text>
			<Box gap={1}>
				<Newline />
				<Text backgroundColor={'black'}>{'<'}</Text>
				{actionsKeys.map(actionKey => {
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

export const AccountController: React.FC = () => (
	<AccountControllerProvider>
		<AccountControllerView />
	</AccountControllerProvider>
);
