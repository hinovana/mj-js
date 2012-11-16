// ===================================================================
// MJ.Hantei._3Han.js ---- 3翻役判定
// ===================================================================
// 上がりが成立している前提でチェックしています
// -------------------------------------------------------------------
// boolean MJ.Hantei._3Han.isHonitsu    --- 混一色
// boolean MJ.Hantei._3Han.isJuntyan    --- 純全帯ヤオ九
// boolean MJ.Hantei._3Han.isRyanpeikou --- 二盃口
// -------------------------------------------------------------------

if (typeof(MJ) === "undefined")
    MJ = {};

MJ.Hantei = MJ.Hantei || {};
MJ.Hantei._3Han = MJ.Hantei._3Han || {};

MJ.Hantei._3Han.isHonitsu = function(agari) {
    // 最初の牌が字牌ならOK（というか字一色？）
    if (!agari.pai_array[0].match(/^[1-9]([msp])$/))
        return true;

    // 最初の牌のタイプ
    var ftype = RegExp.$1;

    // 2牌目以降は全て最初の牌と同じタイプか字牌でないとダメ
    for (var i = 1; i < agari.pai_array.length; i++) {
        if (!agari.pai_array[i].match(/^[1-9]([msp])$/))
            continue;
        var type = RegExp.$1;
        if (type != ftype)
            return false;
    }

    return true;
};

MJ.Hantei._3Han.isJuntyan = function(agari) {
    // 七対子とは複合しない
    if (agari.tehai.is_chiitoi)
        return false;

    // 頭と各面子が一九牌でできてるか調べる
    if (!agari.tehai.atama.match(/^[19]/))
        return false;
    for (var i = 0; i < agari.tehai.koutsu.length; i++) {
        var pai = agari.tehai.koutsu[i];
        if (!pai.match(/^[19]/))
            return false;
    }
    for (var i = 0; i < agari.tehai.shuntsu.length; i++) {
        var pai = agari.tehai.shuntsu[i];
        if (!pai.match(/^[17]/))
            return false;
    }

    return true;
};

MJ.Hantei._3Han.isRyanpeikou = function(agari) {
    // 七対子とは複合しない
    if (agari.tehai.is_chiitoi)
        return false;

    // ないてたらfalse
    //if (agari.tehai.pon.length || agari.tehai.chii.length)
    //    return false;

    // 一盃口が2つあればtrue
    var shuntsu_count = {};
    for (var i = 0; i < agari.tehai.shuntsu.length; i++) {
        var pai = agari.tehai.shuntsu[i];
        shuntsu_count[pai] = (shuntsu_count[pai] || 0) + 1;
    }
    var n = 0;
    for (var pai in shuntsu_count) {
        // 一色四順＝二盃口
        if (shuntsu_count[pai] == 4)
            return true;

        if (shuntsu_count[pai] >= 2)
            n++;
    }

    return (n >= 2);
};
