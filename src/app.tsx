import React from 'react';
import {Box, Text} from 'ink';
import {AccountSelector} from './views/AccountSelector.js';
import {AccountController} from './views/AccountController.js';
import {ExitDialog} from './views/ExitDialog.js';
import {
	AppControllerProvider,
	useAppController,
} from './providers/AppController/provider.js';
import {isValidConfig} from 'checksync-scraper/utils/isValidConfig.js';

const View: React.FC = () => {
	const [{state}] = useAppController();

	if (state === 'exitDialog') return <ExitDialog />;
	if (state === 'accountController') return <AccountController />;
	return <AccountSelector />;
};

const App = () =>
	isValidConfig() ? (
		<AppControllerProvider>
			<Box flexDirection="column" gap={1} padding={1}>
				<Text backgroundColor={'blue'}> Check Sync Client </Text>
				<View />
			</Box>
		</AppControllerProvider>
	) : (
		<Box flexDirection="column" gap={1} padding={1}>
			<Text backgroundColor={'blue'}> Check Sync Client </Text>
			<Text>
				<Text backgroundColor={'red'}> ! </Text> Tu configuracion no es
				correcta. Modifica <Text bold>config.json</Text>{' '}
				{'(instrucciones en readme)'}
			</Text>
		</Box>
	);

export default App;
