<?php

function outputJson($d) {
	header('Content-Type: application/json');
	echo json_encode($d);
	exit;
}

require_once 'libAllure/Database.php';

use \libAllure\DatabaseFactory;
use \libAllure\Database;

$db = new Database();

function getObjects() {
	global $db;

	$sql = 'SELECT o.title FROM objects o ';
	$stmt = $db->prepare($sql);
	$stmt->execute();

	return $stmt->fetchAll();
}

outputJson(getObjects());

?>
