#!/usr/bin/perl

use strict;
use Data::Dumper;
use Encode;

while (<>) {
    Encode::from_to($_, 'cp932', 'UTF-8');
    last if m#^===== 東風戦ランキング超上級 561卓 開始 2002/02/15 08:12 =====#;
    last if m#^===== 東風戦ランキング超上級 543卓 開始 2001/10/29 21:16 =====#;
    if (m#^===== 東風戦ランキング超上級 485卓 開始 2001/01/28 09:36 =====# ||
        m#^===== 東風戦：ランキング卓 324卓 開始 2002/03/02 20:00 =====# ||
        m#^===== 東南戦ランキング超上級 482卓 開始 2000/11/13 05:05 =====#) {
        goto hoge;
    }
}

while (<>) {
hoge:
    Encode::from_to($_, 'cp932', 'UTF-8');
    next if /^===== 三人打ち/;
    if (/^=/) {
        parse_dai();
    }
}

sub parse_dai {
    my $head = <>;
    my @sankasha = map {s/^\[\d+\]//; $_} (split(/\s+/, $head))[2,4,6,8];

    my $n = 1;
    my %sankasha = map {$_=>$n++} @sankasha;

    #print join(", ", @sankasha), "\n";

    while (<>) {
        last if /^\s*[-=]/;
        my ($hhh, $agattahito) = (split(/\s+/, $_))[1,3];
        if ($agattahito =~ /^\d+$/ && $hhh =~ /10/) {
            $agattahito = (split(/\s+/, $_))[2];
        }
        my $agahi_num = $agattahito ? ($sankasha{$agattahito} ||
            die "DAME!: $agattahito / " . join(", ", @sankasha)) : 1;
        my $yaku = <>;
        Encode::from_to($yaku, 'cp932', 'UTF-8');
        my $init;
        if ($agahi_num == 1) {
            $init = <>; <>; <>; <>;
        } elsif ($agahi_num == 2) {
            <>; $init = <>; <>; <>;
        } elsif ($agahi_num == 3) {
            <>; <>; $init = <>; <>;
        } elsif ($agahi_num == 4) {
            <>; <>; <>; $init = <>;
        }
        Encode::from_to($init, 'cp932', 'UTF-8');
        ($init =~ s/^\s*\[.*?\]//) || last;
        $init = [grep {$_ !~ /^\s*$/} split(/([1-9][msp]|東|南|西|北|白|発|中)/, $init)];
        my $dora = <>;
        my $seq = [];
        while (<>) {
            last if /^\s*$/;
            Encode::from_to($_, 'cp932', 'UTF-8');
            s/^\s*\*\s*//;
            s/\s+$//;
            push(@$seq, split(/\s+/, $_));
        }

        next if $yaku =~ /^\s*流局/;
        next if $yaku =~ /^\s*流し満貫/;
        next if $yaku =~ /^\s*九種公九牌倒牌/;
        next if $yaku =~ /^\s*チョンボ/;
        next if $yaku =~ /^\s*四風連打/;
        next if $yaku =~ /^\s*四家リーチ/;
        next if $yaku =~ /^\s*三家和/;
        next if $yaku =~ /^\s*四開槓/;

        my $tehai = {};
        foreach my $pai (@$init) {
            if ($pai =~ /[MSP]/) {
                $pai = lc($pai);
            }
            $tehai->{$pai}++;
        }
        my $prev = undef;
        my $tsumo = 0;
        my $atari = undef;
        foreach my $te (@$seq) {
            my ($hito, $type, $pai) = split(//, $te, 3);

            if ($pai =~ /[MSP]/) {
                $pai = lc($pai);
            }

            if ($hito == $agahi_num) {
                if ($type eq 'G') {
                    $tehai->{$pai}++;
                    $tsumo = 1;
                } elsif ($type =~ /d/i) {
                    $tehai->{$pai}--;
                    $tsumo = 0;
                } elsif ($type =~ /[NC]/) {
                    $tehai->{$prev}++;
                    $tsumo = 0;
                } elsif ($type =~ /K/) {
                    if (!$tsumo) {
                        $tehai->{$prev}++;
                    }
                } elsif ($type eq 'R') {
                    # リーチ！！
                    $tsumo = 0;
                } elsif ($type eq 'A') {
                    # あがり！！
                    if (!$tsumo) {
                        $tehai->{$prev}++;
                    }
                    $atari = $prev;
                } else {
                    die "他のが見つかったよ！: $te";
                }
            }
            $prev = $pai;
        }
        
        #print Dumper($tehai);

        my $last_tehai = [];
        foreach my $pai (keys %$tehai) {
            for (my $ii = 0; $ii < $tehai->{$pai}; $ii++) {
                push(@$last_tehai, $pai eq '発' ? '發' : $pai);
            }
        }

=com

        foreach my $type ('m', 's', 'p') {
            for (my $i = 1; $i <= 9; $i++) {
                my $pai = "$i$type";
                for (my $ii = 0; $ii < $tehai->{$pai}; $ii++) {
                    push(@$last_tehai, $pai);
                }
            }
        }
        foreach my $pai (qw(東 南 西 北 白 発 中)) {
            for (my $ii = 0; $ii < $tehai->{$pai}; $ii++) {
                push(@$last_tehai, $pai eq '発' ? '發' : $pai);
            }
        }

=cut

        $yaku =~ s/^\s+//;
        $yaku =~ s/\s+$//;

        $atari = $atari eq '発' ? '發' : $atari;

        print join(',', @$last_tehai, $atari, $yaku), "\n";

        if (@$last_tehai < 14) {
            print Dumper($tehai);
            die "14牌以下です！！";
        }

        if (!$atari) {
            die "当たり牌が設定されてないんですけど？";
        }
    }
}

1;
