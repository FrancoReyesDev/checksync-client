import puppeteer from 'puppeteer';

export type LoginHandler = {
	login: () => Promise<{cookies: puppeteer.Cookie[]} | {error: string}>;
	close: () => undefined | Promise<void>;
};

export const prepareLoginHandler = async (
	loginUrl: string,
	loggedPathHint: string,
): Promise<LoginHandler> => {
	let browser: null | puppeteer.Browser = null;

	const login = async () => {
		try {
			if (browser === null) browser = await puppeteer.launch({headless: false}); // Cambia a true para ejecución sin interfaz gráfica
			const page = await browser.newPage();
			await page.goto(loginUrl);

			// Inicia sesión manualmente en el navegador controlado por Puppeteer

			// Espera hasta que se cambie a la página /home
			await page.waitForRequest(
				req => {
					return req.url().includes(loggedPathHint);
				},
				{timeout: 1000 * 5 * 60},
			);

			// Obtiene las cookies al estar en la página /home
			const cookies = await page.cookies();

			// Cierra el navegador
			await browser.close();
			return {cookies};
		} catch (e) {
			if (browser !== null) browser.close();
			console.error(e);
			return {error: 'error de login'};
		}
	};

	const close = () => (browser === null ? undefined : browser.close());

	return {login, close};
};
