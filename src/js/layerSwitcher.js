////////////////////////
// OPACITY SLIDER
////////////////////////

/**
 * Function changing the written value of layer opacity when slider is moving
 */
function changeOpacityValue(elt) {
    var layerId = elt.id.substring(elt.id.indexOf('_')+1);
    document.getElementById('GPopacityValue_'+layerId).innerHTML = elt.value;
}

////////////////////////
// LAYER INFORMATIONS
////////////////////////

function openLayerInfo() {
    
    // Close layer info panel
    if (this.className=='GPlayerInfoOpened') {
        this.className = 'GPlayerInfo';
        document.getElementById('GPlayerInfoPanel').className = 'GPlayerInfoPanelClosed';
        return;
    }
    
    // Open layer info panel
    var layers = document.getElementsByClassName('GPlayerInfoOpened');
    for (var i=0;i<layers.length;i++) {
        layers[i].className = 'GPlayerInfo';
    }
    this.className = 'GPlayerInfoOpened';
    document.getElementById('GPlayerInfoPanel').className = 'GPlayerInfoPanelOpened';
    
}

// Apply informations opening mechanism on layerInfo buttons
var layers = document.getElementsByClassName('GPlayerInfo');
for (var i=0;i<layers.length;i++) {
    layers[i].addEventListener('click',openLayerInfo);
}

// Reset layers info when minimizing the layerSwitcher
document.getElementById('GPshowLayersListPicto').addEventListener('click', function() {
   if (document.getElementById('GPshowLayersList').checked) {
        var layers = document.getElementsByClassName('GPlayerInfoOpened');
        for (var i=0;i<layers.length;i++) {
            layers[i].className = 'GPlayerInfo';
        }
        document.getElementById('GPlayerInfoPanel').className = 'GPlayerInfoPanelClosed';
   }
});

////////////////////////
// LAYERS DRAG AND DROP
////////////////////////

/**
 * drad and drop handler for checking layers informations
 */
var dragAndDropHandler = {
    layersList: [],
    draggedLayer: null,
    draggedLayerHeight: 0,
    indexDraggedLayer: 0
}

/**
 * Function launched when dragging a layer
 */
function handleDragStart(e) {
    
    // Updating dragged layer informations
    var children = document.getElementById('GPlayersList').childNodes;
    dragAndDropHandler.layersList = []
    for (var i=0;i<children.length;i++) {
        if (children[i].nodeType==1) {
            dragAndDropHandler.layersList.push(children[i]);
            children[i].style.top = '0';
        }
    }
    var layerID = e.target.id.substring(e.target.id.indexOf('_')+1);
    var draggedLayer = document.getElementById('GPlayerSwitcher_'+layerID);
    dragAndDropHandler.draggedLayer = draggedLayer;
    dragAndDropHandler.draggedLayerHeight = draggedLayer.clientHeight;
    dragAndDropHandler.indexDraggedLayer = dragAndDropHandler.layersList.indexOf(dragAndDropHandler.draggedLayer);
    
    // Visual effect
    if (e.dataTransfer.addElement) {
        e.dataTransfer.addElement(dragAndDropHandler.draggedLayer);
    }
    
    // Firefox trick
    try {
        e.dataTransfer.setData('text/plain', '');
    } catch(e) {
    }
    
}

/**
 * Function launched when ending the dragging of a layer
 */
function handleDragEnd(e) {
    
    // Cancelling all temporary movements
    for (var i=0;i<dragAndDropHandler.layersList.length;i++) {
        dragAndDropHandler.layersList[i].style.top = '0';
        dragAndDropHandler.layersList[i].style.opacity = '1';
    }
    
    // Reinitialising drag and drop handler
    dragAndDropHandler = {
        layersList: [],
        draggedLayer: null,
        draggedLayerHeight: 0,
        indexDraggedLayer: 0,
    }
    
}

/**
 * Function managing the dragging over the layers list
 */
function handleDragOver(e) {
    
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    // Hiding dragged layer
    dragAndDropHandler.draggedLayer.style.opacity = '0';
    
    // Dragged over layer
    var layerID = e.target.id.substring(e.target.id.indexOf('_')+1);
    var overLayer = document.getElementById('GPlayerSwitcher_'+layerID);
    var indexOverLayer = dragAndDropHandler.layersList.indexOf(overLayer);
    
    // Case 1 : dragged over layer = dragged layer => do nothing
    if (overLayer==dragAndDropHandler.draggedLayer) {
        return false;
    }
    
    // Checking if dragged layer comes from top or bottom
    var overLayerPosition  = overLayer.offsetTop;
    
    // Case 2 : dragged layer coming from top => moving up intermediate layers + moving down dragged layer
    if (indexOverLayer>dragAndDropHandler.indexDraggedLayer) {
        // Moving up intermediate layers
        var posDiff = 0;
        for (var i=dragAndDropHandler.indexDraggedLayer+1;i<=indexOverLayer;i++) {
            var interLayer = dragAndDropHandler.layersList[i];
            interLayer.style.top = (parseInt(interLayer.style.top)-dragAndDropHandler.draggedLayerHeight).toString()+'px';
            dragAndDropHandler.layersList[i-1] = interLayer;
            posDiff += interLayer.clientHeight;
        }
        // Moving down dragged layer
        dragAndDropHandler.draggedLayer.style.top = (parseInt(dragAndDropHandler.draggedLayer.style.top)+posDiff).toString()+'px';
        dragAndDropHandler.indexDraggedLayer = indexOverLayer;
        dragAndDropHandler.layersList[dragAndDropHandler.indexDraggedLayer] = dragAndDropHandler.draggedLayer;
    }
    
    // Case 2 : dragged layer coming from bottom => moving down intermediate layers + moving up dragged layer
    else if (indexOverLayer<dragAndDropHandler.indexDraggedLayer) {
        // Moving down intermediate layers
        var posDiff = 0;
        for (var i=dragAndDropHandler.indexDraggedLayer-1;i>=indexOverLayer;i--) {
            var interLayer = dragAndDropHandler.layersList[i];
            interLayer.style.top = (parseInt(interLayer.style.top)+dragAndDropHandler.draggedLayerHeight).toString()+'px';
            dragAndDropHandler.layersList[i+1] = interLayer;
            posDiff += interLayer.clientHeight;
        }
        // Moving up dragged layer
        dragAndDropHandler.draggedLayer.style.top = (parseInt(dragAndDropHandler.draggedLayer.style.top)-posDiff).toString()+'px';
        dragAndDropHandler.indexDraggedLayer = indexOverLayer;
        dragAndDropHandler.layersList[dragAndDropHandler.indexDraggedLayer] = dragAndDropHandler.draggedLayer;
    }
    
    return false;
    
}

/**
 * Fake dragging over necessary to optimize drop
 */
function handleDragOverFake(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    return false;
}

/**
 * Function launched when dropping a layer over the layers list
 */
function handleDrop(e) {
    
    if (e.preventDefault) {
        e.preventDefault();
    }
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    // Cancelling all temporary movements
    for (var i=0;i<dragAndDropHandler.layersList.length;i++) {
        dragAndDropHandler.layersList[i].style.top = '0';
        dragAndDropHandler.layersList[i].style.opacity = '1';
    }
    
    // Redifining apparent layers order
    for (var i=0;i<dragAndDropHandler.layersList.length;i++) {
        document.getElementById('GPlayersList').removeChild(dragAndDropHandler.layersList[i]);
    }
    for (var i=0;i<dragAndDropHandler.layersList.length;i++) {
        document.getElementById('GPlayersList').appendChild(dragAndDropHandler.layersList[i]);
    }
    
    // TODO : updating API map layers order
    
    // Reinitialising drag and drop handler
    dragAndDropHandler = {
        layersList: [],
        draggedLayer: null,
        draggedLayerHeight: 0,
        indexDraggedLayer: 0
    }
    
    return false;
    
}

// Apply dragging effects on source dragged layers
layers = document.getElementsByClassName('GPlayerBasicTools');
for (var i=0;i<layers.length;i++) {
    layers[i].addEventListener('dragstart',handleDragStart,false);
    layers[i].addEventListener('dragover',handleDragOver,false);
}

// Apply over/droping effects on targets
layers = document.getElementsByClassName('GPlayerSwitcher_layer');
for (var i=0;i<layers.length;i++) {
    layers[i].addEventListener('dragend',handleDragEnd,false);
    layers[i].addEventListener('dragover',handleDragOverFake,false);
    layers[i].addEventListener('drop',handleDrop,false);
}
