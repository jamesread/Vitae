<?php

function outputJson($d) {
	header('Content-Type: application/json');
	echo json_encode($d);
	exit;
}

function getProducts() {
	return array(
		array(
			'name' => 'RHEL',
			'fitsinto' => array('os', 'hypervisor')
		),
		array(
			'name' => 'RHEV',
			'fitsinto' => array ('hypervisor')
		),
		array(
			'name' => 'OpenStack',
			'fitsinto' => array('hypervisor')
		)
	);
}

outputJson(getProducts());

?>
