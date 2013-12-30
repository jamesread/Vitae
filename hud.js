function init() {
	initSearchbar();

	var newClusterButton = $('.environment h2').createAppend('<button>new cluster</button>');
	newClusterButton.click(function(evt) {
		addClusterToEnvironment();
	});

	addClusterToEnvironment();
}


function dropApp(container, app, evt) {
	app = app.clone()
	app.attr('style', '');

	container.append(app);
}

function showHeir(o) {
	console.log(o.item)
	s = ""
	if (o.hasClass('os')) {
		s += o.item.name + "(OS) "

		if (o.hasParent('.systemSoftware')) {
			s += "running on a physical machine"
		} else if (o.hasParent('.vmPool')) {
			s += "running as a virtual machine"
		}
	} else {
	}

	showInfobox(s)
}

function dropOs(container, originalOs, evt) {
	if (container.hasClass('systemSoftware')) {
		var existingObjects = container.children('.os, .hypervisor');

		if (existingObjects.notEmpty()) {
			existingObjects.bounce();
			return false;
		}
	}

	console.log(container.item, originalOs.item);

	os = originalOs.clone();
	os.item = originalOs.item;
	console.log("i", originalOs.item)
	os.attr('style', '');
	os.click(function() { console.log("click"); showHeir(os)} )

	container.append(os)

	if (os.attr('data-provides') != '') {
		accept = os.attr('data-provides')
	} else {
		accept = ".app"
	}

	var appPool = $('<div class = "appPool container"><h3>' + os.text() + ' Apps</h3>');
	console.log("acc:", accept);
	appPool.droppable({
		accept: accept,
		activeClass: 'draggableActive',
		hoverClass: 'draggableHover',
		greedy: true,
		drop: function(evt, ui) {
			dropApp($(this), ui.draggable);
		}
	})

	if (os.parent().hasClass('vmPool')) {
		os.append(appPool);
	} else {
		container.siblings('h2').after(appPool);
	}
}

function dropHypervisor(systemSoftware, hypervisor, evt) {
	var existingHypervisors = (systemSoftware.children('.hypervisor'));
	if (existingHypervisors.notEmpty()) {
		existingHypervisors.bounce();
		return false;
	}

	hypervisor = hypervisor.clone();
	hypervisor.attr('style', '')
	
	systemSoftware.append(hypervisor);

	var vmPool = $('<div class = "vmPool container"><h2>VMs</h2></div>');
	vmPool.droppable({
		accept: '.os',
		hoverClass: 'draggableHover',
		greedy: true,
		drop: function(evt, ui) {
			dropOs($(this), ui.draggable)
		}
	});
	systemSoftware.siblings('h2').after(vmPool);

	return false;
}

$.fn.hasParent = function(search) {
	return $(this).parent(search).notEmpty();
}

$.fn.bounce = function() {
	return $(this).effect('bounce');
}

$.fn.notEmpty = function() {
	return $(this).size() > 0;
}

$.fn.createAppend = function(i) {
	ret = $(i); 
	$(this).append(ret); 
	return ret;
}

$.fn.createPrepend = function(i) {
	ret = $(i);
	$(this).prepend(ret);
	return ret;
}

function addClusterToEnvironment() {
	var cluster = $('<div class = "container cluster" />');
	var title = cluster.createAppend('<h2>Cluster</h2>')

	newClosable(cluster, closeStack);

	var newStackButton = title.createAppend('<button>new stack</button>')
	newStackButton.click(function(evt) {
		addStackToCluster(cluster)
	});

	addStackToCluster(cluster)

	$('.environment').append(cluster);
}

function closeStack(stack) {
	stack.remove();
}

function newClosable(owner, closeFunction) {
	closeIcon = $('<img src = "icons/close.png" class = "close icon" />')
	closeIcon.click(function() {
		closeFunction(owner);
	});

	owner.children('h2').append(closeIcon);
}

function addStackToCluster(cluster) {
	var stack = cluster.createAppend('<div class = "container stack"><h2>Stack</h2></div>')

	newClosable(stack, closeStack);

	var systemSoftware = stack.createAppend('<div class = "container systemSoftware"><h2>System software</h2></div>')
	systemSoftware.droppable({
		accept: '.os, .hypervisor',
		hoverClass: 'draggableHover',
		drop: function(evt, ui) {
			if (ui.draggable.hasClass('os')) {
				return dropOs($(this), ui.draggable, evt);
			} else if (ui.draggable.hasClass('hypervisor')) {
				return dropHypervisor($(this), ui.draggable, evt);
			}
		}
	});

	var physicalMachine = stack.createAppend('<div class = "container physicalMachine"><h2>Physical Machine</h2></div>')
	var processorArchitecture = physicalMachine.createAppend('<p class = "processorArchitecture">? sockets</p>')
}

function showInfobox(html) {
	$('#infobox').html(html);
}

function showProductInfo(item) {
	showInfobox('<strong>Name:</strong> ' + item.name + '<br /><strong>Description:</strong> ' + item.description)
}

function createComponent(item) {
	var component = $('<div class = "component" />')
	component.item = item;
	console.log(component);
	component.text(item.name);
	component.click(function() { showProductInfo(item) });
	component.draggable({ revert: "invalid", cursor: "move", helper: "clone" })

	var icon = component.createPrepend('<img class = "icon" />');
	icon.attr('src', 'icons/' + item.icon);

	$(item.fitsInto).each(function(index, item) {
		component.addClass(item);
	});

	if (typeof(item.provides) != "undefined") {
		component.attr('data-provides', item.provides.join(', '))
	}

	$('#toolbox').append(component);
}

function initSearchbar() {
	$('#search').remove().autocomplete({
		source: function(req, resp) {
			$.ajax({
				url: 'search.php',
				datatype: "json",
				data: {
					maxRows: 12,
					query: $(req.target).val()
				},
				success: function(data) {
					resp($.map(data, function(item) {
						return {
							label: item.name,
							object: item
						}
					}));
				}
			});
		},
		minLength: 2,
		select: function(evt, ui) {
			createComponent(ui.item.object)
		},
	});
}
