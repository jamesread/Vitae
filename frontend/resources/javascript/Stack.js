define(function() {
	require(["SystemSoftware", "PhysicalMachine"], 
	function(SystemSoftware, PhysicalMachine) {
	function Stack(def) {
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
		
		var self = this;

		Stack.prototype.showSettings = function() {
			var stackSettings = $('<div />');

			var sliderMultiplyer = $('<div />').slider({
				value: self.multiplyer,
				min: 1,
				max: 500,
				change: function(evt, ui) { self.setMultiplyer(ui.value); }
			});

			stackSettings.createAppend('<p>Multiplyer:</p>').append(sliderMultiplyer);
			
			$(stackSettings).dialog({
				modal: true	
			});
		}

		Stack.prototype.setMultiplyer = function(count) {
			this.multiplyer = count;

			text = (count == 1) ? '' : ' <span class = "subtle">x' + count + '</span>';

			this.domMultiplyer.html(text);
		}

		Stack.prototype.toDom = function() {
			return self.domStack;
		}

		Stack.prototype.addVm = function(vm) {
			self.vms.push(vm);
		}

		Stack.prototype.loadStackModel = function(mdl) {
			console.log("load stack", mdl);

			this.physicalMachine.setSockets(mdl.physicalMachine.sockets);
			this.systemSoftware.loadSsModel(mdl.systemSoftware)
		}
		  
		this.domStack.model(this);	
		this.domStack.createAppend(this.systemSoftware.toDom());
		this.domStack.createAppend(this.physicalMachine.toDom());   
		
		this.buttonStackSettings.clickCallback(this.showSettings);
		this.setMultiplyer(1);
	}  
	});

	return Stack;
});
