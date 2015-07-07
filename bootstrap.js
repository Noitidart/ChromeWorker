const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
const self = {
	id: 'ChromeWorker',
	suffix: '@jetpack',
	path: 'chrome://chromeworker/content/',
	aData: 0,
};
Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/devtools/Console.jsm');

function sendMainArrBuff(aBuf) {
	console.info('got back buf in main thread, aBuf.byteLength:', aBuf.byteLength);
}

var myWorker = null;
function loadAndSetupWorker() {
	myWorker = new ChromeWorker(self.path + 'myWorker.js');

	function handleMessageFromWorker(msg) {
		console.log('incoming message from worker, msg:', msg);
		switch (msg.data.aTopic) {
			case 'do_sendMainArrBuff':
					sendMainArrBuff(msg.data.aBuf)
				break;
			default:
				throw 'no aTopic on incoming message to ChromeWorker';
		}
	}

	myWorker.addEventListener('message', handleMessageFromWorker);
}

function install() {}

function uninstall() {}

function startup() {
	loadAndSetupWorker(); //must do after startup
	var arrBuf = new ArrayBuffer(8);
	console.info('arrBuf.byteLength pre transfer:', arrBuf.byteLength);
	myWorker.postMessage({aTopic:'do_sendWorkerArrBuff', aBuf:arrBuf}, [arrBuf]);
	console.info('arrBuf.byteLength post transfer:', arrBuf.byteLength);
}
 
function shutdown(aReason) {
	if (aReason == APP_SHUTDOWN) return;
}
