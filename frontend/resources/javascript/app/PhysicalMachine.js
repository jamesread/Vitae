"use strict"; 

define(function() {
	
class PhysicalMachine {
	constructor(socketCount) {
		if (typeof (socketCount) != 'undefined') {
			this.sockets = socketCount;
		}
		else {
			this.sockets = 0;
		}
		this.dom = {};
		this.dom.physicalMachine = $($('<div class = "container physicalMachine" />'));
		this.dom.physicalMachine.model(this);
		this.dom.containerHeader = this.dom.physicalMachine.createAppend('<div class = "containerHeader" />');
		this.dom.title = this.dom.containerHeader.createAppend('<h2 />').text('Physical Machine');
		this.dom.buttonToolbar = this.dom.containerHeader.createAppend('<div class = "buttonToolbar" />');
		this.dom.buttonSettings = this.dom.buttonToolbar.createAppend('<button class = "settings command notext">&nbsp;</button>');
		this.dom.processorArchitecture = this.dom.physicalMachine.createAppend('<p class = "processorArchitecture" />');
		this.dom.icon = this.dom.physicalMachine.createAppend('<img src = "resources/images/icons/32/network-server.png" />');

		this.dom.buttonSettings.clickCallback(this.showSettings, this);

		this.setSockets(2);
	}

    setSockets(newSockets) {
        this.sockets = newSockets;
        this.dom.processorArchitecture.text(this.sockets + ' socket(s)');
    }

    showSettings() {
        var domPhysicalMachineOptions = $('<div />');
        var domSocketOptions = $('<p />').slider({
            value: this.sockets,
            min: 1,
            max: 8,
            slide: (evt, ui) => {
                domPhysicalMachineOptions.find('.socketCount').html(ui.value);
            },
            change: (evt, ui) => {
                this.setSockets(ui.value);
            }
        });

        domPhysicalMachineOptions.createAppend('<p>Sockets: <strong class = "socketCount">' + this.sockets + ' </strong></p>').append(domSocketOptions);
        $(domPhysicalMachineOptions).dialog({
            title: 'Physical machine options',
            modal: true
        });
    }

    toDom() {
        return this.dom.physicalMachine;
    }

}

	return PhysicalMachine;

});
