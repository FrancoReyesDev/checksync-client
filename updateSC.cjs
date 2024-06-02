const {execSync} = require('child_process');
const fs = require('fs');
const os = require('os');

const isWindows = os.platform() === 'win32';

if (fs.existsSync('checksync-scraper')) {
	if (isWindows) {
		execSync('rd /s /q checksync-scraper');
	} else {
		execSync('rm -rf checksync-scraper');
	}
}

const submoduleAdd = () => {
	try {
		execSync(
			'git submodule  add --force https://github.com/FrancoReyesDev/checkSync-scraperConfig.git checksync-scraper',
		);
	} catch {}
};

submoduleAdd();
execSync('git submodule init ');
execSync('git submodule update ');
