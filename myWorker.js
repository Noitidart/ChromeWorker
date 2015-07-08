var idelfunc_c;
var destroyfunc_c;

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
	
	var guint = ctypes.unsigned_int;
	var gboolean = gint;
	var gpointer = ctypes.void_t.ptr;
	var GSource = ctypes.StructType('GSource'); // opaque per https://developer.gnome.org/glib/stable/glib-The-Main-Event-Loop.html#GSource
	var GSourceFunc = ctypes.FunctionType(ctypes.default_abi, gboolean, [gpointer]); // https://developer.gnome.org/glib/stable/glib-The-Main-Event-Loop.html#GSourceFunc
	/* i dont need this and i probably would have to delcare prepare, check etc outside of the struct but leaving here as its groundwork for future if GSourceFuncs is needed (notice the s at the end, this is different from GSourceFunc)
	var GSourceFuncs = ctypes.StructType('GSourceFuncs', [
		{'prepare': ctypes.FunctionType(ctypes.default_abi, gboolean, [GSource.ptr, gint.ptr]).ptr },
		{'check': ctypes.FunctionType(ctypes.default_abi, gboolean, [GSource.ptr]).ptr },
		{'dispatch': ctypes.FunctionType(ctypes.default_abi, gboolean, [GSource.ptr, GSourceFunc, gpointer]).ptr },
		{'finalize': ctypes.FunctionType(ctypes.default_abi, gboolean, [GSource.ptr]).ptr } // can be NULL
	]);
	*/
	var GDestroyNotify = ctypes.FunctionType(ctypes.default_abi, ctypes.void_t, [gpointer]); // https://developer.gnome.org/glib/stable/glib-Datasets.html#GDestroyNotify
	
	// https://developer.gnome.org/glib/stable/glib-The-Main-Event-Loop.html#g-idle-add-full
	var g_idle_add_full = gdk2.declare('g_idle_add_full', ctypes.default_abi,
		guint,			// return
		gint,			// priority
		GSourceFunc.ptr,	// function
		gpointer,		// data
		GDestroyNotify.ptr	// notify
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
	//var screenshot = gdk_pixbuf_get_from_drawable(null, rootGdkDrawable, null, x_orig.value, y_orig.value, 0, 0, width.value, height.value);
	//console.info('screenshot:', screenshot.toString());
	
	var idlefunc_js = function(user_data) {
dump('in idle');
		console.error('in idlefunc_js');
		return true;
	};
	idelfunc_c = GSourceFunc.ptr(idlefunc_js);
	
	var destroyfunc_js = function(data) {
dump('in destroy');
		console.error('in destroyfunc_js')
		return undefined;
	};
	destroyfunc_c = GDestroyNotify.ptr(destroyfunc_js);
	
	var G_PRIORITY_HIGH_IDLE = 100;
	var G_PRIORITY_DEFAULT_IDLE = 200;
	
	var dummyData = ctypes.cast(ctypes.uint64_t(0x0), ctypes.void_t.ptr);

	var rez_add = g_idle_add_full(G_PRIORITY_HIGH_IDLE, idelfunc_c, dummyData, null);
	console.info('rez_add:', rez_add);
	
	//gdk2.close();