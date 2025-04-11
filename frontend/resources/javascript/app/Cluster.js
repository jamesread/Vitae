"use strict";

import { Stack } from './Stack.js';

export class Cluster {
	constructor(def) {
		this.stacks = [];
		this.domCluster = document.createElement('div')
		this.domCluster.classList.add('container');
		this.domCluster.classList.add('cluster');
		this.domCluster.model(this);
		this.containerHeader = this.domCluster.createAppend('<div class = "containerHeader" />');
		this.containerContents = this.domCluster.createAppend('<div class = "containerContents" />');

		this.title = this.containerHeader.createAppend('<h2>Cluster</h2>').helpTip('A cluster is a group of machines that work together to achieve the same task.');
		this.buttonToolbar = this.containerHeader.createAppend('<div class = "buttonToolbar" />');
		this.buttonClusterSettings = this.buttonToolbar.createAppend('<button class = "command settings">settings</button>');
		this.buttonClusterSettings.clickCallback(this.showClusterSettings, this);
		this.newStackButton = this.buttonToolbar.createAppend('<button class = "command add">add stack</button>');
		this.newStackButton.clickCallback(this.addStack, this);

		//newClosable(this.domCluster, this.closeCluster);
		document.querySelector('.environment').querySelector('.clusterList').append(this.domCluster);

	}

	showClusterSettings() {
		var form = $('<div />');
		var select = form.createAppend('<select />');
		select.createAppend('<option>Production</option>');
		select.createAppend('<option>Development</option>');
		select.createAppend('<option>Staging</option>');

		var domCluster = this.domCluster;

		document.getElementById('cluster-settings').showModal()
	}

	closeCluster() {
		this.domCluster.remove();
	}

	loadClusterModel(model) {
		console.log("cluster load model", model);
		$(model.stacks).each((i, stackDef) => {
			var stack = this.addStack();
			stack.loadStackModel(stackDef);
		});
	}

	addStack(stackDef) {
		window.ssx = new Stack();

		var stack = new Stack();
		if (typeof (stackDef) != 'undefined') {
			stack.loadStackModel(stackDef);
		}

		this.stacks.push(stack);
		this.containerContents.append(stack.toDom());
		return stack;
	};

}

