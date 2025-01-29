define(function() {

  class SystemSoftware {
    constructor() {
      this.os = null;
      this.domSystemSoftware = $('<div class = "container systemSoftware"><h2>OS</h2></div>');
      this.domSystemSoftware.model(this);
      this.domSystemSoftware.droppable({
        accept: '.os, .hypervisor',
        activeClass: 'draggableActive',
        hoverClass: 'draggableHover',
        drop: function (evt, ui) {
          this.os = ui.draggable

          if (ui.draggable.hasClass('containerruntime')) {
            return dropContainerRuntime($(this), ui.draggable, evt);
          }

          if (ui.draggable.hasClass('hypervisor')) {
            return dropHypervisor($(this), ui.draggable, evt);
          } else if (ui.draggable.hasClass('os')) {
            return dropOs($(this), ui.draggable, evt);
          }
        }
      });

      this.domSystemSoftware.clickSearch('system');
    }

    loadSsModel(mdl) {
      this.os = mdl.fullTitle;

      if (mdl.type == "os") {
        this.loadOs(mdl);
      }
      if (mdl.type == "hypervisor") {
        this.loadHypervisor(mdl);
      }
    };

    loadOs(mdl) {
      console.log("load OS");
    }

    loadHypervisor() {
    }

    toDom() {
      return this.domSystemSoftware;
    }
  }

  return SystemSoftware;
});
