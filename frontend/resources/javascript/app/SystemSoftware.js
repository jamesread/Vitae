function SystemSoftware() {
    var self = this;
    this.os = null;
    this.domSystemSoftware = $('<div class = "container systemSoftware"><h2>System software</h2></div>');
    this.domSystemSoftware.model(this);
    this.domSystemSoftware.droppable({
        accept: '.os, .hypervisor',
        activeClass: 'draggableActive',
        hoverClass: 'draggableHover',
        drop: function (evt, ui) {
            this.os = ui.draggable;
            if (ui.draggable.hasClass('hypervisor')) {
                return dropHypervisor($(this), ui.draggable, evt);
            }
            else if (ui.draggable.hasClass('os')) {
                return dropOs($(this), ui.draggable, evt);
            }
        }
    });
    SystemSoftware.prototype.loadSsModel = function (mdl) {
        self.os = mdl.fullTitle;
        if (mdl.type == "os") {
            self.loadOs(mdl);
        }
        if (mdl.type == "hypervisor") {
            self.loadHypervisor(mdl);
        }
    };
    SystemSoftware.prototype.loadOs = function (mdl) {
    };
    SystemSoftware.prototype.loadHypervisor = function () {
    };
    SystemSoftware.prototype.toDom = function () {
        return self.domSystemSoftware;
    };
    this.domSystemSoftware.clickSearch('system');
}
