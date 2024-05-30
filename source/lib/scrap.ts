import puppeteer, {Cookie} from 'puppeteer';
import {loginWithCookies} from './loginWithCookies.js';
import {Config} from '../config.js';
import {steps} from '../../scraperconfig/steps.js';
import fs from 'fs';

export const scrap = async ({
	visible = true,
	sessionCookies,
	account: {...params},
	statusData,
}: {
	account: Config['accounts'][number];
	statusData?: {lastId: string; cookiesExpiration: number};
	sessionCookies: Cookie[];
	visible?: boolean;
}): Promise<{error: string} | {data: string}> => {
	try {
		const browser = await puppeteer.launch({headless: !visible}); // Cambia a true para ejecución sin interfaz gráfica
		const page = await loginWithCookies({...params, sessionCookies, browser});
		const scrapSteps = steps[params.scrap.steps];
		if (scrapSteps === undefined)
			return {
				error:
					'Debes colocar bien el nombre de los steps en scraperconfig/config.json',
			};
		const detailedMovements = await scrapSteps({
			page,
			browser,
			statusData,
			startFromId: params.scrap.startFromdId,
			maxPage: params.scrap.maxPage,
		});

		fs.writeFileSync(
			'./movements.json',
			JSON.stringify(detailedMovements, null, 2),
		);

		return {data: 'Se ha scrapeado con exito!'};
	} catch (e) {
		console.error({scrapError: e});
		return {error: 'hubo un error al scrapear'};
	}
};
