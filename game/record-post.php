<?php
$DB_USER = 'isthisprime';
$DB_PASSWORD = '';
$DB_NAME = 'isthisprime_game';

$mysqli = new mysqli('localhost',$DB_USER,$DB_PASSWORD,$DB_NAME);

$time_taken = $mysqli->real_escape_string($_POST['time_taken']);
$sequence = $mysqli->real_escape_string($_POST['sequence']);
$end = $mysqli->real_escape_string($_POST['end']);
$end_reason = $mysqli->real_escape_string($_POST['end_reason']);
$difficulty = $mysqli->real_escape_string($_POST['difficulty']);
$max = 0;//$mysqli->real_escape_string($_POST['max']);
$time_allowed = $mysqli->real_escape_string($_POST['time_allowed']);
if(substr($_POST['end_reason'],0,1)!='[') {
    $query = $mysqli->prepare("INSERT INTO record (date,time_taken,sequence,end,end_reason,difficulty,max,time_allowed) VALUES (CURRENT_TIMESTAMP,?,?,?,?,?,?,?)");
    $query->bind_param('ssdsddd', $time_taken, $sequence, $end, $end_reason, $difficulty, $max, $time_allowed);
    $result = $query->execute();
    if($result) {
        echo "ok";
    } else {
        echo "not ok";
        //echo mysqli_error($mysqli);
    }
} else {
    echo "ok";
}

$mysqli->close();
