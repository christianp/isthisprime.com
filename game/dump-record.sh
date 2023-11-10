#!/bin/bash
mysql="mysql -u isthisprime isthisprime_game"
now=$(date +"%Y-%m-%d")
num_records=`echo "select count(*) from record" | $mysql -N`
step=100000
outfile=dumps/dump-$now.tsv
echo "select * from record LIMIT 1" | $mysql | sed -n 1p > $outfile
last_date="1970-01-01 00:00:00"
for ((i = 0; i < $num_records ; i += $step)); do
    echo "$i $last_date";
    echo "select * from record WHERE date>'$last_date' LIMIT $step OFFSET $i" | $mysql -N >> $outfile
    last_date=`cat $outfile | tail -n1 | cut -f1`
    echo $last_date
done
zip dumps/dump-$now.zip dumps/dump-$now.tsv
