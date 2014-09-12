self.onmessage = function (msg) {
	dump('incoming message to ChromeWorker, msg:' + uneval(msg));
	console.log('msg from worker onmessage');
}

self.onerror = function(msg) {
	dump('incoming error to ChromeWorker, msg:' + uneval(msg));
}