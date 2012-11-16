#!/usr/bin/perl

use strict;

print "var agari_data = [\n";
while (<>) {
    chomp;

    # 字牌を含むものを除外
    if (/(東|西|南|北|白|發|中)/) {
        print STDERR "ignore: $_\n";
        next;
    }

    # 門前清模和じゃないものを除外
    if (!/門前清模和/) {
        print STDERR "ignore: $_\n";
        next;
    }

    my @data = split(/,/, $_, 16);

    # 符がついてないものを除外
    if ($data[-1] !~ /^(\d+)符\s+/) {
        print STDERR "ignore: $data[-1]\n";
        next;
    }

    my $fu = $1;

    printf("[[%s], %s, %d, %s],\n",
           join(", ", map {qq|"$_"|} @data[0 .. 13]),
           qq|"$data[14]"|, $fu, qq|"$data[15]"|);
}
print "];\n";

1;

