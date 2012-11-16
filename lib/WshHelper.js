/**
 * WSH用のヘルパ関数
 */

/**
 * 外部jsファイルをロードする
 *
 * @param path ロードするファイルのパス
 */
function load(path) {
    var ist = WScript.CreateObject("ADODB.Stream");
    ist.Type = 2;
    ist.charset = 'UTF-8';
    ist.Open();
    ist.LoadFromFile(path);
    eval(ist.ReadText(-1));
}

/**
 * 文字列を出力する
 *
 * @param text 出力する文字列
 */
function print(text) {
    WScript.echo(text);
}
