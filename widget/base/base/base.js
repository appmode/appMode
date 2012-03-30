//----------------------------------------------------------------------------//
// appMode
//----------------------------------------------------------------------------//
/*
 * appMode (c) Copyright 2012 APPMO LTD
 * 
 * author    : Flame Herbohn
 * download  : http://code.google.com/p/appmode/
 * license   : GNU Affero General Public License version 3
 */


//----------------------------------------------------------------------------//
// PUBLIC Base Widget Methods
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// property
//----------------------------------------------------------------------------//
/**
 * property()
 *
 * see full documentation at http://appmo.de/docs
 *
 * @param  string  Name       
 * @param  mixed   Value      
 *
 */
this.property = function($strName, $mixValue)
{
	if (arguments.length == 2)
	{
		return this._setProperty($strName, $mixValue);
	}
	else if (arguments.length == 1)
	{
		return this._getProperty($strName);
	}
	else if (arguments.length == 0)
	{
		return this._objProperty;
	}
	return false;
}

//----------------------------------------------------------------------------//
// getElement
//----------------------------------------------------------------------------//
/**
 * getElement()
 *
 * see full documentation at http://appmo.de/docs
 *
 * @param  string  Target     
 *
 */
this.getElement = function($strTarget)
{
	return this._getElement($strTarget);
}

//----------------------------------------------------------------------------//
// addClass
//----------------------------------------------------------------------------//
/**
 * addClass()
 *
 * see full documentation at http://appmo.de/docs
 *
 * @param  string  Class      
 *
 */
this.addClass = function($strClass)
{
	return this._elementAddClass(this.getElement(), $strClass);
}

//----------------------------------------------------------------------------//
// hasClass
//----------------------------------------------------------------------------//
/**
 * hasClass()
 *
 * see full documentation at http://appmo.de/docs
 *
 * @param  string  Class      
 *
 */
this.hasClass = function($strClass)
{
	return this._elementhasClass(this.getElement(), $strClass);
}

//----------------------------------------------------------------------------//
// removeClass
//----------------------------------------------------------------------------//
/**
 * removeClass()
 *
 * see full documentation at http://appmo.de/docs
 *
 * @param  string  Class      
 *
 */
this.removeClass = function($strClass)
{
	return this._elementRemoveClass(this.getElement(), $strClass);
}

//----------------------------------------------------------------------------//
// appendChild
//----------------------------------------------------------------------------//
/**
 * appendChild()
 *
 * see full documentation at http://appmo.de/docs
 *
 * @param  widget  Child      
 * @param  element  Child      
 *
 */
this.appendChild = function($wgtChild, $elmChild)
{
	// set parent view in child widgets
	if ($wgtChild === false && $elmChild === false)
	{
		if (this.childWidgets)
		{
			var i;
			for (i in this.childWidgets)
			{
				this.childWidgets[i].parentView = this.parentView;
				this.childWidgets[i].appendChild(false, false);
			}
		}
		return;
	}
	
	// add to DOM
	if ($elmChild !== false)
	{
		$elmChild = $elmChild || $wgtChild.getElement();
		this.getElement('Content').appendChild($elmChild);
	}
	
	// add widget
	if ($wgtChild)
	{
		if (!($wgtChild.name in this))
		{
			this[$wgtChild.name]			= $wgtChild;
		}
		this.childWidgets 					= this.childWidgets || {};
		this.childWidgets[$wgtChild.name]	= $wgtChild;
		$wgtChild.parentWidget				= this;
		$wgtChild.parentView				= this.parentView || this;
		
		// set parentView on grandchild widgets
		$wgtChild.appendChild(false, false);
	}
	
	return $wgtChild;
}

//----------------------------------------------------------------------------//
// removeChild
//----------------------------------------------------------------------------//
/**
 * removeChild()
 *
 * see full documentation at http://appmo.de/docs
 *
 * @param  widget  Child      
 * @param  bool    RemoveDom  
 *
 */
this.removeChild = function($wgtChild, $bolRemoveDom)
{
	// remove parentView/remove form ui for child widgets
	if ($wgtChild === false && $bolRemoveDom === false)
	{
		if (this.childWidgets)
		{
			var i;
			for (i in this.childWidgets)
			{
				// remove parentView
				delete(this.childWidgets[i].parentView);
				
				// remove from ui
				delete(this.w3.ui.widgets[this.childWidgets[i].id]);
				
				// do the same for the children
				this.childWidgets[i].removeChild(false, false);
			}
		}
		return;
	}
	// check if it's ok for us to remove this widget
	if ($wgtChild.id == this.id && this.w3.ui.views[this.name] && this.w3.ui.views[this.name].id == this.id)
	{
		// this is a view removing itself
		delete(this.w3.ui.views[$wgtChild.name]);
	}
	else if (!this.childWidgets || !($wgtChild.name in this.childWidgets))
	{
		// not our child
		return false;
	}
	
	// remove from DOM
	if ($bolRemoveDom !== false)
	{
		var $elmTarget = $wgtChild.getElement();
		if ($elmTarget)
		{
			$elmTarget.parentNode.removeChild($elmTarget);
		}
	}
	
	// remove from ui
	delete(this.w3.ui.widgets[$wgtChild.id]);
	
	// remove widget
	delete($wgtChild.parentWidget);
	delete($wgtChild.parentView);
	delete(this.childWidgets[$wgtChild.name]);
	if (typeof(this[$wgtChild.name]) == 'object' && this[$wgtChild.name].id == $wgtChild.id)
	{
		delete (this[$wgtChild.name]);
	}
	
	// remove parentView/remove form ui for grandchild widgets
	$wgtChild.removeChild(false, false);
	
	return $wgtChild;
}

//----------------------------------------------------------------------------//
// trigger
//----------------------------------------------------------------------------//
/**
 * trigger()
 *
 * see full documentation at http://appmo.de/docs
 *
 * @param  string  Event      
 * @param  object  Event      
 *
 */
this.trigger = function($strEvent, $objEvent)
{
	// real event (params are reversed)
	if (typeof($strEvent) != 'string')
	{	
		// normalize the event object
		$objEvent = this.w3.event.normalize($strEvent, $objEvent, this);
		
		// fix event type
		$strEvent = 'on' + $objEvent.type;
	}
	// triggered event
	else
	{
		// normalize the event object
		$objEvent = this.w3.event.normalize($objEvent, $strEvent, this);
		
		// fix event type
		if (!$strEvent.startsWith('on'))
		{
			$strEvent = 'on' + $strEvent;
		}
	}
	
	// kill bubbles
//TODO!!!! review this property
	if (!this._objProperty._allowBubbles)
	{
		$objEvent.stopPropagation();
	}
	
	// don't run events on disabled widgets
	if (this._objProperty.disabled === true)
	{
		return false;
	}

	// check if this event even belongs to us
	if (!$objEvent.target.targetNode || $objEvent.target.targetNode.targetId != this.id)
	{
		return;
	}
	
	// run the event handler
	return this._eventHandler($objEvent, $strEvent);
}

//----------------------------------------------------------------------------//
// PRIVATE Base Widget Methods
//----------------------------------------------------------------------------//

//[**] get value
this._getPropertyValue = function($elmTarget)
{
	// get the node value
	var $elmTemp = this._getElement('_Input') || this._getElement('_Value') || $elmTarget;
	if ($elmTemp)
	{
		switch ($elmTemp.tagName.toLowerCase())
		{
			case 'div':
			case 'span':
				this._objProperty.value = $elmTemp.innerHTML;
				break;
			case 'input':
				switch ($elmTemp.type)
				{
					case 'checkbox':
						if ($elmTemp.checked)
						{
							this._objProperty.value = true;
						}
						else
						{
							this._objProperty.value = false;
						}
						break;
					default:
						this._objProperty.value = $elmTemp.value;
						break;
				}
				break;
			case 'textarea':
				this._objProperty.value = $elmTemp.value;
				break;
			case 'image':
			case 'iframe':
				this._objProperty.value = $elmTemp.src;
				break;
		}
	}
	return this._objProperty.value;
}

this._getProperty = function($strName)
{
	// look for a property specific method
	var $strMethod = "_getProperty" + $strName.ucFirst();
	if ($strMethod in this)
	{
		return this[$strMethod]();
	}
	return this._objProperty[$strName];
}

//[**] set property
this._setProperty = function($strName, $mixValue)
{
	// look for a property specific method
	var $strMethod = "_setProperty" + $strName.ucFirst();
	if ($strMethod in this)
	{
		return this[$strMethod]($mixValue);
	}
		
	if (this._objProperty[$strName] !== $mixValue)
	{	
		// set widget property
		this._objProperty[$strName] = $mixValue;
		
		// set node property
		return this._setNodeProperty($strName, $mixValue);
	}
	return false;
}

this._setNodeProperty = function($strName, $mixValue)
{
	// set node property
	switch ($strName)
	{
		case 'className':
			this._getElement().className = $mixValue;
			break;
		case 'label':
		case 'title':
		case 'caption':
		case 'value':
			var $elmTemp = this._getElement('_' + $strName.charAt(0).toUpperCase() + $strName.substring(1));
			if ($elmTemp)
			{				
				switch ($elmTemp.tagName.toLowerCase())
				{
					case 'input':
						switch ($elmTemp.type)
						{
							case 'checkbox':
								if ($mixValue)
								{
									$elmTemp.checked = 'checked';
								}
								else
								{
									$elmTemp.checked = false;
								}
								break;
							default:
								$elmTemp.value = $mixValue;
								break;
						}
						break;
					case 'textarea':
						$elmTemp.value = $mixValue;
						break;
					case 'image':
					case 'iframe':
						$elmTemp.src = $mixValue;
						break;
					case 'div':
					case 'span':
					default:
//TODO!!!! use _setNodeText()?
						$elmTemp.innerHTML = $mixValue;
						break;
				}
			}
			break;
		case 'tooltip':
			this._getElement().title = $mixValue;
			break;		
	}
	return this._objProperty[$strName];
}

this._setPropertyDisabled = function($boolValue)
{
	if ($boolValue)
	{
		var $objNode = this._getElement('_Disabled');
		if ($objNode)
		{
			$objNode.style.visibility 	= 'inherit';
		}
		this._objProperty.disabled 	= true;
	}
	else
	{
		var $objNode = this._getElement('_Disabled');
		if ($objNode)
		{
			$objNode.style.visibility 	= 'hidden';
		}
		this._objProperty.disabled 	= false;
	}
	return this._objProperty.disabled;
}

// ---------------------------------------------------------------//
// PRIVATE METHODS
// ---------------------------------------------------------------//

this._setNodeText = function($elmNode, $strValue)
{
    if($elmNode.innerText)
    {
        $elmNode.innerText = $strValue;
    }
    else
    {
        $elmNode.textContent = $strValue;
    }
}

//[**] find the coresponding dom element (node) for a widget
// also caches the element by attaching it to the widget 
this._getElement = function($strName)
{
	if (!$strName)
	{
		// get base element
		if (!this._elmWidget)
		{
			this._elmWidget = document.getElementById(this.id);
		}
		return this._elmWidget;
	}
	else
	{
		// fix internal element name
		if ($strName.charAt(0) != "_")
		{
			$strName = "_" + $strName;
		}
		
		// get internal element
		if (!this._objElement)
		{
			this._objElement = {};
		}
		if (!this._objElement[$strName])
		{
			this._objElement[$strName] = document.getElementById(this.id + $strName);
		}
		return this._objElement[$strName];
	}
}

this._removeElement = function($strName)
{
	this._clearElement($strName, true);
}

this._clearElement = function($strName, $bolDelete)
{
	// clear base element
	if (!$strName)
	{
		if ($bolDelete)
		{
			this._getElement().parentNode.removeChild(this._elmWidget);
		}
		if (this._elmWidget)
		{
			delete(this._elmWidget);
		}
		return;
	}
	
	// clear an element passed to us
	if (typeof($strName) == 'object')
	{
		var $elmTarget = $strName;
		if ($elmTarget.id && this._objElement)
		{
			if ($elmTarget.id.startsWith(this.id + '_'))
			{
				$strName = $elmTarget.id.slice(this.id.length);
				if (this._objElement[$strName])
				{
					delete(this._objElement[$strName]);
				}
			}
		}
		if ($bolDelete)
		{
			$elmTarget.parentNode.removeChild($elmTarget);
		}
		return;
	}
	
	switch ($strName)
	{
		case '*':
			// clear all elements
			this._clearElement(false, $bolDelete);
			this._clearElement('#');
			break;
		case '#':
			// clear all internal elements
			if (this._objElement)
			{
				delete(this._objElement);
			}
			this._objElement = {};
			break;
		default:
			// fix internal element name
			if ($strName.startsWith(this.id + '_'))
			{
				$strName = $strName.slice(this.id.length);
			}
			if ($strName.charAt(0) != "_")
			{
				$strName = "_" + $strName;
			}
			// clear a single internal element
			if ($bolDelete)
			{
				this._getElement($strName).parentNode.removeChild(this._objElement[$strName]);
			}
			if (this._objElement)
			{
				// clear internal element
				if (this._objElement[$strName])
				{
					delete(this._objElement[$strName]);
				}
			}
			break;
	}
}

this._selectElement = function($elmTarget)
{
	if (typeof $elmTarget == 'string')
	{
		$elmTarget = this._getElement($elmTarget);
	}
	
	this._deselectElement();
	this._elmSelected = $elmTarget;
	this._elementAddClass($elmTarget, 'w3_select');
	
	return $elmTarget;
}

this._deselectElement = function()
{
	if (this._elmSelected)
	{
		this._elementRemoveClass(this._elmSelected, 'w3_select');
		delete(this._elmSelected);
		return true;
	}
	return false;
}

this._getSelectedElement = function()
{
	return this._elmSelected;
}

//[**] find a group of dom elements (nodes) for a widget
// also caches the elements by attaching them to the widget 
this._getElements = function($arrName, $objElements)
{
	if (!$objElements)
	{
		$objElements = {};
	}
	
	if ($arrName && typeof($arrName) == 'object')
	{
		var $elmTemp;
		var i = 0;
		var $strName;
		for(;$strName = $arrName[i++];)
		{
			if ($strName)
			{
				$elmTemp = this._getElement($strName);
				if ($elmTemp)
				{
					$objElements[$strName] = $elmTemp;
				}
			}
		}
	}
	return $objElements;
}

// check if an element has a specified class
this._elementHasClass = function($elmTarget, $strClass)
{
	if ($elmTarget.className && (' '+$elmTarget.className+' ').search(' '+$strClass+' ') != -1)
	{
		return true;
	}
	return false;
}

// remove a class from an element
this._elementRemoveClass = function($elmTarget, $strClass)
{
	if ($elmTarget.className)
	{
		$elmTarget.className = (' '+$elmTarget.className+' ').replace(' '+$strClass+' ', ' ').trim();
	}
	else
	{
		$elmTarget.className = $strClass;
	}
}

// add a class to an element
this._elementAddClass = function($elmTarget, $strClass)
{
	if (!$elmTarget.className)
	{
		$elmTarget.className = $strClass;
	}
	else if (!this._elementHasClass($strClass))
	{
		$elmTarget.className += ' ' + $strClass;
	}
}

//[**] check if the widget is a form
this._isForm = function()
{
	return this.w3.parentView.isForm(this);
}

//[**] check if the widget is a widget
this._isWidget = function()
{
	return true;
}

this._callback = function($strMethod)
{
	return this.w3.ui.id2js(this._objProperty['id']) + "." + $strMethod + "()";
}
	
// ---------------------------------------------------------------//
// STANDARD BASE EVENTS
// ---------------------------------------------------------------//

//[**] onchange
this._onchange = function($objEvent) 
{ 
	this._setPropertyValue(this._getPropertyValue($objEvent.target));
}

// ---------------------------------------------------------------//
// STANDARD EVENT HANDLER
// ---------------------------------------------------------------//

this._eventHandler = function($objEvent, $strEvent)
{	
	// handle event type specific actions
	switch ($strEvent)
	{
		case 'onselectstart':
			if (this._objProperty.preventSelect)
			{
				$objEvent.preventDefault();
			}
			break;
		case 'onmousedown':
			if (this._objProperty.preventSelect)
			{
				$objEvent.preventDefault();
			}
			break;
		case 'onmouseup':
			break;
		case 'onmouseover':
			// fake the onmouseenter event
			if ($objEvent.relatedTarget && $objEvent.target.targetId != $objEvent.relatedTarget.targetId)
			{
				// fire a mouseenter event
				this._eventHandler($objEvent, 'onmouseenter');
			}
			break;
		case 'onmouseout':
			// fake the onmouseleave event
			if ($objEvent.relatedTarget && $objEvent.target.targetId != $objEvent.relatedTarget.targetId)
			{
				// fire a mouseleave event
				this._eventHandler($objEvent, 'onmouseleave');
			}
			break;
		case 'onclick':
			break;
	}
	
	
	// run global system events
	if (this['__' + $strEvent])
	{
		this['__' + $strEvent]($objEvent);
	}
	
	// run system js event
	if (this['_' + $strEvent] && this['_' + $strEvent]($objEvent) === false)
	{
		return $objEvent.returnValue;
	}
		
	// run js event
	if (this[$strEvent] && this[$strEvent]($objEvent) === false)
	{
		return $objEvent.returnValue;
	}
	
	// run py event
	if (this._arrPyEvents)
	{	 
		if (this._arrPyEvents[$strEvent])
		{
			// collect params
			if (this._arrPyEvents[$strEvent] == '.')
			{
				// '.' = nothing to collect
				var x = [];
			}
			else
			{
				eval ('var x=' + this._arrPyEvents[$strEvent]);
			}
			
			// call python event
			w3.method.pythonEvent(this.parentView.name, this.id, $strEvent, x);
		}
	}
	
	// return false to prevent default action
	return $objEvent.returnValue;
}


