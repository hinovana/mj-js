if (typeof(MJ) === "undefined")
    MJ = {};

MJ.Tehai = function() {
    this.pais = {};
    this.count = 0;
    this.atari = null;

    this.__cache = {};
};

MJ.Tehai.prototype.ALL_PAI = [
    '1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m',
    '1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s',
    '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p',
    '東', '南', '西', '北', '白', '發', '中'
];

MJ.Tehai.prototype.PAI_MAP = {};
MJ.Tehai.prototype.PAI_RMAP = {};
(function() {
    var cc = 'A'.charCodeAt(0);
    for (var i = 0; i < MJ.Tehai.prototype.ALL_PAI.length; i++, cc++) {
        var c = String.fromCharCode(cc);
        var p = MJ.Tehai.prototype.ALL_PAI[i];
        MJ.Tehai.prototype.PAI_MAP[p] = c;
        MJ.Tehai.prototype.PAI_RMAP[c] = p;
    }
})();

MJ.Tehai.prototype.get = function() {
    if (this.__cache.pai_array) {
        return this.__cache.pai_array;
    }

    if (this.count < 14) {
        return null;
    }

    var array = [];
    for (var pai in this.pais) {
        for (var i = 0; i < this.pais[pai]; i++) {
            array.push(this.PAI_MAP[pai]);
        }
    }
    array.sort();
    for (var i = 0; i < array.length; i++) {
        array[i] = this.PAI_RMAP[array[i]];
    }

    this.__cache.pai_array = array;

    return this.__cache.pai_array;
};

MJ.Tehai.prototype.add = function(pai, isAtari) {
    //if (this.count >= 14) {
    //    return false;
    //}

    if (!this.__isValidPai(pai)) {
        return false;
    }

    var n = this.pais[pai] || 0;
    if (n >= 4) {
        return false;
    }

    this.pais[pai] = n + 1;
    this.count++;
    this.__cache = {};

    if (isAtari) {
        this.setAtari(pai);
    }

    return true;
};

MJ.Tehai.prototype.addAll = function(pai_array, atari) {
    var ret = true;

    for (var i = 0; i < pai_array.length; i++) {
        if (!this.add(pai_array[i])) {
            ret = false;
        }
    }

    if (atari) {
        if (!this.setAtari(atari)) {
            ret = false;
        }
    }

    return ret;
};

MJ.Tehai.prototype.remove = function(pai) {
    if (!this.__isValidPai(pai)) {
        return false;
    }

    var n = this.pais[pai] || 0;
    if (n <= 0) {
        return false;
    }

    this.pais[pai] = n - 1;
    this.count--;
    this.__cache = {};

    if (n == 1 && this.atari == pai) {
        this.atari = null;
    }

    return true;
};

MJ.Tehai.prototype.setAtari = function(pai) {
    if (!this.__isValidPai(pai)) {
        return false;
    }

    if (!this.pais[pai]) {
        return false;
    }

    this.atari = pai;
    this.__cache = {};

    return true;
};

MJ.Tehai.prototype.getAtari = function() {
    return this.atari;
};

MJ.Tehai.prototype.__isValidPai = function(pai) {
    //return (pai && pai.match(/^([1-9][msp]|東|南|西|北|白|發|中)$/));
    return this.PAI_MAP[pai];
};

MJ.Tehai.prototype.getAgariPattern = function() {
    if (this.__cache.agari_pattern) {
        return this.__cache.agari_pattern;
    }

    this.__cache.agari_pattern = this.__searchAgari();

    return this.__cache.agari_pattern;
};

MJ.Tehai.prototype.__searchAgari = function() {
    var result = [];

    // 頭候補を探す。同時に七対子の形になってるかチェック
    var atama_kouho = [];
    var is_chiitoi = true;
    for (var pai in this.pais) {
        if (this.pais[pai] >= 2)
            atama_kouho.push(pai);

        // 4枚使いは認めない
        if (this.pais[pai] != 2)
            is_chiitoi = false;
    }
    

	// 七対子の形になっているならresultに追加
	if (is_chiitoi) {
		result.push(new MJ.Agari(this, {is_chiitoi: true}));
	} else if( atama_kouho.length == 1 ) {
		// 国士無双のチェック
		var tmp_agari = new MJ.Agari(this, {is_chiitoi: false});
		if( MJ.Hantei._Yakuman.isKokushimusou( tmp_agari ) ) {
			this.__pushAgari( { "atama" : atama_kouho[0], "result": result }, [], undefined );
		}
	}

    // 頭候補ごとに面子を探す
    for (var i = 0; i < atama_kouho.length; i++) {
        this.__searchAgari2({
            atama: atama_kouho[i],
            result: result
        });
    }

    return result;
};

MJ.Tehai.prototype.__searchAgari2 = function(params) {
    // 利用してる牌数をコピー
    var used_pais = {};
    for (var pai in this.pais) {
        used_pais[pai] = this.pais[pai];
    }

    // 頭候補を除外
    used_pais[params.atama] -= 2;

    // paramsにセット
    params.used_pais = used_pais;

    // 刻子→順子の順に取り出す
    var check_str = this.__searchAgari3(params);

    // 順子→刻子の順に取り出す
    this.__searchAgari4(params, check_str);
};

MJ.Tehai.prototype.__searchAgari3 = function(params) {
    // 利用してる牌数をコピー
    var used_pais = {};
    for (var pai in params.used_pais) {
        used_pais[pai] = params.used_pais[pai];
    }

    // 探索する
    var mentsu_array = [];
    do {
        var mentsu = null;
        if (((mentsu = this.__getKoutsu(used_pais)) ||
             (mentsu = this.__getShuntsu(used_pais)))) {
            // 刻子→順子の順にチェック
            mentsu_array.push(mentsu);
        } else {
            // これ以上面子に分解できない
            break;
        }
    } while (this.__checkUkihai(used_pais));

    // 4面子揃っていなければ探索失敗
    if (mentsu_array.length < 4)
        return null;

    return this.__pushAgari(params, mentsu_array, null);
};

MJ.Tehai.prototype.__searchAgari4 = function(params, check_str) {
    // 利用してる牌数（コピーしない）
    var used_pais = params.used_pais;

    // 探索する
    var mentsu_array = [];
    do {
        var mentsu = null;
        if (((mentsu = this.__getShuntsu(used_pais)) ||
             (mentsu = this.__getKoutsu(used_pais)))) {
            // 順子→刻子の順にチェック
            mentsu_array.push(mentsu);
        } else {
            // これ以上面子に分解できない
            break;
        }
    } while (this.__checkUkihai(used_pais));

    // 4面子揃っていなければ探索失敗
    if (mentsu_array.length < 4)
        return null;

    return this.__pushAgari(params, mentsu_array, check_str);
};

MJ.Tehai.prototype.__getKoutsu = function(used_pais) {
    var pai_array = this.get();

    for (var i = 0; i < pai_array.length; i++) {
        var pai = pai_array[i];
        if (!used_pais[pai])
            continue;

        if (used_pais[pai] >= 3) {
            used_pais[pai] -= 3;
            return {
                is_koutsu: true,
                p1: pai,
                p2: pai,
                p3: pai
            };
        }

        break;
    }

    return null;
};

MJ.Tehai.prototype.__getShuntsu = function(used_pais) {
    var pai_array = this.get();

    for (var i = 0; i < pai_array.length; i++) {
        var pai = pai_array[i];
        if (!used_pais[pai])
            continue;

        var mat = pai.match(/^([1-7])([msp])$/);
        if (!mat)
            break;

        var pai2 = (parseInt(mat[1]) + 1) + mat[2];
        var pai3 = (parseInt(mat[1]) + 2) + mat[2];

        if (used_pais[pai2] && used_pais[pai3]) {
            used_pais[pai]--;
            used_pais[pai2]--;
            used_pais[pai3]--;
            return {
                is_koutsu: false,
                p1: pai,
                p2: pai2,
                p3: pai3
            };
        }

        break;
    }

    return null;
};

MJ.Tehai.prototype.__checkUkihai = function(used_pais) {
    for (var pai in used_pais) {
        if (used_pais[pai])
            return true;
    }
    return false;
};

MJ.Tehai.prototype.__pushAgari = function(params, mentsu_array, check_str) {
    var tmp = {
        atama: params.atama,
        is_chiitoi: false,
        koutsu: [],
        shuntsu: []
    };

    for (var i = 0; i < mentsu_array.length; i++) {
        var mentsu = mentsu_array[i];
        if (mentsu.is_koutsu) {
            tmp.koutsu.push(mentsu.p1);
        } else {
            tmp.shuntsu.push(mentsu.p1);
        }
    }

    // 重複回避の為のcheck_str
    var check_str2 = ('k=[' + tmp.koutsu.join(',') + ']&' +
                      's=[' + tmp.shuntsu.join(',') + ']');

    // check_strが指定されているならチェック
    if (!check_str || (check_str != check_str2))
        params.result.push(new MJ.Agari(this, tmp));

    return check_str2;
};
