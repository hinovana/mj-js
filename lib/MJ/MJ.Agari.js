if (typeof(MJ) === "undefined")
    MJ = {};

MJ.Agari = function(tehai, agari) {
    this.tehai = agari;
    this.tsumo = tehai.tsumo;
    this.atari_pai = tehai.getAtari();
    this.pai_array = tehai.get();
    this.pai_count = tehai.pais;
};
