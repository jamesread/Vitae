import { Cluster } from '../app/Cluster.js';

/*
$.fn.hasParent = function(search) {
  return $(this).parent(search).notEmpty();
};

$.fn.bounce = function(highlightColor) {
  if (highlightColor == '') {
    highlightColor = 'lightskyblue';
  }

  return $(this).effect('highlight', {color: highlightColor}).dequeue();
};

$.fn.notEmpty = function() {
  return $(this).length > 0;
};

$.fn.isEmpty = function() {
  return $(this).length == 0;
};

$.fn.createAppend = function(i) {
  let ret = $(i); 
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
};

$.fn.clickSearch = function(term) {
  $(this).css('cursor', 'pointer');
  $(this).addClass('clickSearch');
  $(this).click(function(e) {
    e.stopPropagation();
    highlightToolboxMatches(term);
    searchFor(term);
  });
};

$.fn.model = function(newVal) {
  if (typeof(newVal) != 'undefined') {
    $(this).data('model', newVal);
  }

  if (typeof($(this).data('model')) == 'undefined') {
    $(this).data('model', {});
  }

  return $(this).data('model');
};

$.fn.deepClone = function() {
  var copy = $(this).clone();
  copy.model($(this).model());
  copy.attr('style', '');

  return copy;
}; 

$.fn.clickCallback = function(callback, bnd) {
  $(this).click(function(evt) {
    evt.stopPropagation();

    if (bnd != null) {
      callback = callback.bind(bnd);
    }

    callback();
  });
};
*/

Element.prototype.clickSearch = function(term) {
  this.classList.add('clickSearch');
  this.onclick = function(e) {
    e.stopPropagation();
    highlightToolboxMatches(term);
    searchFor(term);
  }
};


Element.prototype.helpTip = function(message) {
  this.classList.add('hasTooltip');
  this.title = message

  return this
};


Element.prototype.model = function(m) {
	this.model = m
}

Element.prototype.disable = function () {
  this.setAttribute('disabled', 'disabled');
};


Element.prototype.clickCallback = function (cb) {
	this.onclick = cb
}

Element.prototype.createAppend = function(s) {
	let p = new DOMParser()
	let e = p.parseFromString(s, "text/xml").firstChild
	this.appendChild(e)

	return this;
}

export function init() {
  window.environment = {
    title: "Untitled Environment",
    clusters: []
  };

  initSearchbar();
  emptyToolbox();

  if (window.location.href.indexOf('debugCss') != -1) {
    $('head').createAppend('<link rel = "stylesheet" href = "resources/stylesheets/debug.css" />');
  }

  var environmentHeader = document.getElementsByClassName('containerHeader')[0];
  environmentHeader.querySelector('h2').title = 'IT Organisations group resources into functional bussiness areas, called environments.';
  var buttonToolbar = environmentHeader.createAppend('<div class = "buttonToolbar" />');

  var buttonToggleControls = buttonToolbar.createAppend('<button id = "buttonToggle" class = "noIcon command">&#10043; Toggle Interface</button>');
  buttonToggleControls.click(function() {
    toggleAllButtons();
  });


  var buttonExport = buttonToolbar.createAppend('<button class = "command save">export</button>');
  buttonExport.click(function() { exportModel(); } );

  var buttonEnvironmentSettings = buttonToolbar.createAppend('<button class = "command settings">settings</button>');
  buttonEnvironmentSettings.clickCallback(openEnvironmentSettings);

  var buttonLoad = buttonToolbar.createAppend('<button class = "command settings">load</button>');
  buttonLoad.click(loadModelDialog);

  var newClusterButton = buttonToolbar.createAppend('<button class = "command add">add cluster</button>');
  newClusterButton.clickCallback(addClusterToEnvironment);

  var calculatePricingButton = buttonToolbar.createAppend('<button class = "command calculate">calculate pricing</button>');
  calculatePricingButton.disable();
  calculatePricingButton.clickCallback(calculatePricing);

  var calculateProblemsButton = buttonToolbar.createAppend('<button class = "command calculate">calculate problems</button>');
  calculateProblemsButton.disable();
  calculateProblemsButton.clickCallback(calculateProblems);

  let modelId = getParameterByName("modelId");

  if (modelId) {
    fetchModel(modelId);
  } else {
    addClusterToEnvironment();
  }
}



// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loadModel(environment) {
  $(environment.clusters).each(function(index, cluster) {
    addClusterToEnvironment(cluster);
  });
}

function fetchModel(id) {
  $.ajax({
    url: 'loadModel.php',
    datatype: "json",
    data: {
      id: id
    },
    success: loadModel
  });
}

function createEnvironmentSettingsDialog() {
  return document.getElementById('environmentSettings')
}

function openEnvironmentSettings() {
  if (typeof(window.dialogEnvironmentSettings) == "undefined") {
    window.dialogEnvironmentSettings = createEnvironmentSettingsDialog();
  }

  window.dialogEnvironmentSettings.showModal()
}

function saveEnvironmentSettings() {
  window.environment.title = $('#editEnvironmentTitle').val();
  $('#environmentTitle').text(window.environment.title)

  console.log(window.environment.title)
}

function loadModelDialog() {
  let savedModels = document.getElementById('loadModelList')

  $(savedModels).createAppend('<button>').text('RHEL on a 8 socket server').click(function() { fetchModel(1) });
  $(savedModels).createAppend('<button>').text('CCSP with RHEL on VMware').click(function() { fetchModel(2) });
  $(savedModels).createAppend('<button>').text('CCSP with RHEL on OpenStack').click(function() { fetchModel(3) });

  let dlg = document.getElementById('loadModels')

	dlg.showModal()
}

function calculateProblems() {
  calculatePricing();
}

function calculatePricing() {
	window.alert("todo")
}

function emptyToolbox() {
  var toolbox = document.getElementById('toolbox');

  toolbox.innerHTML = '';
  toolbox.classList.add('subtle');
  toolbox.append('<p>Nothing in the toolbox. Search for products to add them here.</p>');
}

function createToolboxComponent(item) {
  var component = $('<div class = "component" />');
  component.model(item);   
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

  if ($('#toolbox').find('button').isEmpty()) {
    var clearToolboxButton = $('#toolbox').createAppend('<button class = "command close">&nbsp;</button>');
    clearToolboxButton.click(function() {
      emptyToolbox();
    });
  }
}

function dropApp(container, app, evt) {
  app = app.deepClone();
  app.clickCallback(showHeir);

  if (app.hasClass('containerruntime')) {
    dropContainerRuntime(container, app, evt);
  }

  container.append(app);
}

function getHeir(o) {
  s = "";
  if (o.hasClass('hypervisor')) {
    s = "hypervisor running on a physical machine"; 
  } else if (o.hasClass('os')) {
    s += o.model().title + " (OS) "; 

    if (o.hasParent('.systemSoftware')) {  
      s += "running on a physical machine";  
    } else if (o.hasParent('.vmPool')) {
      s += "running as a virtual machine";
    } else {
      s += ", not sure where it is.";
    }
  } else if (o.hasClass('app')) {
    os = o.parent().parent();
    s = 'app on a ' + getHeir(os);
  } else { 
    s = "not sure what that is.";
  }

  return s;
}

function showHeir(o) {
  showInfobox(getHeir(o), 'lightskyblue');
}

function createAppPool(owner, originalOs) {
  if (originalOs.data('provides') != null && originalOs.data('provides') != '') {
    accept = originalOs.data('provides');
  } else {  
    accept = ".app";
  } 

  var appPool = $('<div class = "appPool container"><h3>' + owner.text() + ' Apps</h3>');
  appPool.droppable({
    accept: accept,
    activeClass: 'draggableActive',
    hoverClass: 'draggableHover',
    greedy: true,
    drop: function(evt, ui) {
      dropApp($(this), ui.draggable);
    }
  });
  appPool.clickSearch('app'); 

  owner.prepend(appPool);

  return appPool;
}

function dropOs(container, originalOs, evt) {
  if (container.hasClass('systemSoftware')) {
    var existingObjects = container.children('.os, .hypervisor');

    if (existingObjects.notEmpty()) {
      existingObjects.bounce('red'); 
      return false;
    }
  }

  os = originalOs.deepClone();
  os.clickCallback(showHeir);

  container.parent('.stackContents').model().addVm(os.model());
  container.append(os);

  appPool = createAppPool(os, originalOs);
}

function dropContainerInstance(container, instance) {
  instance = instance.deepClone();
  instance.clickCallback(showHeir);

  container.append(instance);
}

function dropContainerRuntime (systemSoftware, draggedRuntime, evt) {
  const cri = draggedRuntime.deepClone();

  const containerPool = $('<div class = "container-pool container"><h2>Containers</h2></div>')
  containerPool.model([])
  containerPool.droppable({
    accept: '.container',
    activeClass: 'draggableActive',
    hoverClass: 'draggableHover',
    greedy: true,
    drop: function (evt, ui) {
      dropContainerInstance($(this), ui.draggable);
    }
  })

  containerPool.clickSearch('container')

  systemSoftware.before(containerPool)
  systemSoftware.append(cri)

  return false
}

function dropHypervisor(systemSoftware, originalHypervisor, evt) {
  var existingHypervisors = (systemSoftware.children('.hypervisor'));
  if (existingHypervisors.notEmpty()) {
    existingHypervisors.bounce()
    return false
  }

  hypervisor = originalHypervisor.deepClone();
  hypervisor.clickCallback(showHeir);

  var vmPool = $('<div class = "vmPool container"><h2>VMs</h2></div>');
  vmPool.model([]);
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
  systemSoftware.before(vmPool);
  systemSoftware.parent('.stackContents').model().systemSoftware = hypervisor.model();
  systemSoftware.append(hypervisor); 

  systemSoftware.children('h2').text('Hypervisor').helpTip('A hypervisor is a special type of system software that allows virtual machines.')
  systemSoftware.removeClass('clickSearch').addClass('clickSearchFull');

  if (hypervisor.hasClass('os')) {
    createAppPool(hypervisor, originalHypervisor);
  }

  return false;
}

function searchFor(term) {
  $('#search').focus();
  $('#search').val(term);
}

function highlightToolboxMatches(term) {
  $('#toolbar').each(function(item) {

  }); 
}

function getStacks(cluster) {
  stacks = [];

  cluster.find('.stack').each(function(i, o) {
    stacks.push($(o).model());
  });

  return stacks;
}

function getClusters() {
  clusters = [];

  $('div.cluster').each(function(i, o) {
    clusters.push({
      stacks: getStacks($(o))
    });
  });

  return clusters;
}

function exportModel() {
  window.environment = { clusters: getClusters() }
  console.log(window.environment);
}


function addClusterToEnvironment(modelClusterDef) {
  let cluster = new Cluster();

  if (modelClusterDef != null) {
	cluster.loadClusterModel(modelClusterDef);
  } else {
	cluster.addStack();
  }

  window.environment.clusters.push(cluster);
}

function closeStack(stack) {  
  stack.remove();
} 

function newClosable(owner, closeFunction) {
  closeIcon = $('<button class = "command close notext">&nbsp;</button>');
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

  var toolbars = owner.find('> .containerHeader', owner).find('> .buttonToolbar');
  toolbars.append(closeIcon);
}

function showInfobox(html, color) {
  window.scrollTo(0,0);
  $('#infobox').html(html);
  $('#infobox').bounce(color);
}

function showProductInfo(item) {
  if (typeof(item.description) != "undefined" && item.description != '') {
    item.description = '<span class = "subtle">none</span>';
  }

  showInfobox('<strong>Name:</strong> ' + item.fullTitle + '<br /><strong>Description:</strong> ' + item.description, '#8205FF');
}

function initSearchbar() {
  const searchBox = document.getElementById('search')

  searchBox.onfocus = () => {
    searchBox.value = ''
	searchBox.classList.remove('subtle')
  }

  searchBox.onblur = () => {
	searchBox.value = 'Search... '
	 searchBox.classList.add('subtle')
  } 
  searchBox.blur(); 

	/*
  searchBox.autocomplete({ 
    source: function(req, resp) {
      $.ajax({
        url: '../backend/src/search.php?term=' + req.term,
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
  */
}

function toggleAllButtons() {
  window.buttonsShown = !window.buttonsShown;
  newState = window.buttonsShown ? 'inline-block' : 'none';

  $('button').not('#buttonToggle').css('display', newState);

  $('.header').toggle();
}

window.buttonsShown = true;

function decreaseBorder() {
  changeBorderWidth(-1);
}

function increaseBorder() {
  changeBorderWidth(+1);
}

function changeBorderWidth(delta) {
  window.borderWidth += delta;

  console.log(window.borderWidth);

  $('.container').css('border-width', window.borderWidth);
  $('.app').css('border-width', window.borderWidth);
  $('.hypervisor').css('border-width', window.borderWidth);

}

window.borderWidth = 1;

/*
jQuery(document).bind('keypress', 'h', toggleAllButtons);
jQuery(document).bind('keypress', '-', decreaseBorder);
jQuery(document).bind('keypress', '=', increaseBorder);
*/
