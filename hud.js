$.fn.hasParent = function(search) {
	return $(this).parent(search).notEmpty();
};

$.fn.bounce = function() {
	return $(this).effect('highlight').effect('bounce').dequeue();
};

$.fn.notEmpty = function() {
	return $(this).size() > 0;
};

$.fn.createAppend = function(i) {
	ret = $(i); 
	$(this).append(ret); 
	return ret;
};

$.fn.createPrepend = function(i) {
	ret = $(i);
	$(this).prepend(ret);
	return ret;
};

$.fn.createAfter = function(i) {
	ret = $(i);
	$(this).after(ret);
	return ret;
}

$.fn.clickSearch = function(term) {
	$(this).css('cursor', 'pointer');
	$(this).addClass('clickSearch');
	$(this).click(function() {
		highlightToolboxMatches(term);
		searchFor(term);
	});
};

$.fn.helpTip = function(message) {
	$(this).css('cursor', 'help');
	$(this).addClass('hasTooltip');
	$(this).click(function() { 
		showInfobox(message);
	});

	return $(this);
}

$.fn.disable = function () {
	$(this).attr('disabled', 'disabled');
}

function init() {
	initSearchbar();
	emptyToolbox();

	if (window.location.href.indexOf('debugCss') != -1) {
		$('head').createAppend('<link rel = "stylesheet" href = "resources/stylesheets/debug.css" />');
	}

	var environmentHeader = $('.environment .containerHeader');
	environmentHeader.find('h2').helpTip('IT Organisations group resources into functional bussiness areas, called environments.');
	var buttonToolbar = environmentHeader.createAppend('<div class = "buttonToolbar" />');

	var newClusterButton = buttonToolbar.createAppend('<button class = "command add">add cluster</button>');
	newClusterButton.click(function(evt) {
		addClusterToEnvironment();
		evt.stopPropagation();
	});

	var calculatePricingButton = buttonToolbar.createAppend('<button class = "command calculate">calculate pricing</button>');
	calculatePricingButton.disable();
	calculatePricingButton.click(function(evt) { 
		calculatePricing();
		evt.stopPropagation();
	});

	var calculateProblemsButton = buttonToolbar.createAppend('<button class = "command calculate">calculate problems</button>');
	calculateProblemsButton.disable();
	calculateProblemsButton.click(function(evt) {
		calculateProblems();
		evt.stopPropagation();
	});


	addClusterToEnvironment();
}

function calculateProblems() {
	calculatePricing();
}

function calculatePricing() {
	$('<p>TODO: Code this feature ;)</p>').dialog({
		modal: true	
	});
}

function emptyToolbox() {
	var toolbox = $('#toolbox');

	toolbox.empty();
	toolbox.addClass('subtle');
	toolbox.append('<p>Nothing in the toolbox. Search for products to add them here.</p>');
}

function createToolboxComponent(item) {
	var component = $('<div class = "component" />');
	component.data("item", item);   
	component.text(item.title);
	component.click(function() { showProductInfo(item); });
	component.draggable({ revert: "invalid", cursor: "move", helper: "clone" });
 
	var icon = component.createPrepend('<img class = "icon" />');
	icon.attr('src', 'resources/images/icons/' + item.icon);
	
	$(item.types != null && item.types.split(",")).each(function(index, item) {
		component.addClass(item);
	});  

	if (typeof(item.provides) != "undefined" && item.provides != null) {
		provides = item.provides.split(',').map(function(item) {
			return "." + item; 
		}); 
		
		component.data('provides', provides.join(", "));
	}  

	$('#toolbox').removeClass('subtle');
	$('#toolbox').find('p').remove(); // "nothing in toolbox"
	$('#toolbox').append(component).effect('highlight');

	if ($('#toolbox').find('button').size() == 0) {
		var clearToolboxButton = $('#toolbox').createAppend('<button class = "command close">&nbsp;</button>');
		clearToolboxButton.click(function() {
			emptyToolbox();
		});
	}
}

function dropOs(container, originalOs, evt) {
	if (container.hasClass('systemSoftware')) {
		var existingObjects = container.children('.os, .hypervisor');

		if (existingObjects.notEmpty()) {
			existingObjects.bounce(); 
			return false;
		}
	}
 
	os = originalOs.clone();
	os.data('item', originalOs.data('item'));  
	os.attr('style', '');
	os.click(function(e) { showHeir(originalOs); e.stopPropagation(); } );
 
	container.append(os);

	if (originalOs.data('provides') != '') {
		accept = originalOs.data('provides');
	} else {  
		accept = ".app";
	} 
	
	var appPool = $('<div class = "appPool container"><h3>' + os.text() + ' Apps</h3>');
	appPool.droppable({
		accept: accept,
		activeClass: 'draggableActive',
		hoverClass: 'draggableHover',
		greedy: true,
		drop: function(evt, ui) {
			dropApp($(this), ui.draggable);
		}
	}); 

	os.prepend(appPool);

	console.log("the container", container, "has an os", os, "which provides a app pool", appPool, "that accepts", originalOs.data('provides'));  
}

function dropApp(container, app, evt) {
	app = app.clone();
	app.attr('style', '');

	container.append(app);
}

function showHeir(o) {
	o.item = o.data('item'); 
	s = "";
	if (o.hasClass('hypervisor')) {
		s = "hypervisor running on a physical machine"; 
	} else if (o.hasClass('os')) {
		s += o.item.title + " (OS) "; 

		if (o.hasParent('.systemSoftware')) {  
			s += "running on a physical machine";  
		} else if (o.hasParent('.vmPool')) {
			s += "running as a virtual machine";
		} else {
			s += ", not sure where it is.";
		}
	} else { 
		s = "not sure what that is.";
	}
	
	showInfobox(s);
}

function dropHypervisor(systemSoftware, hypervisor, evt) {
	var existingHypervisors = (systemSoftware.children('.hypervisor'));
	if (existingHypervisors.notEmpty()) {
		existingHypervisors.bounce();
		return false;
	}
  
	hypervisor = hypervisor.clone();    
	hypervisor.attr('style', '');
	hypervisor.click(function(e) { showHeir(hypervisor); e.stopPropagation(); } );
	
	systemSoftware.append(hypervisor); 

	var vmPool = $('<div class = "vmPool container"><h2>VMs</h2></div>');
	vmPool.droppable({
		accept: '.os', 
		activeClass: 'draggableActive',
		hoverClass: 'draggableHover',
		greedy: true,
		drop: function(evt, ui) {
			dropOs($(this), ui.draggable);
		}
	});
	vmPool.clickSearch("os");
	systemSoftware.siblings('h2').after(vmPool);

	return false;
}

function searchFor(term) {
	$('#search').focus();
	$('#search').val(term);
	$('#search').data('uiAutocomplete').search(term);
}

function highlightToolboxMatches(term) {
	$('#toolbar').each(function(item) {
		
	}); 
}

function addClusterToEnvironment() {
	var cluster = $('<div class = "container cluster" />');
	var containerHeader = cluster.createAppend('<div class = "containerHeader" />');
	var title = containerHeader.createAppend('<h2>Cluster</h2>').helpTip('A cluster is a group of machines that work together to achieve the same task.');
	var buttonToolbar = containerHeader.createAppend('<div class = "buttonToolbar" />');

	newClosable(cluster, closeStack);

	var newStackButton = buttonToolbar.createAppend('<button class = "command add">add stack</button>');
	newStackButton.click(function(evt) {
		addStackToCluster(cluster);
		evt.stopPropagation();
	});

	addStackToCluster(cluster);

	$('.environment').append(cluster);
}

function closeStack(stack) {  
	stack.remove();
}

function newClosable(owner, closeFunction) {
	closeIcon = $('<button class = "command close">&nbsp;</button>');
	closeIcon.click(function() {
		closeFunction(owner);
	});

	closeIcon.hover(
		function() {
			owner.addClass('close');
		},
		function() {
			owner.removeClass('close');
		}
	);
	owner.children('.containerHeader').children('.buttonToolbar').append(closeIcon);
}

function addStackToCluster(cluster) {
	var stack = cluster.createAppend('<div class = "container stack" />');
	var stackHeader = stack.createAppend('<div class = "containerHeader" />');
	var title = stackHeader.createAppend('<h2>Stack</h2>').helpTip('A stack is a collection of hardware and software that works together.');
	var buttonToolbar = stackHeader.createAppend('<div class = "buttonToolbar" />');

	newClosable(stack, closeStack);

	var systemSoftware = stack.createAppend('<div class = "container systemSoftware"><h2>System software</h2></div>');
	systemSoftware.droppable({
		accept: '.os, .hypervisor',
		activeClass: 'draggableActive',
		hoverClass: 'draggableHover',
		drop: function(evt, ui) {
			if (ui.draggable.hasClass('os')) {
				return dropOs($(this), ui.draggable, evt);
			} else if (ui.draggable.hasClass('hypervisor')) {
				return dropHypervisor($(this), ui.draggable, evt);
			}
		}
	});
	systemSoftware.clickSearch('system');

	var physicalMachine = stack.createAppend('<div class = "container physicalMachine"><h2>Physical Machine</h2></div>');
	physicalMachine.createAppend('<p class = "processorArchitecture">? sockets</p>');
}  

function showInfobox(html) {
	window.scrollTo(0,0);
	$('#infobox').html(html);
	$('#infobox').bounce();
}

function showProductInfo(item) {
	if (typeof(item.description) != "undefined" && item.description != '') {
		item.description = '<span class = "subtle">none</span>';
	}
	
	showInfobox('<strong>Name:</strong> ' + item.fullTitle + '<br /><strong>Description:</strong> ' + item.description);
}

function initSearchbar() {
	var searchBox = $('#search');
	focusCallback = function() {
		$('#search').val('');
		$('#search').removeClass('subtle');  
	};
	searchBox.focus(focusCallback);

	blurCallback = function() {
		$('#search').val('Search... ');
		$('#search').addClass('subtle');  
	}; 
	searchBox.focusout(blurCallback);
	searchBox.blur();
	 
	searchBox.autocomplete({
		source: function(req, resp) {
			$.ajax({
				url: 'search.php?term=' + req.term,
				datatype: "json",
				data: {
					maxRows: 12,
					query: $(req.target).val()
				},
				success: function(data) {
					resp($.map(data, function(item) {
						return {
							label: item.title,
							object: item
						};
					}));
				}
			});
		},
		minLength: 2,
		select: function(evt, ui) {
			createToolboxComponent(ui.item.object); 
		},
		close: function(){ $(this).blur(); $(this).focus(); }
	}).data("uiAutocomplete")._renderItem = function(ul, item) {
		item = item.object;
		return $('<li class = "ui-menu-item" />')
		.data("item.autocomplete", item)
		.append('<a><img src = "resources/images/icons/' + item.icon + '" /> ' + item.fullTitle + '</li></a>')
		.appendTo(ul);
	};
}
