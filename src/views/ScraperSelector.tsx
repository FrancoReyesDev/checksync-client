import React, {useEffect, useState} from 'react';
import {Box, Text, useInput} from 'ink';
import {useAppController} from '../providers/AppController/provider.js';
import {Scrapers} from 'checksync-scraper';

export const ScraperSelector: React.FC = () => {
	const [state, dispatch] = useAppController();
	const [selectedScraper, setSelectedScraper] = useState<keyof Scrapers | null>(
		null,
	);

	const {scrapers} = state;
	const scraperNames = Object.keys(scrapers) as Array<keyof Scrapers>;

	const changeScraper = (direction: 'left' | 'right') => {
		setSelectedScraper(current => {
			const indexOfCurrent = scraperNames.findIndex(
				scraperName => current === scraperName,
			);
			const newIndex =
				direction === 'left' ? indexOfCurrent - 1 : indexOfCurrent + 1;
			return scraperNames[newIndex] === undefined
				? current
				: scraperNames[newIndex]!;
		});
	};

	useInput((_, key) => {
		if (key.escape) return dispatch({type: 'back'});

		if (key.upArrow) return changeScraper('left');

		if (key.downArrow) return changeScraper('right');

		if (key.return && selectedScraper !== null)
			return dispatch({
				type: 'select',
				scraper: scrapers[selectedScraper],
			});
	});

	useEffect(() => {
		if (Object.keys(scrapers).length === 0) return;

		if (selectedScraper === null)
			setSelectedScraper(
				(Object.keys(scraperNames)[0] as keyof Scrapers) ?? null,
			);

		if (Object.keys(scrapers).length === 1)
			return Object.values(scrapers)[0] !== undefined
				? dispatch({
						type: 'select',
						scraper: Object.values(scrapers)[0]!,
				  })
				: undefined;
	});

	if (Object.keys(scrapers).length === 0)
		return (
			<Box>
				<Text backgroundColor={'red'}>! </Text>
				<Text>
					No tienes cuentas configuradas. Configuralas en config.json, tienes
					las instrucciones en el readme.
				</Text>
			</Box>
		);

	return (
		<Box flexDirection="column">
			{Object.keys(scrapers).map(scraper => {
				const isSelected = selectedScraper === scraper;
				return (
					<Text key={scraper}>
						{isSelected && (
							<Text backgroundColor={isSelected ? 'white' : 'black'}>
								{' > '}
							</Text>
						)}{' '}
						{scraper}
					</Text>
				);
			})}
			{Object.keys(scrapers).length > 1 && (
				<Box marginTop={1}>
					<Text>Selecciona un scraper y presiona enter</Text>
				</Box>
			)}
		</Box>
	);
};
