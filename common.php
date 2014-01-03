<?php

date_default_timezone_set('Europe/London');

require_once 'libAllure/Database.php';  

use \libAllure\DatabaseFactory;      
use \libAllure\Database;

require_once 'config.php';

$db = new Database('mysql:host=localhost;dbname=solutionBuilder', 'root', $db_pass);
\libAllure\DatabaseFactory::registerInstance($db);

function getObjects($term = '') {  
	global $db;  
  
	$sql = '
SELECT 
	o.id, 
	o.title,
	if(isnull(o.fullTitle), o.title, o.fullTitle) AS fullTitle,
	if(isnull(o.icon), "default.png", o.icon) AS icon, 
	GROUP_CONCAT(distinct ct.title) AS types, 
	GROUP_CONCAT(distinct cp.title) AS provides,
	o.description
FROM objects o 
LEFT JOIN object_types t ON 
	t.object = o.id 
LEFT JOIN classes ct ON 
	t.class = ct.id 
LEFT JOIN object_providers p ON
	o.id = p.object
LEFT JOIN classes cp ON
	p.class = cp.id
WHERE 
	o.title LIKE :term
	OR o.fullTitle LIKE :term
	OR o.keywords LIKE :term
GROUP BY o.id
ORDER BY o.title ASC
';

	$stmt = $db->prepare($sql); 
	$stmt->bindValue(':term', '%' . $term . '%');
	$stmt->execute();
	

	return $stmt->fetchAll();
}  

?>
