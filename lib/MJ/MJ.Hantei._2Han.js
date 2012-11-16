// ===================================================================
// MJ.Hantei._2Han.js ---- 2翻役判定
// ===================================================================
// 上がりが成立している前提でチェックしています
// -------------------------------------------------------------------
// boolean MJ.Hantei._2Han.isSanshokudoujun    --- 三色同順
// boolean MJ.Hantei._2Han.isIkkituukan        --- 一気通貫
// boolean MJ.Hantei._2Han.isTyanta            --- 混全帯ヤオ九
// boolean MJ.Hantei._2Han.isChiitoitsu        --- 七対子
// boolean MJ.Hantei._2Han.isToitoihou         --- 対々和
// boolean MJ.Hantei._2Han.isSanankou          --- 三暗刻
// boolean MJ.Hantei._2Han.isHonroutou         --- 混老頭
// boolean MJ.Hantei._2Han.isSanshokudoukou    --- 三色同刻
// boolean MJ.Hantei._2Han.isSankantsu         --- 三槓子（未実装）
// boolean MJ.Hantei._2Han.isShousangen        --- 小三元
// -------------------------------------------------------------------

if (typeof(MJ) === "undefined")
    MJ = {};

MJ.Hantei = MJ.Hantei || {};
MJ.Hantei._2Han = MJ.Hantei._2Han || {};

MJ.Hantei._2Han.isSanshokudoujun = function(agari) {
    // 七対子とは複合しない
    if (agari.tehai.is_chiitoi)
        return false;

    // 順子が3つ以上ないならfalse
    if (agari.tehai.shuntsu.length < 3)
        return false;

    // 順子で利用してる数と牌の個数を取得
    var nums = {};
    var pais = {};
    for (var i = 0; i < agari.tehai.shuntsu.length; i++) {
        var pai = agari.tehai.shuntsu[i];
        var mat = pai.match(/^([1-7])/);
        var num = parseInt(mat[1]);
        nums[num] = (nums[num] || 0) + 1;
        pais[pai] = (pais[pai] || 0) + 1;
    }

    // 各数でmspがあるか調べる（2回まで）
    var i = 0;
    for (var num in nums) {
        if (++i > 2)
            break;

        if (pais[num + 'm'] && pais[num + 's'] && pais[num + 'p'])
            return true;
    }

    return false;
};

MJ.Hantei._2Han.isIkkituukan = function(agari) {
    // 七対子とは複合しない（？）
    if (agari.tehai.is_chiitoi)
        return false;

    // 各タイプで1-9が揃っているか調べる
    var shuntsu_count = {};
    for (var i = 0; i < agari.tehai.shuntsu.length; i++) {
        var pai = agari.tehai.shuntsu[i];
        shuntsu_count[pai] = (shuntsu_count[pai] || 0) + 1;
    }
    var types = ['m', 's', 'p'];
    for (var i = 0; i < types.length; i++) {
        var type = types[i];
        if ((shuntsu_count[1 + type] &&
             shuntsu_count[4 + type] &&
             shuntsu_count[7 + type])) {
            return true;
        }
    }

    return false;
};

MJ.Hantei._2Han.isTyanta = function(agari) {
    // 七対子とは複合しない（？）
    if (agari.tehai.is_chiitoi)
        return false;

    // 頭と各面子が一九字牌でできてるか調べる
    if (agari.tehai.atama.match(/^[2-8]/))
        return false;
    for (var i = 0; i < agari.tehai.koutsu.length; i++) {
        var pai = agari.tehai.koutsu[i];
        if (pai.match(/^[2-8]/))
            return false;
    }
    for (var i = 0; i < agari.tehai.shuntsu.length; i++) {
        var pai = agari.tehai.shuntsu[i];
        if (pai.match(/^[2-6]/))
            return false;
    }

    return true;
};

MJ.Hantei._2Han.isChiitoitsu = function(agari) {
    // agariで判定済み
    return agari.tehai.is_chiitoi;
};

MJ.Hantei._2Han.isToitoihou = function(agari) {
    // 七対子とは複合しない
    if (agari.tehai.is_chiitoi)
        return false;

    // 順子が一つでもあればfalse
    if (agari.tehai.shuntsu.length)
        return false;

    return true;
};

MJ.Hantei._2Han.isSanankou = function(agari) {
    // 七対子とは複合しない
    if (agari.tehai.is_chiitoi)
        return false;

    // 刻子が3つあればOK（今はポンは考えない）
    return (agari.tehai.koutsu.length >= 3);
};

MJ.Hantei._2Han.isHonroutou = function(agari) {
    // 手牌全てが一九字牌
    for (var i = 0; i < agari.pai_array.length; i++) {
        var pai = agari.pai_array[i];
        if (pai.match(/^[2-8]/))
            return false;
    }
    return true;
};

MJ.Hantei._2Han.isSanshokudoukou = function(agari) {
    // 七対子とは複合しない
    if (agari.tehai.is_chiitoi)
        return false;

    // 刻子が3つ以上ないならfalse
    if (agari.tehai.koutsu.length < 3)
        return false;

    // 刻子で利用してる数と牌の個数を取得
    var nums = {};
    var pais = {};
    for (var i = 0; i < agari.tehai.koutsu.length; i++) {
        var pai = agari.tehai.koutsu[i];
        var mat = pai.match(/^([1-9])/);
        if (!mat)
            continue;
        var num = parseInt(mat[1]);
        nums[num] = (nums[num] || 0) + 1;
        pais[pai] = (pais[pai] || 0) + 1;
    }

    // 各数でmspがあるか調べる（2回まで）
    var i = 0;
    for (var num in nums) {
        if (++i > 2)
            break;

        if (pais[num + 'm'] && pais[num + 's'] && pais[num + 'p'])
            return true;
    }

    return false;
};

MJ.Hantei._2Han.isSankantsu = function(agari) {
    // Not implemented.
    return false;
};

MJ.Hantei._2Han.isShousangen = function(agari) {
    // 七対子とは複合しない
    if (agari.tehai.is_chiitoi)
        return false;

    // 白, 發, 中のどれかが頭で、他が刻子ならtrue
    switch (agari.tehai.atama) {
    case '白':
        return (agari.pai_count['發'] >= 3 && agari.pai_count['中'] >= 3);
    case '發':
        return (agari.pai_count['白'] >= 3 && agari.pai_count['中'] >= 3);
    case '中':
        return (agari.pai_count['白'] >= 3 && agari.pai_count['發'] >= 3);
    }

    return false;
};
