import React, {useEffect, useState} from 'react';
import {Box, Text, useInput} from 'ink';
import {useAppController} from 'src/providers/AppController/provider.js';
import config from 'checksync-scraper/config.json';
import {Config} from 'checksync-scraper/types/Config.js';

export const AccountSelector: React.FC = () => {
	const [, dispatch] = useAppController();
	const [selectedAccount, setSelectedAccount] = useState<string>('');
	const accounts = config.accounts.map(account => account);

	useInput((_, key) => {
		if (key.escape) return dispatch({type: 'back'});

		if (key.upArrow)
			return setSelectedAccount(current => {
				const indexOfCurrent = accounts.findIndex(({id}) => current === id);
				return accounts[indexOfCurrent - 1] === undefined
					? current
					: accounts[indexOfCurrent - 1]!.id;
			});

		if (key.upArrow)
			return setSelectedAccount(current => {
				const indexOfCurrent = accounts.findIndex(({id}) => current === id);
				return accounts[indexOfCurrent + 1] === undefined
					? current
					: accounts[indexOfCurrent + 1]!.id;
			});

		if (key.return && selectedAccount !== '')
			return dispatch({
				type: 'select',
				account: config.accounts.find(({id}) => id === selectedAccount)!,
			});
	});

	useEffect(() => {
		if (accounts.length === 0) return;

		if (selectedAccount === '') setSelectedAccount(accounts[0]!.id);

		if (accounts.length === 1)
			return dispatch({
				type: 'select',
				account: accounts[0] as Config['accounts'][number],
			});
	});

	if (accounts.length === 0)
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
			{accounts.map(account => {
				const isSelected = selectedAccount === account.id;
				return (
					<Text key={account.id}>
						{isSelected && (
							<Text backgroundColor={isSelected ? 'white' : 'black'}>
								{' > '}
							</Text>
						)}{' '}
						{account.id}
					</Text>
				);
			})}
			{accounts.length > 1 && (
				<Box marginTop={1}>
					<Text>Selecciona una cuenta y presiona enter</Text>
				</Box>
			)}
		</Box>
	);
};
