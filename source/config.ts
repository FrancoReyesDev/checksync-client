import fs from 'fs';
import {z} from 'zod';

const configSchema = z.object({
	server: z.object({
		url: z.string(),
		port: z.number(),
	}),
	accounts: z.array(
		z.object({
			id: z.string(),
			color: z.string().optional(),
			loginUrl: z.string(),
			loggedInPathHint: z.string(),
			scrap: z.object({
				frequency: z.number(),
				steps: z.any(),
			}),
		}),
	),
});

export const config = JSON.parse(
	fs.readFileSync('./config.json', {encoding: 'utf-8', flag: 'r'}),
) as Config;

export const isValidConfig = () => {
	try {
		configSchema.parse(config);
		return true;
	} catch {
		return false;
	}
};

export interface Config {
	server: {url: string; port: number};
	accounts: {
		id: string;
		color?: string;
		loginUrl: string;
		loggedInPathHint: string;
		scrap: {
			frequency: number;
			steps: any;
		};
	}[];
}