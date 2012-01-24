#!/usr/bin/env perl -w

use strict;
use Encode;
use Getopt::Long;

sub usage
{
	print "Unknown option: @_\n" if ( @_ );
	print "usage: gen-conv-tables.pl [--asciitable] [--wrap] [--help]\n";
	exit;
}

my ($table, $wrap, $help, @codepages);
$table = 0;
@codepages = (
	"CP1252", 
	"ISO-8859-7", 
	"CP1251", 
	"Shift-JIS", 
	"ISO-8859-2", 
	"ISO-8859-9",
	"ISO-8859-13",
	"CP936",
	"CP949",
	"CP950"
);

usage() if (!GetOptions('help' => \$help, 'asciitable' => \$table, 'wrap' => \$wrap) or defined $help);

print "/*
 * Auto-generated, do not edit
 *
 * Codepage to UTF8 conversion tables
 * format of exports[codepagename][codepagecharactervalue] = utfcodepagecharacter
 * if does not exist, assume to be the same
 */
 
";

print "(function(exports)
{

" if ($wrap);

foreach (@codepages)
{
	printf "exports['%s'] = {\n", lc($_) if (!$table);

	printf "%s Hex		UTF-8 Hex\n", $_ if ($table);
	print "----------		-----------\n" if ($table);

	for (my $i = 0x0; $i <= 0xff; $i++)
	{

		my $ch = chr($i);
		my $native = Encode::decode($_, $ch);
		my $utf8 = Encode::encode("UTF-8", $native);

		next if ($i == ord($native));

		printf "\t0x%04x: '\\u%04x',\n", $i, ord($native) if (!$table);
		printf "0x%04x		0x%04x\n", $i, ord($native) if ($table);
	}

	printf "}\n\n", lc($_) if (!$table);
}

print "}(typeof exports === \"undefined\"
        ? (this.codepagetoUTF8tables = {})
        : exports));" if ($wrap);
