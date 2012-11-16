// 
// 実行するとMJ.Hantei_Yakuman.js のチェックができます
// シェル用です。print関数をカンマ区切りにしたけど大丈夫かな
//

MJ_LIBDIR = '../lib';

load("../lib/MJ.js");
load("../lib/jkl-dumper.js");

;(function(){
	var agari = [
		[ "南,南,西,北,白,發,中,1m,9m,1s,9s,1p,9p,東", "東", "国士無双" ],
		[ "東,南,西,北,白,發,中,1m,9m,1s,1s,9s,1p,9p", "1s", "国士無双十三面待ち"],
		[ "1m,1m,1m,2m,2m,3m,4m,5m,6m,7m,8m,9m,9m,9m", "9m", "九連宝燈"],
		[ "1s,1s,1s,2s,2s,3s,4s,5s,6s,7s,8s,9s,9s,9s", "2s", "純正九連宝燈"],
		[ "1s,1s,1s,3s,3s,3s,東,東,東,9m,9m,9m,9p,9p", "3s", "四暗刻"],
		[ "5p,5p,5p,3m,3m,3m,北,北,北,9p,9p,9p,白,白", "白", "四暗刻単騎"],
		[ "發,發,發,白,白,白,中,中,中,2s,3s,4s,1m,1m", "中", "大三元"],
		[ "發,發,發,白,白,白,中,中,中,南,南,南,北,北", "中", "大三元,字一色,四暗刻"],
		[ "發,發,發,白,白,白,中,中,中,東,東,東,西,西", "西", "大三元,字一色,四暗刻単騎"],
		[ "東,東,東,西,西,西,中,中,中,北,北,北,發,發", "西", "字一色,四暗刻"],
		[ "東,東,東,西,西,西,中,中,中,北,北,北,南,南", "西", "字一色,小四喜","四暗刻"],
		[ "東,東,東,西,西,西,中,中,中,北,北,北,南,南", "西", "字一色,小四喜","四暗刻"],
		[ "東,東,東,西,西,西,白,白,北,北,北,南,南,南", "西", "字一色,大四喜","四暗刻"],
		[ "東,東,東,西,西,西,北,北,北,南,南,2s,2s,2s", "2s", "小四喜和,四暗刻"],
		[ "東,東,東,西,西,西,5m,5m,北,北,北,南,南,南", "南", "大四喜和,四暗刻"],
		[ "東,東,東,1p,1p,西,西,西,北,北,北,南,南,南", "北", "大四喜和,四暗刻"],
		[ "2s,2s,2s,3s,3s,4s,4s,4s,發,發,發,8s,8s,8s", "3s", "緑一色,四暗刻単騎"],
		[ "發,發,發,2s,2s,2s,3s,3s,3s,6s,6s,8s,8s,8s", "發", "緑一色,四暗刻"],
		[ "1s,1s,1s,9m,9m,9m,1p,1p,1p,9s,9s,9s,1m,1m", "9m", "清老頭,四暗刻"],
		[ "9s,9s,9s,1m,1m,1s,1s,1s,9m,9m,9m,9p,9p,9p", "1s", "清老頭,四暗刻"] ];

	var Dumper = function(val_) {
		return (new JKL.Dumper).dump(val_);
	}

	var yakuman_check = function(agari_pattern) {
		for( var i=0; i<agari_pattern.length; i++ ) {
			var agari = agari_pattern[i];
			var yaku_array = MJ.Hantei._Yakuman.checkAll( agari );
			
			if( !yaku_array.length ) {
				print("\t不成立");
				continue;
			}
			
			for( var ii=0; ii<yaku_array.length; ii++ ) {
				var yaku = yaku_array[ii];
				print( "\t", yaku.name );
			}
		}
		print();
	}

	/*
	//単体チェック
	var agari_once = agari[ 4 ];
	var tehai = new MJ.Tehai();
	{
		tehai.addAll( agari_once[0].split(/,/), agari_once[1] );
	}
	print( ":手牌:", agari_once[0], " 上がり牌:", agari_once[1], " 期待する役:", agari_once[2] );
	var agari_pattern = tehai.getAgariPattern();
	yakuman_check( agari_pattern );
	throw "break";
	*/

	for( var i=0; i<agari.length; i++ ) {
		var num = i;
		var agari_once = agari[ num ];

		var tehai = new MJ.Tehai();
		{
			tehai.addAll( agari_once[0].split(/,/), agari_once[1] );
		}

		print( i, ":手牌:", agari_once[0], " 上がり牌:", agari_once[1], " 期待する役:", agari_once[2] );
		var agari_pattern = tehai.getAgariPattern();

		yakuman_check( agari_pattern );
	}
})();
