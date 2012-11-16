/**
 * SpiderMonkeyで実行する例
 *
 * 実行方法：
 * js example_spidermonkey.js
 *
 * v8のサンプルにあるshellでも実行できる
 * shell example_spidermonkey.js
 */

MJ_LIBDIR = '../lib';
load(MJ_LIBDIR + '/MJ.js');

var tehai = new MJ.Tehai();

// 手牌にランダムで加えていく（最初の牌を当たり牌にする）
for (var i = 0; i < 14; i++) {
	var pai = null;
	do {
		pai = tehai.ALL_PAI[Math.floor(Math.random() * tehai.ALL_PAI.length)];
	} while (tehai.pais[pai] >= 4);
	tehai.add(pai, (i == 0));
}

// 役を判定する
var yaku_array = MJ.Hantei.getResult(tehai) || [];

// 結果を出力する
print(tehai.get() + "\n" + (yaku_array.length ? yaku_array : "役無し"));

