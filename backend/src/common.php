<?php

require_once '../vendor/autoload.php';

date_default_timezone_set('Europe/London');

use \libAllure\DatabaseFactory;      
use \libAllure\Database;

\libAllure\Sanitizer::getInstance()->enableSearchingPrefixKeys();

require_once 'config.php';

$db = new Database("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
\libAllure\DatabaseFactory::registerInstance($db);

function getObjects($term = '', $addDefaults = false) {  
    global $db;  

    $sql = '
SELECT 
        o.id, 
        o.title,
        o.keywords,
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
ORDER BY fullTitle ASC
';

    $stmt = $db->prepare($sql); 
    $stmt->bindValue(':term', '%' . $term . '%');
    $stmt->execute();

    $objects = $stmt->fetchAll();

    if ($addDefaults) {
        foreach ($objects as $key => $object) {
            if (empty($object['provides'])) {
                addDefaultType($objects, $key, 'os', 'app');
                addDefaultType($objects, $key, 'hypervisor', 'os');
            }
        }
    }

    return $objects;
}  

function addDefaultType(&$objects, $key, $type, $provides) {
    if ($objects[$key]['types'] == null) {
        return;
    }

    if (strpos($objects[$key]['types'], $type) !== false) {
        if ($objects[$key]['provides'] == null) {
            $objects[$key]['provides'] = '';
        }

        if (strlen($objects[$key]['provides']) > 0) {
            $objects[$key]['provides'] .= ',';
        }
        $objects[$key]['provides'] .= '+' . $provides;
    }

}

function outputJson($d) {
    header('Content-Type: application/json');
    echo json_encode($d);
    exit;
}

?>
