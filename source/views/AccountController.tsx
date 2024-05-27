import React from 'react';
import {Box, Newline, Text} from 'ink';
import {AccountControllerState, useApp} from '../providers/AppProvider.js';
import {
	AccountControllerProvider,
	useAccountController,
} from '../providers/AccountControllerProvider.js';
// import {login} from '../lib/login.js';

const AccountControllerView: React.FC = () => {
	const [appState] = useApp();
	const [state] = useAccountController();

	console.log(state);

	return (
		<Box flexDirection="column">
			<Box flexDirection="column" marginBottom={1}>
				<Text>
					Cuenta:{' '}
					<Text
						backgroundColor={(appState as AccountControllerState).account.color}
						bold
					>
						{(appState as AccountControllerState).account.id}
					</Text>
				</Text>
				<Text>
					Estado:{' '}
					{/* <Text bold color={isLogged ? 'green' : 'red'}>
						{isLogged ? 'logueado' : 'sin loguear'}
					</Text> */}
				</Text>
			</Box>

			<Text>
				<Text backgroundColor={'black'}> : </Text>
				{/* {actions[selectedAction]} */}
			</Text>
			<Box gap={1}>
				<Newline />
				<Text backgroundColor={'black'}>{'<'}</Text>
				{/* {Object.keys(actions).map(actionKey => {
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
				})} */}
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
