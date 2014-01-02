<?php

require_once 'common.php';

echo '<h2>Database</h2>';

$sql = 'SELECT o.id, o.title FROM objects o ORDER BY o.title ASC ';
$stmt = $db->prepare($sql);
$stmt->execute();

echo '<table>';
echo '<tr><th colspan = "2">id</th><th>title</th><th>types</th><th>provides</th></tr>';
foreach (getObjects() as $object) {   
	echo '<tr><td>' . $object['id'] . '</td><td><img src = "icons/' . $object['icon'] . '" /></td><td>' . $object['title'] . '</td><td>[' . $object['types'] . ']</td><td>[' . $object['provides'] . ']</td></tr>';
}
echo '</table>';

?>
<style type = "text/css">
tr:hover td {
	background-color: cyan;
}

td {
	padding: .2em;
}

table {
	width: 100%;
}

th {
	text-align: left;
}
</style>
