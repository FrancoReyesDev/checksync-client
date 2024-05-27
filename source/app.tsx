import React from 'react';
import {Box, Text} from 'ink';
import {AppProvider, useApp} from './providers/AppProvider.js';
import {AccountSelector} from './views/AccountSelector.js';
import {AccountController} from './views/AccountController.js';
import {ExitDialog} from './views/ExitDialog.js';
import {isValidConfig} from './config.js';

// type Props = {
// 	name: string | undefined;
// };

const View: React.FC = () => {
	const [{view}] = useApp();

	if (view === 'exitDialog') return <ExitDialog />;
	if (view === 'accountController') return <AccountController />;
	return <AccountSelector />;
};

const App = () =>
	isValidConfig() ? (
		<AppProvider>
			<Box flexDirection="column" gap={1} padding={1}>
				<Text backgroundColor={'blue'}> Check Sync Client </Text>
				<View />
			</Box>
		</AppProvider>
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
