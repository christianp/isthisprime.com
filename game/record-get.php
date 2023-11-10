<!doctype html>
<html>
	<head>
		<title>Stats - the Is this prime? game</title>
		<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
		<style type="text/css">
			html {
				font-family: sans-serif;
				font-size: 18px;
			}
			.stats section {
				display: flex;
				flex-wrap: wrap;
				flex-basis: 1;
			}
			table,.chart {
				border-collapse: collapse;
				margin: 2em 1em;
			}
			.chart {
				height: 400px;
				width: 590px;
			}
			table.records {
				width: 100%;
			}
			td,th {
				max-width: 10em;
				overflow-x: hidden;
				padding: 0.2em 1em;
			}
			.records td {
				text-align: right;
			}
			.records td:nth-child(3) {
				word-break: break-word;
			}
			tr:nth-child(even) td {
				background: #eee;
			}
		</style>
	</head>
	<body>
		<h1>Stats for <a href="/game">the "Is this prime?" game</a></h1>
<?php
    $files = scandir('dumps');

    $t = 0;
    foreach($files as $fname) {
        if(substr($fname,-4)=='.zip') {
            $st = stat("dumps/$fname");
            $ft = $st[9];
            if($ft>$t) {
                $t = $ft;
                $last_dump = $fname;
            }
        }
    }

    $last_dump_size = round(filesize("dumps/" . $last_dump) / pow(2,10 * 2));
?>
        <p>This page is updated at most once every minute. It was last updated at <time><?= date('c') ?></time>.</p>
        <p>You can download a dump of every attempt at the game in tab-separated values format: <a href="dumps/<?= $last_dump ?>"><?= $last_dump ?></a> (<?= $last_dump_size ?>MB)</p>
<?php
$DB_USER = 'isthisprime';
$DB_PASSWORD = '';
$DB_NAME = 'isthisprime_game';

$mysqli = new mysqli('localhost',$DB_USER,$DB_PASSWORD,$DB_NAME);

?>
<div class="stats">
<h3>All-time stats</h3>
<section>
<?php
$result = $mysqli->query('SELECT COUNT(*) as c from record');
$n = $result->fetch_row();
$num_attempts = $n[0];
echo "<p>$num_attempts attempts</p>\n";
$result->free();


$result = $mysqli->query('SELECT end_reason,COUNT(*) as num FROM record WHERE end_reason IN (\'composite\', \'prime\', \'time\') GROUP BY end_reason ORDER BY num DESC');
?>
<table>
	<thead>
		<tr>
			<th>Reason for ending</th>
			<th>Frequency</th>
		</tr>
	</thead>
	<tbody>
<?php
	while($line = $result->fetch_assoc()) {
		echo "<tr><td>".htmlspecialchars($line['end_reason'])."</td><td>".$line['num']."</td><td>".round(100*$line['num']/$num_attempts)."%</tr>\n";
	}
?>
	</tbody>
</table>
</section>
<?php
$result->free();


$result = $mysqli->query('SELECT end_reason,end, COUNT(*) as num FROM record GROUP BY end,end_reason ORDER BY num DESC LIMIT 20');
?>
<table>
	<thead>
		<tr>
			<th>Final number</th>
			<th>Reason for ending</th>
			<th>Frequency</th>
		</tr>
	</thead>
	<tbody>
<?php
	while($line = $result->fetch_assoc()) {
		echo "<tr><td>".$line['end']."</td><td>".$line['end_reason']."</td><td>".$line['num']."</td><td>".round(100*$line['num']/$num_attempts,2)."%</td></tr\n";
	}
?>
	</tbody>
</table>
<?php
$result->free();


?>
</section>
</div> <!-- end stats -->
<?php

$query = 'SELECT * FROM record ORDER BY date desc LIMIT 100';
$result = $mysqli->query($query);

?>
<h3>100 most recent attempts</h3>
<table class="records">
	<thead>
		<tr>
			<th>Time finished</th>
			<th>Time taken</th>
			<th>Sequence</th>
			<th>Final number</th>
			<th>Reason for ending</th>
			<th>Difficulty</th>
			<th>Max. number</th>
			<th>Time allowed</th>
		</tr>
	</thead>
<tbody>
<?php
while ($line = $result->fetch_assoc()) {
	echo '<tr>';
	foreach( $line as $column) {
		echo "<td>".htmlspecialchars($column)."</td>";
	}
	echo '</tr>';
}
echo "</tbody></table>\n";

$result->free();


$mysqli->close();
?>
	</body>
</html>
