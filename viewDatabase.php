<?php

require_once 'common.php';

echo '<h2>Database</h2>';

$sql = 'SELECT o.id, o.title FROM objects o ORDER BY o.title ASC ';
$stmt = $db->prepare($sql);
$stmt->execute();

function deletionLinks($classes, $objectId, $fn) {
	$classes = explode(',', $classes);

	foreach ($classes as $key => $class) {
		$classes[$key] = '<a href = "editor.php?delete=' . $fn . '&object=' . $objectId . '&class=' . $class. '">' . $class . '</a>';
	}

	$classes = implode(',', $classes);

	return $classes;
}

echo '<table>';
echo '<tr><th colspan = "2">id</th><th>title</th><th>types (fits into)</th><th>provides (as well as the defaults for a type)</th></tr>';
foreach (getObjects() as $object) {   
	echo '<tr><td>' . $object['id'] . '</td><td><img src = "resources/images/icons/' . $object['icon'] . '" /></td><td>' . $object['title'] . '</td><td>[' . deletionLinks($object['types'], $object['id'], 'types') . ']</td><td>[' . deletionLinks($object['provides'], $object['id'], 'provider') . ']</td></tr>';
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
