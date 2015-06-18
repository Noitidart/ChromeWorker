function takeScreenshot() {
	var gdk2 = ctypes.open('libgdk-x11-2.0.so.0');
	
	var _void = ctypes.void_t;
	var gint = ctypes.int;
	var GdkPixbuf = ctypes.StructType('GdkPixbuf');
	var GdkDrawable = ctypes.StructType('GdkDrawable');
	var GdkColormap = ctypes.StructType('GdkColormap');
	var GdkWindow = ctypes.StructType('GdkWindow');
	var int = ctypes.int;
	
	/* https://developer.gnome.org/gdk3/stable/gdk3-Windows.html#gdk-get-default-root-window
	 * GdkWindow *gdk_get_default_root_window (
	 *   void
	 * );
	 */
	var gdk_get_default_root_window = gdk2.declare('gdk_get_default_root_window', ctypes.default_abi, GdkWindow.ptr);
	
	/* https://developer.gnome.org/gdk3/stable/gdk3-Windows.html#gdk-window-get-origin
	 * gint gdk_window_get_origin (GdkWindow *window,
	 *   gint *x,
	 *   gint *y
	 * );
	 */
	var gdk_drawable_get_size = gdk2.declare('gdk_drawable_get_size', ctypes.default_abi,
		gint,			// return
		GdkWindow.ptr,	// *window
		gint.ptr,		// *x
		gint.ptr		// *y
	);
	
	/* https://developer.gnome.org/gdk3/stable/gdk3-Windows.html#gdk-window-get-origin
	 * gint gdk_window_get_origin (GdkWindow *window,
	 *   gint *x,
	 *   gint *y
	 * );
	 */
	var gdk_window_get_origin = gdk2.declare('gdk_window_get_origin', ctypes.default_abi,
		gint,			// return
		GdkWindow.ptr,	// *window
		gint.ptr,		// *x
		gint.ptr		// *y
	);
	
	/* https://developer.gnome.org/gdk2/stable/gdk2-Pixbufs.html#gdk-pixbuf-get-from-drawable
	 * GdkPixbuf *gdk_pixbuf_get_from_drawable (
	 *   GdkPixbuf *dest,
	 *   GdkDrawable *src,
	 *   GdkColormap *cmap,
	 *   int src_x,
	 *   int src_y,
	 *   int dest_x,
	 *   int dest_y,
	 *   int width,
	 *   int height
	 * );
	 */
	var gdk_pixbuf_get_from_drawable = gdk2.declare('gdk_pixbuf_get_from_drawable', ctypes.default_abi,
		GdkPixbuf.ptr,	// return
		GdkPixbuf.ptr,	// *dest
		GdkDrawable.ptr,	// *src
		GdkColormap.ptr,	// *cmap
		int,				// src_x
		int,				// src_y
		int,				// dest_x
		int,				// dest_y
		int,				// width
		int				// height
	);
	
	
	var rootGdkWin = gdk_get_default_root_window();
	console.info('rootGdkWin:', rootGdkWin.toString());
	
	var x_orig = gint();
	var y_orig = gint();
	var width = gint();
	var height = gint();
	
	var rez_gdkDrawGetSiz = gdk_drawable_get_size(rootGdkWin, width.address(), height.address());
	console.info('width:', width.value, 'height:', height.value);
	
	var rez_gdkWinGetOrg = gdk_window_get_origin(rootGdkWin, x_orig.address(), y_orig.address());
	console.info('x:', x_orig.value, 'y:', y_orig.value);
	
	
	var rootGdkDrawable = ctypes.cast(rootGdkWin, GdkDrawable.ptr);
	var screenshot = gdk_pixbuf_get_from_drawable(null, rootGdkDrawable, null, x_orig.value, y_orig.value, 0, 0, width.value, height.value);
	console.info('screenshot:', screenshot.toString());
	
	
	gdk2.close();
}


self.onmessage = function (msg) {
	//dump('incoming message to ChromeWorker, msg:' + uneval(msg)); //does not dump to Browser Console
	//console.log('msg from worker onmessage'); //does not work but doesnt interrtup code
	switch (msg.data.aTopic) {
		case 'msg1':
			takeScreenshot();
			self.postMessage({aTopic:'msg1-reply'});
			break;
		default:
			throw 'no aTopic on incoming message to ChromeWorker';
	}
}

self.onerror = function(msg) {}
