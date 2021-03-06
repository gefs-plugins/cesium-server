'use strict';

const heads = require('robohydra').heads;
const RoboHydraHeadFilesystem = heads.RoboHydraHeadFilesystem;
const RoboHydraHeadProxy = heads.RoboHydraHeadProxy;
const RoboHydraHeadFilter = heads.RoboHydraHeadFilter;
const fs = require('fs');
const path = require('path');
const formatPath = dir => path.join(__dirname, dir);

let folders = [], aircraftList = {};

for (let data of fs.readdirSync(formatPath('./'))) {
    if (fs.lstatSync(formatPath(data)).isDirectory()) folders.push(data);
}

for (let i = 0; i < folders.length; i++) {
    let record = {
        id: i,
        name: folders[i],
        fullPath: `/local/${folders[i]}/`,
        isPremium: false,
        isCommunity: false
    };

    aircraftList[i] = record;
}

const script = `<script>geofs.testAircraftList = ${JSON.stringify(aircraftList)}</script>
    <script src="/local/script.js?killcache=${Date.now()}"></script></head>`;

exports.getBodyParts = function () {
	return {
		heads: [
			new RoboHydraHeadFilesystem({
				mountPath: '/local',
				documentRoot: formatPath('./')
			}),

			new RoboHydraHeadFilter({
				path: '/geofs.php*',
				filter: buffer => buffer.toString()
                    .replace(/geofs\.masterDomain = '[^]*?'/, 'geofs.masterDomain = "127.0.0.1:3000"')
					.replace(/geofs\.url = '[^]*?'/, 'geofs.url = "http://127.0.0.1:3000"')
					.replace(/geofs\.localUrl = '[^]*?'/, 'geofs.localUrl = "http://127.0.0.1:3000"')
                    .replace(/geofs\.jsapiKey = '[^]*?'/, 'geofs.jsapiKey = "AIzaSyBlCxVOtJO6rKOmWnIhHSWx2EHzU_7hakQ"')
                    .replace('</head>', script)
			}),

			new RoboHydraHeadProxy({
				mountPath: '/',
				proxyTo: 'https://www.geo-fs.com/',
				setHostHeader: true
			})
		]
	};
};

console.log('Please go to http://127.0.0.1:3000/geofs.php to start Geo-FS.');
console.log('To exit, press Ctrl+C or close this window.');
