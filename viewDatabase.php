<?php

require_once 'common.php';

echo '<h2>Database</h2>';

$sql = 'SELECT o.id, o.title FROM objects o ORDER BY o.title ASC ';
$stmt = $db->prepare($sql);
$stmt->execute();

foreach (getObjects() as $object) {   
	echo $object['id'] . ': <img src = "icons/' . $object['icon'] . '" /> ' . $object['title'] . ' types: [' . $object['types'] . '] provides: [' . $object['provides'] . ']<br />';
}

?>
