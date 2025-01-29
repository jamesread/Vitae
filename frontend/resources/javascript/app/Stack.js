"use strict";

define(["SystemSoftware", "PhysicalMachine"], function(SystemSoftware, PhysicalMachine) {

  class Stack {
    constructor(def) {
      this.domStack = $('<div class = "container stack" />');
      this.domStack.model({});
      this.domStackHeader = this.domStack.createAppend('<div class = "containerHeader" />');
      this.domTitle = this.domStackHeader.createAppend('<h2>Stack</h2>').helpTip('A stack is a collection of hardware and software that works together.');
      this.domMultiplyer = this.domTitle.createAppend('<span class = "multiplyer" />');
      this.domButtonToolbar = this.domStackHeader.createAppend('<div class = "buttonToolbar" />');
      this.buttonStackSettings = this.domButtonToolbar.createAppend('<button class = "command settings notext">&nbsp;</button>');
      newClosable(this.domStack, closeStack);
      this.systemSoftware = new SystemSoftware();
      this.physicalMachine = new PhysicalMachine();
      this.vms = [];

      this.domStack.model(this);
      this.domStack.createAppend(this.systemSoftware.toDom());
      this.domStack.createAppend(this.physicalMachine.toDom());
      this.buttonStackSettings.clickCallback(this.showSettings, this);
      this.setMultiplyer(1);
    }

    showSettings() {
      var stackSettings = $('<div />');
      var sliderMultiplyer = $('<div />').slider({
        value: this.multiplyer,
        min: 1,
        max: 500,
        change: (evt, ui) => {
          this.setMultiplyer(ui.value);
        }
      });
      stackSettings.createAppend('<p>Multiplyer:</p>').append(sliderMultiplyer);
      $(stackSettings).dialog({
        modal: true
      });
    }

    setMultiplyer(count) {
      this.multiplyer = count;
      var text = ((count == 1) ? '' : ' <span class = "subtle">x' + count + '</span>');
      this.domMultiplyer.html(text);
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

  return Stack;
});
