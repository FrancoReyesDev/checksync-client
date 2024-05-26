import React, {useReducer} from 'react';
import {Box, Text, useInput} from 'ink';

// type Props = {
// 	name: string | undefined;
// };
type AppState = {
	logged: boolean;
};

type AppAction = {
	type: 'logIn' | 'logOut';
};

const appReducer = (state: AppState, action: AppAction): AppState => {
	action;
	return state;
};
export default function App() {
	const [state] = useReducer(appReducer, {logged: false});
	useInput((input, key) => {
		console.log(input, key);
	});
	return (
		<Box borderStyle={'single'} flexDirection="column" gap={1} padding={1}>
			<Box>
				<Text backgroundColor="#00B1EA">
					{' '}
					Mercado Pago Scrapper{state.logged}
				</Text>
			</Box>
			<Box>
				<Text>Estado:</Text>
			</Box>
		</Box>
	);
}
