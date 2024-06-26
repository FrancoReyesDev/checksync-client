import React, {useState} from 'react';
import {Box, Newline, Text, useInput} from 'ink';

import {
	Login_ErrorState,
	Logout_ErrorState,
	// Scrap_ErrorState,
	Status_ErrorState,
} from '../types/providers/scraperController/states.js';
import {useAppController} from '../providers/AppController/provider.js';
import {
	ScraperControllerProvider,
	useScraperController,
} from '../providers/ScraperController/provider.js';
import {States} from '../types/providers/common.js';
import {ScraperController_AppControllerState} from '../types/providers/appController/states.js';
import {LogMachine} from '../types/views/ScraperController.js';

const ScraperControllerView: React.FC = () => {
	const [appState, appDispatch] = useAppController();
	const [state, dispatch] = useScraperController();

	const {scrapers} = appState;

	const [selectedAction, setSelectedAction] =
		useState<Exclude<States, 'idle'>>('login');

	const actionsKeys: Exclude<States, 'idle'>[] = ['status', 'login', 'logout'];

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
			// scrap: {
			// 	default: 'Scrapea ahora mismo en local y revisa los pasos del bot',
			// 	error: 'Ha ocurrido un error: ' + (state as Scrap_ErrorState).error,
			// 	success: 'Se ha scrapeado con exito!',
			// 	loading: 'Scrapeando...',
			// 	initial: 'Iniciando scraper',
			// },
			status: {
				default: 'Consulta el estado de la conexion',
				error: 'Ha ocurrido un error: ' + (state as Status_ErrorState).error,
				success: 'Consulta exitosa!',
				loading: 'Cargando consulta...',
				initial: 'Enviando consulta',
			},
		};

		const log =
			('status' in state && logMachine?.[state.state]?.[state.status]) ||
			logMachine[selectedAction]['default'];

		const status = 'status' in state ? state.status : 'idle';

		return {log, status};
	};

	const {status, log} = getActionLog();

	useInput((_, key) => {
		// if (_ === 'c') console.log(state.scraper.getSessionCookies());

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
				? Object.keys(scrapers).length === 1
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
							(
								appState as ScraperController_AppControllerState
							).scraper.getConfig().color
						}
						bold
					>
						{
							(
								appState as ScraperController_AppControllerState
							).scraper.getConfig().name
						}
					</Text>
				</Text>
				<Text>
					Estado:{' '}
					<Text bold color={state.scraper.getStatus().logged ? 'green' : 'red'}>
						{state.scraper.getStatus().logged ? 'logueado' : 'sin loguear'}
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

export const ScraperController: React.FC = () => {
	const [state] = useAppController();

	return (
		<ScraperControllerProvider
			scraper={(state as ScraperController_AppControllerState).scraper}
		>
			<ScraperControllerView />
		</ScraperControllerProvider>
	);
};
