const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
const self = {
	id: 'ChromeWorker',
	suffix: '@jetpack',
	path: 'chrome://chromeworker/content/',
	aData: 0,
};
Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/devtools/Console.jsm');

var myWorker = null;
function loadAndSetupWorker() {
	myWorker = new ChromeWorker(self.path + 'myWorker.js');

	function handleMessageFromWorker(msg) {
		console.log('incoming message from worker, msg:', msg);
	}

	myWorker.addEventListener('message', handleMessageFromWorker);
}

function install() {}

function uninstall() {}

function startup() {
	loadAndSetupWorker(); //must do after startup
	myWorker.postMessage({aTopic:'msg1'});
}
 
function shutdown(aReason) {
	if (aReason == APP_SHUTDOWN) return;
}
