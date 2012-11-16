#!/usr/bin/perl
#
# MJ-{version}.min.jsを作成する

use strict;
use FindBin;
use File::Temp qw(tempfile);
use Getopt::Std;
use POSIX qw(strftime);

# ------------------------------------------------------------------------------

my $opts = {};
getopts('c:n:h', $opts);

if ($opts->{'h'}) {
    print <<EOS;
usage: $0 [-c command] [-n version]
EOS
}

# ------------------------------------------------------------------------------

# 圧縮用コマンド
my $cmd = $opts->{'c'} || $ENV{MJ_COMP_CMD}
  || 'java -jar yuicompressor-2.4.2.jar --type js --charset utf8 -o {OUTPUT} {INPUT}';

# バージョン
my $version = $opts->{'n'} ? ('-' . $opts->{'n'}) : "";

# 出力先
my $out = $FindBin::Bin . "/../lib/MJ$version.min.js";
$out =~ s#^/cygdrive/(.*?)/#$1:/#;

# ------------------------------------------------------------------------------

my $files = get_mj_files();
my $tmp = write_tmp_file($files) || exit(1);

$cmd =~ s/\{OUTPUT\}/$out/g;
$cmd =~ s/\{INPUT\}/$tmp/g;

print STDERR "execute: $cmd\n";
my $res = system($cmd);

if ($res == 0) {
    print "OK\n";
    unlink($tmp);
} else {
    print "NG\n";
}

# ------------------------------------------------------------------------------

sub get_mj_files {
    my $mj_js = $FindBin::Bin . '/../lib/MJ.js';

    my $files = [];

    open(IN, $mj_js) || die "cannot open $mj_js: $!";
    while (<IN>) {
        last if /^\s*var FILES = \[\s*$/;
    }
    while (<IN>) {
        last if /^\s*\];\s*$/;
        s/^\s*'//;
        s/',\s*$//;
        s/'$//;
        push(@$files, $FindBin::Bin . '/../lib/MJ/' . $_);
    }
    close(IN);

    return $files;
}

sub write_tmp_file {
    my $files = shift;

    my ($fh, $fn) = tempfile('MJ-tmp.XXXXXXXX', UNLINK => 0);

    eval {
        foreach my $file (@$files) {
            open(IN, $file) || die "cannot open $file: $!";
            local $/ = undef;
            print $fh <IN>;
            print $fh "\n";
            close(IN);
        }
    };
    if ($@) {
        print STDERR "$@\n";
        close($fh);
        unlink($fn);
        return undef;
    }

    close($fh);

    return $fn;
}

1;
