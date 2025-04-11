"use strict";

import { SystemSoftware } from './SystemSoftware.js';
import { PhysicalMachine } from './PhysicalMachine.js';

export class Stack {
	constructor(def) {
		this.domStack = document.createElement('div')
		this.domStack.classList.add('container');
		this.domStack.classList.add('stack');
		this.domStack.model({});
		this.domStackHeader = this.domStack.createAppend('<div class = "containerHeader" />')
		this.domStackContents = this.domStack.createAppend('<div class = "stackContents" />')
//		this.domStackContents.model(this);
		this.domTitle = this.domStackHeader.createAppend('<h2>Stack</h2>').helpTip('A stack is a collection of hardware and software that works together.');
		this.domMultiplier = this.domTitle.createAppend('<span class = "multiplyer" />');
		this.domButtonToolbar = this.domStackHeader.createAppend('<div class = "buttonToolbar" />');
		this.buttonStackSettings = this.domButtonToolbar.createAppend('<button class = "command settings notext">&nbsp;</button>');
		//newClosable(this.domStack, closeStack);
		this.systemSoftware = new SystemSoftware();
		this.physicalMachine = new PhysicalMachine();
		this.vms = [];

//		this.domStack.model(this);
		this.domStackContents.createAppend(this.systemSoftware.toDom());
		this.domStackContents.createAppend(this.physicalMachine.toDom());
		this.buttonStackSettings.clickCallback(this.showSettings, this);
		
		this.slider = document.getElementById('stack-count')

		this.setMultiplier(1);
	}

	showSettings() {
		var stackSettings = document.getElementById('stack-settings');

		this.slider.onchange = () => {
			this.setMultiplier()
		}

		stackSettings.showModal()
	}

	setMultiplier() {
		const count = this.slider.value;

		console.log(count)

		this.multiplyer = count
		var text = ((count == 1) ? '' : ' <span class = "subtle">x' + count + '</span>');
		this.domMultiplier.innerHTML = text;
	}

	toDom() {
		return this.domStack;
	}

	addVm(vm) {
		this.vms.push(vm);
	}

	loadStackModel(mdl) {
		console.log("load stack", mdl);
		this.physicalMachine.setSockets(mdl.physicalMachine.sockets);
		this.systemSoftware.loadSsModel(mdl.systemSoftware);
	}

}
