define(function() {
	function Cluster() {
		var self = this;
		this.stacks = [];

		this.domCluster = $('<div class = "container cluster" />');
		this.domCluster.model(this);

		this.containerHeader = this.domCluster.createAppend('<div class = "containerHeader" />');
		this.title = this.containerHeader.createAppend('<h2>Cluster</h2>').helpTip('A cluster is a group of machines that work together to achieve the same task.');
		this.buttonToolbar = this.containerHeader.createAppend('<div class = "buttonToolbar" />');

		this.buttonClusterSettings = this.buttonToolbar.createAppend('<button class = "command settings">settings</button>');
		this.buttonClusterSettings.click(function() { showClusterSettings(this); });

		this.newStackButton = this.buttonToolbar.createAppend('<button class = "command add">add stack</button>');
		this.newStackButton.click(function(evt) {
			cluster.addStack();
			evt.stopPropagation();
		});

		Cluster.prototype.closeCluster = function() {
			self.domCluster.remove();
		};

		Cluster.prototype.loadClusterModel = function(model) {
			console.log("cluster load model", model);
			$(model.stacks).each(function(i, stackDef) {
				stack = self.addStack();
				stack.loadStackModel(stackDef);
			});
		};

		Cluster.prototype.addStack = function addStack(stackDef) {
			return requirejs(["Stack"], 
			function(Stack) {
				stack = new Stack();

				if (typeof(stackDef) != 'undefined') {
					stack.loadStackModel(stackDef);
				}

				self.stacks.push(stack);

				this.domCluster.append(stack.toDom());

				return stack;
			});
		};

		newClosable(this.domCluster, this.closeCluster);

		$('.environment').append(this.domCluster);
	}

	return Cluster;
});
