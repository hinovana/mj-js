// ===================================================================
// MJ.Hantei._6Han.js ---- 6翻役判定
// ===================================================================
// 上がりが成立している前提でチェックしています
// -------------------------------------------------------------------
// boolean MJ.Hantei._6Han.isChinitsu --- 清一色
// -------------------------------------------------------------------

if (typeof(MJ) === "undefined")
    MJ = {};

MJ.Hantei = MJ.Hantei || {};
MJ.Hantei._6Han = MJ.Hantei._6Han || {};

MJ.Hantei._6Han.isChinitsu = function(agari) {
    // 最初の牌のタイプを調べる（字牌はダメ）
    if (!agari.pai_array[0].match(/^[1-9]([msp])$/))
        return false;
    var ftype = RegExp.$1;

    // 2牌目以降は全て最初の牌と同じタイプでないとダメ
    for (var i = 1; i < agari.pai_array.length; i++) {
        if (!agari.pai_array[i].match(/^[1-9]([msp])$/))
            return false;
        var type = RegExp.$1;
        if (type != ftype)
            return false;
    }

    return true;
};
