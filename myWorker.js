var lib = ctypes.open("C:\\WINDOWS\\system32\\user32.dll");

/* Declare the signature of the function we are going to call */
var msgBox = lib.declare("MessageBoxW",
                         ctypes.winapi_abi,
                         ctypes.int32_t,
                         ctypes.int32_t,
                         ctypes.jschar.ptr,
                         ctypes.jschar.ptr,
                         ctypes.int32_t);
var MB_OK = 0;

var ret = msgBox(0, "Hello world", "title", MB_OK);

//lib.close();

self.onmessage = function (msg) {
	//dump('incoming message to ChromeWorker, msg:' + uneval(msg)); //does not dump to Browser Console
	//console.log('msg from worker onmessage'); //does not work but doesnt interrtup code
	switch (msg.data.aTopic) {
		case 'msg1':
			self.postMessage({aTopic:'msg1-reply'});
			break;
		default:
			throw 'no aTopic on incoming message to ChromeWorker';
	}
}

self.onerror = function(msg) {}
