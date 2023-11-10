<?php

const CACHE_FILE = 'record.cache.html';
const REGEN_INTERVAL = 60; // minimum number of seconds between generations of the page

function generate_page() {

    ob_start();

    require 'record-get.php';
//    echo "hii1!!!!!";

    $page = ob_get_contents();

    ob_end_clean();

    $f = fopen(CACHE_FILE,'w');

    fwrite($f,$page);

    fclose($f);
}

function read_page() {
    $f = fopen(CACHE_FILE,'r');

    $content = fread($f, filesize(CACHE_FILE));

    fclose($f);

    echo $content;
}

if(file_exists(CACHE_FILE)) {
    $st = stat(CACHE_FILE);
    $lastmodified = $st[9];
    $dt = time() - $lastmodified;
} else {
    $dt = REGEN_INTERVAL+1;
}

if($dt>=REGEN_INTERVAL) {
    generate_page();
}

read_page();
?>
