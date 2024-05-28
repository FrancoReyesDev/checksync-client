const {execSync} = require('child_process');
const fs = require('fs');
const os = require('os');

const isWindows = os.platform() === 'win32';

if (fs.existsSync('scraperconfig')) {
	if (isWindows) {
		execSync('rd /s /q scraperconfig');
	} else {
		execSync('rm -rf scraperconfig');
	}
}

const submoduleAdd = () => {
	try {
		execSync(
			'git submodule add https://github.com/FrancoReyesDev/checkSync-scraperConfig.git scraperconfig',
		);
	} catch {}
};

submoduleAdd();
execSync('git submodule init');
execSync('git submodule update');
