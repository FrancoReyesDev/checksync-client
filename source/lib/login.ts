import puppeteer from 'puppeteer';

export const prepareLogin = async (
	loginUrl: string,
	loggedPathHint: string,
) => {
	const browser = await puppeteer.launch({headless: false}); // Cambia a true para ejecución sin interfaz gráfica
	let cookies: puppeteer.Cookie[] = [];
	const login = async () => {
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
		cookies = await page.cookies();

		// Cierra el navegador
		await browser.close();
	};

	const close = browser.close;

	return {cookies, login, close};
};
