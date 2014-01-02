<?php

require_once 'common.php';

$sql = 'SELECT o.id, o.title FROM objects o ORDER BY o.title ASC ';
$stmt = $db->prepare($sql);
$stmt->execute();

foreach (getObjects() as $object) {   
	echo $object['id'] . ': ' . $object['title'] . ' types: [' . $object['types'] . '] provides: [' . $object['provides'] . ']<br />';
}

?>
