<?php

require_once 'common.php';

$id = san()->filterUint('id');

$envirionment = array();

switch($id) {
	case 1:
		$environment = array(
			'clusters' => array(
				'stacks' => array(
					array(
						'physicalMachine' => array(
							'sockets' => 9
						),
						'systemSoftware' => array(
							'description' => null,
							'fullTitle' => 'RHEL',
							'title' => 'RHEL',
							'icon' => 'redhat.png'
						)
					)
				)
			)
		);
		break;
}

outputJson($environment);
?>
