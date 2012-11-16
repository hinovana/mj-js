// ===================================================================
// MJ.Hantei._1Han.js ---- 1翻役判定
// ===================================================================
// 上がりが成立している前提でチェックしています
// -------------------------------------------------------------------
// boolean MJ.Hantei._1Han.isPinfu    --- 平和
// boolean MJ.Hantei._1Han.isTanyao   --- 断ヤオ九
// boolean MJ.Hantei._1Han.isIipeikou --- 一盃口
// -------------------------------------------------------------------

if (typeof(MJ) === "undefined")
    MJ = {};

MJ.Hantei = MJ.Hantei || {};
MJ.Hantei._1Han = MJ.Hantei._1Han || {};

MJ.Hantei._1Han.isPinfu = function(agari) {
    // 七対子とは複合しない（？）
    if (agari.tehai.is_chiitoi)
        return false;

    // ないてたらfalse
    //if (agari.tehai.pon.length || agari.tehai.chii.length)
    //    return false;

    // 順子が4つなければfalse
    if (agari.tehai.shuntsu.length < 4)
        return false;

    // 頭が役牌ならfalse
    if (agari.tehai.atama.match(/^(白|發|中)$/))
        return false;

    // 当たり牌が設定されてる場合、順子の両端でなければfalse
    if (agari.atari_pai) {
        for (var i = 0; i < agari.tehai.shuntsu.length; i++) {
            var pai = agari.tehai.shuntsu[i];
            if (agari.atari_pai == pai && !pai.match(/^7/))
                return true;
            var mat = pai.match(/^([1-7])([msp])$/);
            var pai3 = (parseInt(mat[1]) + 2) + mat[2];
            if (agari.atari_pai == pai3 && !pai3.match(/^3/))
                return true;
        }
        return false;
    }

    return true;
};

MJ.Hantei._1Han.isTanyao = function(agari) {
    // 手牌に2-8の数牌以外があればfalse
    for (var i = 0; i < agari.pai_array.length; i++) {
        if (agari.pai_array[i].match(/^[^2-8]/))
            return false;
    }

    return true;
};

MJ.Hantei._1Han.isIipeikou = function(agari) {
    // 七対子とは複合しない
    if (agari.tehai.is_chiitoi)
        return false;

    // ないてたらfalse
    //if (agari.tehai.pon.length || agari.tehai.chii.length)
    //    return false;

    // 同じ順子が2つ以上あればtrue
    var shuntsu_count = {};
    for (var i = 0; i < agari.tehai.shuntsu.length; i++) {
        var pai = agari.tehai.shuntsu[i];
        shuntsu_count[pai] = (shuntsu_count[pai] || 0) + 1;
    }
    for (var pai in shuntsu_count) {
        if (shuntsu_count[pai] >= 2)
            return true;
    }

    return false;
};
