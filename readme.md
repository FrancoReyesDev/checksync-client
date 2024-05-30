# Checksync Client

## CLI

```
npm run updateSC;
npm run build;
npm run start;

// To install:
npm install --global checksync
```

### Como funcionan las configuraciones:

```
export interface Config {
	server: {url: string; port: number};
	accounts: {
		id: string;
		color?: string;
		loginUrl: string;
		loggedOrigin: string;
		loggedInPathHint: string;
		scrap: {
			frequency: number; // La frecuencia en milisegundos
			steps: string; // Aqui va el nombre de los steps que sigue en scraperconfig/steps. Steps es un objeto que contiene los distintos pasos para scrapear una cuenta especifica
			startFromdId: string; // Aqui pondras el id de transaccion a partir del cual queres comenzar a scrapear
			maxPage: number; // Este es de seguridad, si no llega a "agarrar" el startFromId es hasta que llegue a esa pagina
		};
	}[];
}
```
