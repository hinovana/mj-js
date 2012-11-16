if (typeof(MJ) === "undefined")
    MJ = {};

;(function() {
    var libdir = ".";
    if (typeof(MJ_LIBDIR) !== "undefined") {
        libdir = MJ_LIBDIR.replace(/\/+$/, "");
    } else if (typeof(document) !== "undefined" && document.getElementsByTagName) {
        // scriptタグのsrcからパスを取得
        // @see http://tshinobu.com/lab/javascript/require/
	var s = document.getElementsByTagName("script");
        var l = s.length;
        if (l)
	    libdir = s[l-1].src.substring(0, s[l-1].src.lastIndexOf("/")+1);
    }
    libdir += "/MJ";

    var FILES = [
        'MJ.Agari.js',
        'MJ.Tehai.js',
        'MJ.Hantei.js',
        'MJ.Hantei._1Han.js',
        'MJ.Hantei._2Han.js',
        'MJ.Hantei._3Han.js',
        'MJ.Hantei._6Han.js',
        'MJ.Hantei._Yakuman.js',
        'MJ.TokutenKeisan.js'
    ];

    // 外部jsファイルロード用
    var _load = null;
    if (typeof(load) === "function") {
        _load = load;
    } else {
        _load = function(path) {
            var tag = '<script type="text/javascript" src="' + path
                + '" charset="utf-8"></script>';
            document.write(tag);
        };
    }

    for (var i = 0; i < FILES.length; i++) {
        var path = libdir + '/' + FILES[i];
        _load(path);
    }
})();
