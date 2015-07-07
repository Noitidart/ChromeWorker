var lib = ctypes.open("C:\\WINDOWS\\system32\\user32.dll");

/* Declare the signature of the function we are going to call */
function sendWorkerArrBuff(aBuf) {
	console.info('from worker, PRE send back aBuf.byteLength:', aBuf.byteLength);	
	self.postMessage({aTopic:'do_sendMainArrBuff', aBuf:aBuf}, [aBuf]);
	console.info('from worker, POST send back aBuf.byteLength:', aBuf.byteLength);
}

//lib.close();

self.onmessage = function (msg) {
	//dump('incoming message to ChromeWorker, msg:' + uneval(msg)); //does not dump to Browser Console
	//console.log('msg from worker onmessage'); //does not work but doesnt interrtup code
	switch (msg.data.aTopic) {
		case 'do_sendWorkerArrBuff':
				sendWorkerArrBuff(msg.data.aBuf)
			break;
		default:
			throw 'no aTopic on incoming message to ChromeWorker';
	}
}

self.onerror = function(msg) {}
