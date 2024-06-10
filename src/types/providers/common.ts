import {Dispatch} from 'react';

export type States = 'login' | 'logout' | 'status' | 'idle';

export type State = {
	state: string;
};

export type Action = {
	type: string;
};

export type Transition<S extends State, A extends Action> = (
	state: S,
	action: A,
) => S;

export type TransitionsMachine<S extends State, A extends Action> = {
	[state in S['state']]: {
		[action in A['type']]?: Transition<S, A>;
	};
};

export type Effect<S extends State, A extends Action> = (
	state: S,
	dispatch: Dispatch<A>,
) => void;

export type EffectsMachine<S extends State, A extends Action> = {
	[state in S['state']]?: Effect<S, A>;
};
