/*
 * 得点計算プロトタイプ
 */

MJ = MJ || {};

MJ.TokutenKeisan = function() {
};

MJ.TokutenKeisan.calcFu = function(agari, yaku_array) {
    var fu = 0;

    // 七対子
    if (agari.tehai.is_chiitoi)
        return 25;

    // 副底（フーテイ）
    fu += 20;

    // 門前加符（メンゼンカフ）
    // ⇒とりあえずツモした前提

    // ツモ符
    var isPinfu = yaku_array ? MJ.TokutenKeisan.__hasPinfu(yaku_array) : false;
    if (yaku_array && !isPinfu) {
        fu += 2;
    }

    // 面子の構成による符
    // ⇒全て暗刻子の前提
    for (var i = 0; i < agari.tehai.koutsu.length; i++) {
        if (agari.tehai.koutsu[i].match(/^[2-8]/))
            fu += 4;
        else
            fu += 8;
    }

    // 雀頭による符
    // ⇒場風等は無しの前提
    if (agari.tehai.atama.match(/^(白|發|中)$/)) {
        fu += 2;
    }

    // 待ちによる符
    if (isPinfu) {
        // 平和の場合は必ず両面待ち
    } else if (agari.atari_pai == agari.tehai.atama) {
        // 単騎待ち
        fu += 2;
    } else if (agari.atari_pai.match(/^[2-8]/)) {
        var found = false;

        if (agari.atari_pai.match(/^3/)) {
            var pai = agari.atari_pai.replace(/^3/, '1');
            for (var i = 0; i < agari.tehai.shuntsu.length; i++) {
                if (pai == agari.tehai.shuntsu[i]) {
                    // 辺張待ち
                    fu += 2;
                    found = true;
                    break;
                }
            }
        } else if (agari.atari_pai.match(/^7/)) {
            var pai = agari.atari_pai;
            for (var i = 0; i < agari.tehai.shuntsu.length; i++) {
                if (pai == agari.tehai.shuntsu[i]) {
                    // 辺張待ち
                    fu += 2;
                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            var mat = agari.atari_pai.match(/^([2-8])([msp])$/);
            var pai = (parseInt(mat[1]) - 1) + mat[2];
            for (var i = 0; i < agari.tehai.shuntsu.length; i++) {
                if (pai == agari.tehai.shuntsu[i]) {
                    // 嵌張待ち
                    fu += 2;
                    break;
                }
            }
        }
    }

    return Math.ceil(fu / 10) * 10;
};

MJ.TokutenKeisan.__hasPinfu = function(yaku_array) {
    for (var i = 0; i < yaku_array.length; i++) {
        if (yaku_array[i].name == '平和') {
            return true;
        }
    }
    return false;
};
