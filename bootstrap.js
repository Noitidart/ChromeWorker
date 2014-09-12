const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
const self = {
	id: 'ChromeWorker',
	suffix: '@jetpack',
	path: 'chrome://ChromeWorker/content/',
	aData: 0,
};
Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/devtools/Console.jsm');

var myWorker = null;
function loadAndSetupWorker() {
	myWorker = new ChromeWorker('worker.js');

	function handleMessageFromWorker(msg) {
		console.log('incoming message from worker, msg:', msg);
	}

	myWorker.addEventListener('message', handleMessageFromWorker);
}

loadAndSetupWorker();

function install() {}

function uninstall() {}

function startup() {}
 
function shutdown(aReason) {
	if (aReason == APP_SHUTDOWN) return;
}
