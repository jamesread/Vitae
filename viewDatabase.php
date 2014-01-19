<?php

require_once 'common.php';

?>
<style type = "text/css">
a {
	text-decoration: none;
}

a.delete:hover {
	background-color: salmon;
	color: white;
}

fieldset {
	border: 0;
}

div.box {
	background-color: beige;
	display: inline-block;
}

h2 {
	margin: 0;
}

hr {
	border: 0;
	border-bottom: 1px solid black;
}
</style>
<?php

$sql = 'SELECT o.id, o.title, o.description, o.keywords FROM objects o ORDER BY o.title ASC ';
$stmt = $db->prepare($sql);
$stmt->execute();

function deletionLinks($classes, $objectId, $fn) {
	$classes = explode(',', $classes);

	foreach ($classes as $key => $class) {
		$classes[$key] = '<a class = "delete" href = "editor.php?delete=' . $fn . '&object=' . $objectId . '&class=' . $class. '">' . $class . '</a>';
	}

	$classes = implode(',', $classes);

	return $classes;
}

echo '<table>';
echo '<tr><th colspan = "3">id</th><th>short title</th><th>full title</th><th>types (fits into)</th><th>provides (as well as the defaults for a type)</th><th>description</th><th>keywords</th></tr>';
foreach (getObjects() as $object) {   
	echo '<tr>';
	echo '<td>' . $object['id'] . '</td>';
	echo '<td><a class = "delete" href = "editor.php?delete=object&id=' . $object['id'] . '">X</a></td>';
	echo '<td><img src = "resources/images/icons/' . $object['icon'] . '" /></td><td><a href = "editor.php?objectId=' . $object['id'] . '" />' . $object['title'] . '</a>';
	echo '<td>' . $object['fullTitle'] . '</td>';
	echo '<td>[' . deletionLinks($object['types'], $object['id'], 'types') . ']</td>';
	echo '<td>[' . deletionLinks($object['provides'], $object['id'], 'provider') . ']</td>';
	echo '<td>' . $object['description'] . '</td>';
	echo '<td>' . $object['keywords'] . '</td>';
	echo '</tr>';
}
echo '</table>';

?>
<style type = "text/css">
tr:hover td {
	background-color: beige;
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
