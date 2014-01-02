<?php

require_once 'common.php';

require_once 'libAllure/shortcuts.php';
require_once 'libAllure/ErrorHandler.php';
require_once 'libAllure/Template.php';
require_once 'libAllure/Form.php';
require_once 'libAllure/FormHandler.php';

use \libAllure\FormHandler;
use \libAllure\ElementSelect;
use \libAllure\DatabaseFactory;

$eh = new \libAllure\ErrorHandler();
$eh->beGreedy();

$tpl = new libAllure\Template('solutionBuilder');


function getElementSelectObject() {
	$el = new ElementSelect('object', 'Object');

	$sql = 'SELECT o.title, o.id FROM objects o ORDER BY o.title ASC';
	$stmt = DatabaseFactory::getInstance()->prepare($sql);
	$stmt->execute();

	foreach ($stmt->fetchAll() as $object) {
		$el->addOption($object['title'], $object['id']);
	}

	return $el;
}

function getElementSelectClass() {
	$el = new ElementSelect('class', 'Class');

	$sql = 'SELECT c.title, c.id FROM classes c';
	$stmt = DatabaseFactory::getInstance()->prepare($sql);
	$stmt->execute();

	foreach ($stmt->fetchAll() as $class) {
		$el->addOption($class['title'], $class['id']);
	}

	return $el;
}



class FormAddType extends libAllure\Form {
	public function __construct() {
		parent::__construct('addType', 'Add Type to Object (object fits into)');

		$this->addElement(getElementSelectObject());
		$this->addElement(getElementSelectClass());

		$this->addDefaultButtons();
	}

	public function process() {
		$sql = 'INSERT INTO object_types (object, class) VALUES (:object, :class)';
		$stmt = DatabaseFactory::getInstance()->prepare($sql);
		$stmt->bindValue(':object', $this->getElementValue('object'));
		$stmt->bindValue(':class', $this->getElementValue('class'));
		$stmt->execute();

		echo 'type added';
		echo '<a href = "editor.php">okay</a>';
	}
}

class FormAddProvider extends libAllure\Form {
	public function __construct() {
		parent::__construct('addProvider', 'Add Provider to Object');

		$this->addElement(getElementSelectObject());
		$this->addElement(getElementSelectClass());

		$this->addDefaultButtons();
	}

	public function process() {
		$sql = 'INSERT INTO object_providers (object, class) VALUES (:object, :class)';
		$stmt = DatabaseFactory::getInstance()->prepare($sql);
		$stmt->bindValue(':object', $this->getElementValue('object'));
		$stmt->bindValue(':class', $this->getElementValue('class'));
		$stmt->execute();

		echo 'provider added';
		echo '<a href = "editor.php">okay</a>';
	}

}

class WidgetlessFormHandler extends FormHandler {
	protected function handleRenderForm(\libAllure\Form $form) {
		global $tpl;
		$tpl->assignForm($form);
		$tpl->display('form.tpl');
	}
}

if (isset($_REQUEST['delete'])) {
	if ($_REQUEST['delete'] == 'provider') {
		$sql = 'DELETE p FROM object_providers p INNER JOIN classes c ON p.class = c.id AND c.title = :class WHERE p.object = :id';
		$stmt = stmt($sql);
		$stmt->bindValue('id', san()->filterUint('object'));
		$stmt->bindValue('class', san()->filterString('class'));
		$stmt->execute();
	} elseif ($_REQUEST['delete'] == 'types') {
		$sql = 'DELETE t FROM object_types t INNER JOIN classes c ON t.class = c.id AND c.title = :class WHERE t.object = :id';
		$stmt = stmt($sql);
		$stmt->bindValue('id', san()->filterUint('object'));
		$stmt->bindValue('class', san()->filterString('class'));
		$stmt->execute();
	}
}

$formAddType = new WidgetlessFormHandler('FormAddType');
$formAddType->handle();
$formAddProvider = new WidgetlessFormHandler('FormAddProvider');
$formAddProvider->handle();

require_once 'viewDatabase.php';

?>
