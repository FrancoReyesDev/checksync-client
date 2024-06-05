import React from 'react';
import {Box, Text} from 'ink';
import {ScraperSelector} from './views/ScraperSelector.js';
import {ScraperController} from './views/ScraperController.js';
import {ExitDialog} from './views/ExitDialog.js';
import {
	AppControllerProvider,
	useAppController,
} from './providers/AppController/provider.js';
import {manager} from 'checksync-scraper';

const View: React.FC = () => {
	const [state] = useAppController();

	if (state.state === 'exitDialog') return <ExitDialog />;
	if (state.state === 'scraperController' && 'scraper' in state)
		return <ScraperController />;
	return <ScraperSelector />;
};

const App: React.FC = () => {
	const {scrapers} = manager({
		mp: {findMovement: () => undefined, setMovements: () => {}},
	});

	return Object.keys(scrapers).length > 0 ? (
		<AppControllerProvider scrapers={scrapers}>
			<Box flexDirection="column" gap={1} padding={1}>
				<Text backgroundColor={'blue'}> Check Sync Client </Text>
				<View />
			</Box>
		</AppControllerProvider>
	) : (
		<Box flexDirection="column" gap={1} padding={1}>
			<Text backgroundColor={'blue'}> Check Sync Client </Text>
			<Text>
				<Text backgroundColor={'red'}> ! </Text> Aparentemente no hay scrapers
				disponibles, revisa checksync-scraper {'(instrucciones en readme)'}
			</Text>
		</Box>
	);
};

export default App;
