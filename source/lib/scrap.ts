import puppeteer from 'puppeteer';
import {loginWithCookies} from './loginWithCookies.js';
import {Config} from '../config.js';

export const scrap = async ({
	visible = true,
	sessionCookies,
	account: {...params},
}: {
	account: Config['accounts'][number];
	sessionCookies: puppeteer.Cookie[];
	visible?: boolean;
}) => {
	const browser = await puppeteer.launch({headless: !visible}); // Cambia a true para ejecución sin interfaz gráfica
	loginWithCookies({...params, sessionCookies, browser});
};
