DL_FILES := kintaro.lzh totuhaihu.lzh momosescore.lzh hirosuehaihu.lzh score.zip
DATA_FILES := 菌太郎牌譜.txt totuhaihu.txt momosescore.txt mjscore.txt score.txt
JSDATA_FILES := agari_pattern_data.js fu_test_data.js
OUT_FILES := agari_data.txt $(JSDATA_FILES)

HAS_BZ2 := $(shell test -e agari_data.txt.bz2 && echo YES)


all: check jsdata agari_data.txt.bz2

# ------------------------------------------------------------------------------

jsdata: $(JSDATA_FILES)

agari_pattern_data.js: agari_data.txt
	../bin/make_agari_pattern_data.pl $^ >$@ 2>/dev/null

fu_test_data.js: agari_data.txt
	../bin/make_fu_test_data.pl $^ >$@ 2>/dev/null

# ------------------------------------------------------------------------------

agari_data.txt.bz2: agari_data.txt
	bzip2 -k -9 $^

ifeq ($(HAS_BZ2),YES)
agari_data.txt:
	bzip2 -d -k agari_data.txt.bz2
else
agari_data.txt: $(DATA_FILES)
	../bin/make_agari_data.pl $(DATA_FILES) > $@
endif

# ------------------------------------------------------------------------------

菌太郎牌譜.txt: kintaro.lzh
	lha x --system-kanji-code=utf8 $^ $@
	touch $@

totuhaihu.txt: totuhaihu.lzh
	lha x $^ $@
	touch $@

momosescore.txt: momosescore.lzh
	lha x $^ $@
	touch $@

mjscore.txt: hirosuehaihu.lzh
	lha x $^ $@
	touch $@

score.txt: score.zip
	unzip $^ $@
	touch $@

# ------------------------------------------------------------------------------

.PHONY: download
download: $(DL_FILES)

kintaro.lzh:
	wget http://www.interq.or.jp/snake/totugeki/kintaro.lzh

totuhaihu.lzh:
	wget http://www.interq.or.jp/snake/totugeki/totuhaihu.lzh

#akagiscore.lzh:
#	wget http://www.interq.or.jp/snake/totugeki/akagiscore.lzh

momosescore.lzh:
	wget http://www.interq.or.jp/snake/totugeki/momosescore.lzh

#iikko.lzh:
#	wget http://www.interq.or.jp/snake/totugeki/iikko.lzh

hirosuehaihu.lzh:
	wget http://www.interq.or.jp/snake/totugeki/hirosuehaihu.lzh

#sysmahaihu.lzh:
#	wget http://members.jcom.home.ne.jp/3233307701/sysmahaihu.lzh

#BJhaifu.zip:
#	wget http://members.jcom.home.ne.jp/haifu/BJhaifu.zip

score.zip:
	wget http://www.interq.or.jp/snake/totugeki/score.zip

# ------------------------------------------------------------------------------

ifeq ($(HAS_BZ2),YES)
check:
	which perl >/dev/null 2>&1 || exit 1
	which bzip2 >/dev/null 2>&1 || exit 1
	echo OK > $@
else
check:
	which perl >/dev/null 2>&1 || exit 1
	which wget >/dev/null 2>&1 || exit 1
	which lha >/dev/null 2>&1 || exit 1
	which unzip >/dev/null 2>&1 || exit 1
	which bzip2 >/dev/null 2>&1 || exit 1
	echo OK > $@
endif

# ------------------------------------------------------------------------------

.PHONY: clean
clean:
	-rm $(DATA_FILES)

.PHONY: clean-download
clean-download:
	-rm $(DL_FILES)

.PHONY: clean-outfiles
clean-outfiles:
	-rm $(OUT_FILES)

.PHONY: clean-all
clean-all: clean clean-download clean-outfiles
	-rm check
