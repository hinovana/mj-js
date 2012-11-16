// ===================================================================
// MJ.Hantei_Yakuman.js ---- 役満判定
// ===================================================================
// 上がりが成立している前提でチェックしています
// -------------------------------------------------------------------
// array MJ.Hantei._Yakuman.checkAll                --- 役満を全部チェックして成立するものを配列にして返します
// -------------------------------------------------------------------
// boolean MJ.Hantei._Yakuman.isZyunseiChurenpoutou --- 純正九連宝燈
// boolean MJ.Hantei._Yakuman.isChurenpoutou        --- 九連宝燈
// boolean MJ.Hantei._Yakuman.isKokushimusou13men   --- 国士無双13面待ち
// boolean MJ.Hantei._Yakuman.isZyunseiChurenpoutou --- 純正九連宝燈
// boolean MJ.Hantei._Yakuman.isChiniso             --- 清一色
// boolean MJ.Hantei._Yakuman.isSuuankouTanki       --- 四暗刻単騎
// boolean MJ.Hantei._Yakuman.isSuuankou            --- 四暗刻
// boolean MJ.Hantei._Yakuman.isDaisangen           --- 大三元
// boolean MJ.Hantei._Yakuman.isTsuuiso             --- 字一色
// boolean MJ.Hantei._Yakuman.isChinrouto           --- 清老頭
// boolean MJ.Hantei._Yakuman.isShousuusii          --- 小四喜
// boolean MJ.Hantei._Yakuman.isDaisuusii           --- 大四喜
// boolean MJ.Hantei._Yakuman.isRyuuiisou           --- 緑一色
// -------------------------------------------------------------------
// integer MJ.Hantei._Yakuman.isSuusiihou           --- 四喜和のチェック
// -------------------------------------------------------------------

if (typeof(MJ) === "undefined") { MJ = {}; }
MJ.Hantei = MJ.Hantei || {};
MJ.Hantei._Yakuman = MJ.Hantei._Yakuman || {};

// -------------------------------------------------------------------
// -------------------------------------------------------------------
MJ.Hantei._Yakuman.checkAll = function( agari )
{
	var yaku = [];
	
	// 国士無双チェック
	if( MJ.Hantei._Yakuman.isKokushimusou( agari ) ) {
		// 国士無双の上位役、国士無双13面待ちが成立しているか調べる
		if( MJ.Hantei._Yakuman.isKokushimusou13men( agari ) ) {
			yaku.push( { "name": "国士無双13面待ち", "han" : 26 } );
		} else {
			yaku.push( { "name": "国士無双", "han" : 13 } );
		}
		// 国士無双は他の役満と複合しない
		return yaku;
	}
	
	// 九蓮宝燈のチェック
	if( MJ.Hantei._Yakuman.isChurenpoutou( agari ) ) {
		// 九蓮宝燈の上位役、純正九蓮宝燈が成立しているか調べる
		if( MJ.Hantei._Yakuman.isZyunseiChurenpoutou( agari ) ) {
			yaku.push( { name: "純正九連宝燈", han: 26 } );
		} else {
			yaku.push( { name: "九連宝燈", han: 13 } );
		}
		// 九蓮宝燈は他の役満と複合しない
		return yaku;
	}
	
	// 四暗刻チェック
	if(  MJ.Hantei._Yakuman.isSuuankou( agari ) ) {
		// 四暗刻の上位役、四暗刻単騎が成立しているか調べる
		if( MJ.Hantei._Yakuman.isSuuankouTanki( agari ) ) {
			yaku.push( { name: "四暗刻単騎", han: 26 } );
		} else {
			yaku.push( { name: "四暗刻", han: 13 } );
		}
		// 四暗刻と他の役満は複合する可能性があるのでここでは抜けない
	}

	{ // その他四暗刻と複合する役満のチェック

		// 大三元
		if( MJ.Hantei._Yakuman.isDaisangen( agari ) ) {
			yaku.push( { name: "大三元", han: 13 } );
		}
		
		// 字一色(七対子の状態でも成立する役満)
		if( MJ.Hantei._Yakuman.isTsuuiso( agari ) ) {
			yaku.push( { name: "字一色", han: 13 } );
		}

		// 清老頭(七対子の状態でも成立する役満)
		if( MJ.Hantei._Yakuman.isChinrouto( agari ) ) {
			yaku.push( { name: "清老頭", han: 13 } );
		}
		
		if( MJ.Hantei._Yakuman.isDaisuusii( agari ) ) {
			// 大四喜和
			yaku.push( { name: "大四喜", han: 26 } );
		} else if( MJ.Hantei._Yakuman.isShousuusii( agari ) ) {
			// 小四喜和
			yaku.push( { name: "小四喜和", han: 13 } );
		}
		
		// 緑一色(使える牌の種類が6種類なので七対子とは複合しない)
		// 
		if( MJ.Hantei._Yakuman.isRyuuiisou( agari ) ) {
			yaku.push( { name: "緑一色", han: 13 } );
		}
	}

	return yaku;
}

// ------------------------------------------------------------------
// 国士無双
// ------------------------------------------------------------------
MJ.Hantei._Yakuman.isKokushimusou = function( agari )
{
	var pai_list = ["1m","9m","1s","9s","1p","9p","東","南","西","北","白","發","中"];
	var atama = 0;
	
	for( var i=0; i<pai_list.length; i++ ) {
		var pai = pai_list[i];
		if( !(pai in agari.pai_count) ) {
			return false;
		}
		// 暗刻で持ってたら抜ける
		if( agari.pai_count[pai] > 2 ) {
			return false;
		}
	}
	// 全種類1枚以上あればOK(少牌、多牌のチェックはしてません)

	return true;
}

// ------------------------------------------------------------------
// 国士無双13面待ち
// ------------------------------------------------------------------
MJ.Hantei._Yakuman.isKokushimusou13men = function( agari )
{
	// 国士チェック
	if( ! MJ.Hantei._Yakuman.isKokushimusou( agari ) ) {
		return false;
	}
	
	// 待ちと頭が一致してれば成立
	return ( agari.tehai.atama == agari.atari_pai );
}

// ------------------------------------------------------------------
// 九連宝燈
// ------------------------------------------------------------------
MJ.Hantei._Yakuman.isChurenpoutou = function( agari )
{
	// 清一色不成立
	if( !MJ.Hantei._6Han.isChinitsu( agari ) ) {
		return false;
	}
	return MJ.Hantei._Yakuman.isChurenpoutou_2nd( agari );
}

// ------------------------------------------------------------------
// 少牌してても、一色で1112345678999が含まれていれば通るチェック
// ------------------------------------------------------------------
MJ.Hantei._Yakuman.isChurenpoutou_2nd = function( agari )
{
	// 色
	var color = agari.pai_array[0].match(/\d(m|s|p)/)[1];

	for( var i=1; i<=9; i++ ) {
		var check_pai = String(i) + color;

		if( !( check_pai in agari.pai_count ) ) {
			return false;
		}

		switch(i)
		{
		case 1:
		case 9:
			if( agari.pai_count[check_pai] < 3 ) {
				return false;
			}
			break;
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 7:
		case 8:
			if( agari.pai_count[check_pai] > 2 ) {
				return false;
			}
			break;
		}
	}
	return true;
}

// ------------------------------------------------------------------
// 純正九連宝燈
// ------------------------------------------------------------------
MJ.Hantei._Yakuman.isZyunseiChurenpoutou = function( agari )
{
	// 清一色不成立
	if( !MJ.Hantei._6Han.isChinitsu( agari ) ) {
		return false;
	}
	var cut_pai   = undefined;
	var temp_pais = [];

	// 上がり形から待ちの牌を引いた形にする
	for( var i=0; i<agari.pai_array.length; i++ ) {
		var pai = agari.pai_array[i];
		if( agari.atari_pai == pai && cut_pai == undefined ) {
			cut_pai = pai;
			--agari.pai_count[ pai ];
		} else {
			temp_pais.push( pai );
		}
	}
	agari.pai_array = temp_pais;
	
	// 純正の場合は頭をカットしても九連宝燈の清一チェック抜きのほうに通る
	return MJ.Hantei._Yakuman.isChurenpoutou_2nd( agari );
}

// ------------------------------------------------------------------
// 四暗刻単騎
// ------------------------------------------------------------------
MJ.Hantei._Yakuman.isSuuankouTanki = function( agari )
{
	if( MJ.Hantei._Yakuman.isSuuankou(agari) == false ) {
		// 四暗刻不成立
		return false;
	}
	// 頭と上がり牌を比較するだけ
	return ( agari.tehai.atama == agari.atari_pai );
}

// ------------------------------------------------------------------
// 四暗刻
// ------------------------------------------------------------------
MJ.Hantei._Yakuman.isSuuankou = function( agari )
{
	// 刻子の数を数えるだけ
	return ( agari.tehai.koutsu.length == 4 );
}

// ------------------------------------------------------------------
// 大三元
// ------------------------------------------------------------------
MJ.Hantei._Yakuman.isDaisangen = function( agari )
{
	var sangen_pai_list = ["白","發","中"];
	
	for( var i=0; i<sangen_pai_list.length; i++ ) {
		var sangen_pai = sangen_pai_list[i];
		if( !( sangen_pai in agari.pai_count ) ) {
			return false;
		}
		if( agari.pai_count[sangen_pai] < 3 ) {
			return false;
		}
	}
	return true;
}

// ------------------------------------------------------------------
// 字一色
// ------------------------------------------------------------------
MJ.Hantei._Yakuman.isTsuuiso = function( agari )
{
	var _regexp = new RegExp;
	{
		_regexp.compile("^[東南西北白發中]$");
	}
	for( key in agari.pai_count ) {
		if( _regexp.test( key ) == false ) {
			return false;
		}
	}
	return true;
}

// ------------------------------------------------------------------
// 清老頭
// ------------------------------------------------------------------
MJ.Hantei._Yakuman.isChinrouto = function( agari )
{
	var _regexp = new RegExp;
	{
		_regexp.compile("^(1|9)(m|s|p)$");
	}
	for( key in agari.pai_count ) {
		if( _regexp.test( key ) == false ) {
			return false;
		}
	}
	return true;
}


// ------------------------------------------------------------------
// 四喜和のチェック
// ------------------------------------------------------------------
// 戻り値
// 風牌の暗刻数
// ------------------------------------------------------------------
MJ.Hantei._Yakuman.__kazehaiAnkoLength = function( agari )
{
	var pai_list = [ "東","南","西","北" ];
	var suusii_anko = 0;
	
	for( var i=0; i<pai_list.length; i++ ) {
		var pai = pai_list[i];
		if( !( pai in agari.pai_count ) ) {
			continue;
		}
		if( agari.pai_count[pai] == 3 ) {
			++suusii_anko;
		}
	}
	return suusii_anko;
}

// ------------------------------------------------------------------
// 小四喜
// ------------------------------------------------------------------
MJ.Hantei._Yakuman.isShousuusii = function( agari )
{
	// 風牌の暗刻が3つで頭が風牌(5枚持ちは想定してません)
	if( MJ.Hantei._Yakuman.__kazehaiAnkoLength( agari ) == 3 ) {
		if( agari.tehai.atama.match(/^(東|南|西|北)$/) ) {
			return true;
		}
	}
	return false;
}

// ------------------------------------------------------------------
// 大四喜
// ------------------------------------------------------------------
MJ.Hantei._Yakuman.isDaisuusii = function( agari )
{
	return ( MJ.Hantei._Yakuman.__kazehaiAnkoLength( agari ) == 4 );
}

// ------------------------------------------------------------------
// 緑一色
// ------------------------------------------------------------------
MJ.Hantei._Yakuman.isRyuuiisou = function( agari )
{
	var pai_list = [ "2s", "3s", "4s", "6s", "8s", "發" ];
	
	for( key in agari.pai_count ) {
		if( pai_list.indexOf( key ) == -1 ) {
			return false;
		}
	}
	return true;
}


