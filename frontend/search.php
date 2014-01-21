<?php

require_once 'common.php';

function outputJson($d) {
	header('Content-Type: application/json');
	echo json_encode($d);
	exit;
}

outputJson(getObjects($_REQUEST['term']));

?>
