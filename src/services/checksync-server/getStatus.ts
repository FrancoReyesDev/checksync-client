import {origin} from '../../origin.js';
import {ScraperStatus} from 'checksync-scraper/dist/index.js';

export const getStatus = async (scraperName: string) => {
	const url = [origin, scraperName, 'status'].join('/');
	const config: RequestInit = {method: 'POST', cache: 'no-store'};
	const response = await fetch(url, config);
	if (response.ok) return (await response.json()) as ScraperStatus;
	return {error: 'error on getStatus'};
};
