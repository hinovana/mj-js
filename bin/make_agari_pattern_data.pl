#!/usr/bin/perl

use strict;

my $lines = [];
while (<>) {
    my @data = split(/,/);
    next if @data != 16;
    my @yaku = map {qq|'$_'|} sort grep {
        /^(断ヤオ|平和|一盃口|三色同順|一気通貫|全帯|七対子|対々和|
           三暗刻|混老頭|三色同刻|小三元|混一色|純全帯|二盃口|清一色)$/x
    } split(/\s+/, pop(@data));
    next unless @yaku;
    my $atari = pop(@data);
    push(@$lines, '[[' . join(',', map {qq|'$_'|} @data) . '], ' .
         qq|'$atari', | . '[' . join(',', @yaku) . ']]');
}

print "var agari_data = [\n";
print join(",\n", @$lines), "\n";
print "];\n";

1;
