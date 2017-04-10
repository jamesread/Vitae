"use strict";

define(["Stack"], function(Stack) {

class Cluster {
	constructor(def) {
		this.stacks = [];
		this.domCluster = $('<div class = "container cluster" />');
		this.domCluster.model(this);
		this.containerHeader = this.domCluster.createAppend('<div class = "containerHeader" />');
		this.title = this.containerHeader.createAppend('<h2>Cluster</h2>').helpTip('A cluster is a group of machines that work together to achieve the same task.');
		this.buttonToolbar = this.containerHeader.createAppend('<div class = "buttonToolbar" />');
		this.buttonClusterSettings = this.buttonToolbar.createAppend('<button class = "command settings">settings</button>');
		this.buttonClusterSettings.clickCallback(this.showClusterSettings, this);
		this.newStackButton = this.buttonToolbar.createAppend('<button class = "command add">add stack</button>');
		this.newStackButton.clickCallback(this.addStack, this);

		newClosable(this.domCluster, this.closeCluster);
		$('.environment').append(this.domCluster);

	}

	showClusterSettings() {
		var form = $('<div />');
		var select = form.createAppend('<select />');
		select.createAppend('<option>Production</option>');
		select.createAppend('<option>Development</option>');
		select.createAppend('<option>Staging</option>');

		var domCluster = this.domCluster;

		form.dialog({
			modal: true,
			closeOnEscape: true,
			title: 'Cluster Settings',
			close: function() {
				domCluster.children('.containerHeader').find('h2').prepend('<span />').text(select.val() + ' Cluster');
			}
		});
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
		this.domCluster.append(stack.toDom());
		return stack;
	};

}

    return Cluster;
});
