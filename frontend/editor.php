<?php

require_once 'common.php';

require_once 'libAllure/util/shortcuts.php';
require_once 'libAllure/ErrorHandler.php';
require_once 'libAllure/Template.php';
require_once 'libAllure/Form.php';
require_once 'libAllure/FormHandler.php';

use \libAllure\FormHandler;
use \libAllure\ElementSelect;
use \libAllure\DatabaseFactory;
use \libAllure\ElementInput;

$eh = new \libAllure\ErrorHandler();
$eh->beGreedy();

$tpl = new libAllure\Template('solutionBuilder');

echo '<h1><a href = "editor.php">Database editor</a></h1>';

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
	public function __construct($objectId) {
		parent::__construct('addType', 'Add Type to Object (object fits into)');

		$this->addElementHidden('objectId', $objectId);
		$this->addElement(getElementSelectClass());

		$this->addDefaultButtons();
	}

	public function process() {
		$sql = 'INSERT INTO object_types (object, class) VALUES (:object, :class)';
		$stmt = DatabaseFactory::getInstance()->prepare($sql);
		$stmt->bindValue(':object', $this->getElementValue('objectId'));
		$stmt->bindValue(':class', $this->getElementValue('class'));
		$stmt->execute();

		echo 'type added';
		echo '<a href = "editor.php">okay</a>';
	}
}

class FormAddProvider extends libAllure\Form {
	public function __construct($objectId) {
		parent::__construct('addProvider', 'Add Provider to Object');

		$this->addElementHidden('objectId', $objectId);
		$this->addElement(getElementSelectClass());

		$this->addDefaultButtons();
	}

	public function process() {
		$sql = 'INSERT INTO object_providers (object, class) VALUES (:object, :class)';
		$stmt = DatabaseFactory::getInstance()->prepare($sql);
		$stmt->bindValue(':object', $this->getElementValue('objectId'));
		$stmt->bindValue(':class', $this->getElementValue('class'));
		$stmt->execute();

		echo 'provider added';
		echo '<a href = "editor.php">okay</a>';
	}

}

class FormCreateObject extends libAllure\Form {
	public function __construct() {
		parent::__construct('createObject', 'Create Object');

		$this->addElement(new ElementInput('title', 'Title'));
		$this->addDefaultButtons();
	}

	public function process() {
		$sql = 'INSERT INTO objects (title) VALUES (:title)';
		$stmt = stmt($sql);
		$stmt->bindValue(':title', $this->getElementValue('title'));
		$stmt->execute();
	}
}

class WidgetlessFormHandler extends FormHandler {
	protected function handleRenderForm(\libAllure\Form $form) {
		global $tpl;
		$tpl->assignForm($form);
		$tpl->display('form.tpl');
	}
}

class FormUpdateObject extends libAllure\Form {
	public function __construct($id) {
		parent::__construct('updateObject', 'Update Object');

		$sql = 'SELECT o.id, o.description, o.title, o.keywords FROM objects o WHERE o.id = :objectId LIMIT 1';
		$stmt = stmt($sql);
		$stmt->bindValue(':objectId', $id);
		$object = $stmt->execute()->fetchRow();

		$this->addElementHidden('id', $object['id']);
		$this->addElement(new ElementInput('title', 'Title', $object['title']));
		$this->getElement('title')->setMinMaxLengths(1, 64);
		$this->addElement(new ElementInput('description', 'Description', $object['description']));
		$this->addElement(new ElementInput('keywords', 'Keywords', $object['keywords']));
		$this->addDefaultButtons();
	}

	public function process() {
		$sql = 'UPDATE objects SET title = :title, description = :description, keywords = :keywords WHERE id = :id';
		$stmt = stmt($sql);
		$stmt->bindValue(':title', $this->getElementValue('title'));
		$stmt->bindValue(':description', $this->getElementValue('description'));
		$stmt->bindValue(':keywords', $this->getElementValue('keywords'));
		$stmt->bindValue(':id', $this->getElementValue('id'));
		$stmt->execute();

		echo 'updated';
	}
}

if (isset($_REQUEST['objectId'])) {
	$formEditObject = new WidgetlessFormHandler('FormUpdateObject');
	$formEditObject->setConstructorArgument(0, $_REQUEST['objectId']);
	$formEditObject->handle();

	$formAddType = new WidgetlessFormHandler('FormAddType');
	$formAddType->setConstructorArgument(0, $_REQUEST['objectId']);
	$formAddType->handle();

	$formAddProvider = new WidgetlessFormHandler('FormAddProvider');
	$formAddProvider->setConstructorArgument(0, $_REQUEST['objectId']);
	$formAddProvider->handle();

	echo '<br /><a href = "editor.php">cancel</a><hr />';
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
	} elseif ($_REQUEST['delete'] == 'object') {
		$sql = 'DELETE o FROM objects o WHERE o.id = :id';
		$stmt = stmt($sql);
		$stmt->bindValue(':id', san()->filterUint('id'));
		$stmt->execute();
	}
}

$formCreateObject = new WidgetlessFormHandler('FormCreateObject');
$formCreateObject->handle();

require_once 'viewDatabase.php';

?>
