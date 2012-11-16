if (typeof(MJ) === "undefined")
    MJ = {};

MJ.Hantei = MJ.Hantei || {};

MJ.Hantei.getYakuArray = function(agari) {
    var yaku_array = null;

    // 役満
    yaku_array = MJ.Hantei._Yakuman.checkAll(agari);
    if (yaku_array && yaku_array.length) {
        return yaku_array;
    }

    // 念のため
    yaku_array = [];
    
    // 清一色、混一色、三色同順、三色同刻
    if (MJ.Hantei._6Han.isChinitsu(agari)) {
        yaku_array.push({name: '清一色', han: 6});
    } else if (MJ.Hantei._3Han.isHonitsu(agari)) {
        yaku_array.push({name: '混一色', han: 3});
    } else if (MJ.Hantei._2Han.isSanshokudoujun(agari)) {
        yaku_array.push({name: '三色同順', han: 2});
    } else if (MJ.Hantei._2Han.isSanshokudoukou(agari)) {
        yaku_array.push({name: '三色同刻', han: 2});
    }

    // 二盃口、一盃口、対々和、七対子
    if (MJ.Hantei._3Han.isRyanpeikou(agari)) {
        yaku_array.push({name: '二盃口', han: 3});
    } else if (MJ.Hantei._1Han.isIipeikou(agari)) {
        yaku_array.push({name: '一盃口', han: 1});
    } else if (MJ.Hantei._2Han.isToitoihou(agari)) {
        yaku_array.push({name: '対々和', han: 2});
    } else if (MJ.Hantei._2Han.isChiitoitsu(agari)) {
        yaku_array.push({name: '七対子', han: 2});
    }

    // 純全帯ヤオ九、混老頭、混全帯ヤオ九、断ヤオ九、一気通貫
    if (MJ.Hantei._3Han.isJuntyan(agari)) {
        //yaku_array.push({name: '純全帯ヤオ九', han: 3});
        yaku_array.push({name: '純全帯', han: 3});
    } else if (MJ.Hantei._2Han.isHonroutou(agari)) {
        yaku_array.push({name: '混老頭', han: 2});
    } else if (MJ.Hantei._2Han.isTyanta(agari)) {
        //yaku_array.push({name: '混全帯ヤオ九', han: 2});
        yaku_array.push({name: '全帯', han: 2});
    } else if (MJ.Hantei._1Han.isTanyao(agari)) {
        //yaku_array.push({name: '断ヤオ九', han: 1});
        yaku_array.push({name: '断ヤオ', han: 1});
    } else if (MJ.Hantei._2Han.isIkkituukan(agari)) {
        yaku_array.push({name: '一気通貫', han: 2});
    }

    // 小三元
    if (MJ.Hantei._2Han.isShousangen(agari)) {
        yaku_array.push({name: '小三元', han: 2});
    }

    // 平和、三暗刻
    if (MJ.Hantei._1Han.isPinfu(agari)) {
        yaku_array.push({name: '平和', han: 1});
    } else if (MJ.Hantei._2Han.isSanankou(agari)) {
        yaku_array.push({name: '三暗刻', han: 2});
    }

    return yaku_array;
};

MJ.Hantei.getResult = function(tehai) {
    var agari_pattern = tehai.getAgariPattern();
    var yaku_array = null;
    var max_han = 0;
    for (var i = 0; i < agari_pattern.length; i++) {
        var tmp_yaku_array = MJ.Hantei.getYakuArray(agari_pattern[i]);
        var han = 0;
        for (var ii = 0; ii < tmp_yaku_array.length; ii++) {
            han += tmp_yaku_array[ii].han;
        }
        if (han > max_han) {
            yaku_array = tmp_yaku_array;
            max_han = han;
        }
    }
    return yaku_array;
};
