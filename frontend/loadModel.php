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
							'sockets' => 8
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
	case 2:
	case 3:
		$environment = array(
			'clusters' => array(
				'stacks' => array(
					'physicalMachine' => array(
						'sockets' => 8
					),
					'systemSoftware' => array(
						'description' => null,
						'fullTitle' => 'RHEL',
						'title' => 'RHEL',
						'icon' => 'redhat.png'
					),
					'virtualMachines' => array(
						array(
							'systemSoftware' => array(
								'description' => null,
								'fullTitle' => 'RHEL',
								'title' => 'RHEL',
								'icon' => 'redhat.png'
							)
						),
						array(
							'systemSoftware' => array(
								'description' => null,
								'fullTitle' => 'RHEL',
								'title' => 'RHEL',
								'icon' => 'redhat.png'
							)
						)
					)
				)
			)
		);
}

outputJson($environment);
?>
