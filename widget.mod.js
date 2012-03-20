//--------------------------------------------------------------------//
// appMode
//--------------------------------------------------------------------//
/*
 * appMode (c) Copyright 2012 APPMO LTD
 * 
 * author    : Flame Herbohn
 * download  : http://code.google.com/p/appmode/
 * license   : GNU Affero General Public License version 3
 */

//----------------------------------------------------------------------------//
// widget.mod
//----------------------------------------------------------------------------//
/*
 * Module for managing widgets
 */

// Define Class
W3_widget_module = function()
{
	// module name
	this.name	= 'widget';
	
	// module alias
	this.alias	= 'w';
	
	// constants
	this.SELF	= 'self';
	this.NONE	= 'none';
	
	// object to hold widget types
	this._objType = {};
	
	// object to hold pointers to all widgets
	this._objWidget = {};

	//------------------------------------------------------------------------//
	// register
	//------------------------------------------------------------------------//
	/**
	 * register()
	 *
	 * Register a widget class.
	 *
	 * @param  string  Type         The name of the widget type to register
	 * @param  object  Constructor  The constructor class for the widget type
	 * @param  string  Extends      The name of the widget type that this widget type extends
	 *
	 * @return  object  probably not of any use to anyone.
	 */
	this.register = function($strType, $objConstructor, $strExtends)
	{
		// set inheritance
		if ($strExtends)
		{
			if ($strExtends in this._objType)
			{

				// cache the prototype
				if (!('p' in this._objType[$strExtends]))
				{
					this._objType[$strExtends]['p'] = new this._objType[$strExtends]['c']();
				}
				
				// set the prototype
				$objConstructor.prototype = this._objType[$strExtends]['p'];
			}
			else
			{
alert($strType + " missing extends " + $strExtends);
				return false;
			}
		}
		
		// register widget
		this._objType[$strType] = {'c':$objConstructor};
		
		// return widget
		return this._objType[$strType];
	}

	//------------------------------------------------------------------------//
	// getById
	//------------------------------------------------------------------------//
	/**
	 * getById()
	 *
	 * Get a widget by id.
	 * This method is also aliased as document.getWidgetById()
	 *
	 * @param  string  Id          the id of the widget you are looking to get
	 *
	 * @return  widget  The widget, or false if the widget is not found.
	 */
	this.getById = function($strId)
	{
		if ($strId in this._objWidget)
		{
			return this._objWidget[$strId]
		}
		return false;
	}
	
	//------------------------------------------------------------------------//
	// id2js
	//------------------------------------------------------------------------//
	/**
	 * id2js()
	 *
	 * Convert a widget id into a string representation of its JavaScript
	 * address. This method will return something like:
	 * "ui.viewName.widgetName"
	 * or
	 * "ui.viewName.parentWidgetName.widgetName"
	 *
	 * @param  string  Id          the id of the widget
	 *
	 * @return  string  the JavaScript address of the widget.
	 */
	this.id2js = function($strId)
	{
		var $arrId = this.id2array($strId);
		if ($arrId)
		{
			return this.w3.UI_NAMESPACE + '.' + $arrId.join('.');
		}
		return false;
	}
	
	//------------------------------------------------------------------------//
	// id2array
	//------------------------------------------------------------------------//
	/**
	 * id2array()
	 *
	 * Convert a widget id into an array representation of its path.
	 * This method will return something like:
	 * ['viewName','widgetName']
	 * or
	 * ['viewName', 'parentWidgetName', 'widgetName']
	 * 
	 * @param  string  Id          the id of the widget
	 *
	 * @return  array  the widget path
	 */
	this.id2array = function($strId)
	{
		// expects an id of the form W3_ID_PREFIX__formname__widgetname__subwidgetname
		var $arrNameParts = $strId.split(this.w3.ID_SEPARATOR);
		if ($arrNameParts[0] == this.w3.ID_PREFIX)
		{
			// strip '_htmlname' from the end of id
			if ($arrNameParts[$arrNameParts.length - 1].slice(0,1) == '_')
			{
				// account for forms named '_form'
				$arrNameParts[$arrNameParts.length - 1] = '_' + $arrNameParts[$arrNameParts.length - 1].split('_', 2)[1];
			}
			else
			{
				$arrNameParts[$arrNameParts.length - 1] = $arrNameParts[$arrNameParts.length - 1].split('_', 1)[0];
			}
			return $arrNameParts.slice(1);
		}
		return false;
	}
	
	//------------------------------------------------------------------------//
	// html2Element
	//------------------------------------------------------------------------//
	/**
	 * html2Element()
	 *
	 * Creates a DOM element from a HTML string.
	 * 
	 * Note that the HTML string must contain only a single tag at the base 
	 * level. Only the DOM element from the first tag will be returned, any 
	 * siblings will be ignored. The tag may contain child tags.
	 *
	 * @param  string  Html        a string of HTML
	 *
	 * @return  element  a DOM element created from the HTML string
	 */
	this.html2Element = function($strHtml)
	{
		// create a temporary div node
		var $elmDiv = document.createElement("div");
		
		// insert our html into the div
		$elmDiv.innerHTML = $strHtml;

		// get the div we really want		
		var $elmNode = $elmDiv.firstChild;

		return $elmNode;
	}
	
	//------------------------------------------------------------------------//
	// appendElement
	//------------------------------------------------------------------------//
	/**
	 * appendElement()
	 *
	 * Append a DOM element to its parent.
	 *
	 * @param  element Widget      The DOM element to be attached
	 * @param  widget  Parent      The parent widget to attach the element to
	 *
	 * @return  element  Returns false if the parent widget has no content area to attach to.
	 */
	this.appendElement = function($elmWidget, $objParent)
	{
		// try to find a content area to put the widget on
		var $objContentArea = document.getElementById($objParent.id + '_Content');
		if (!$objContentArea)
		{
// need to account for attaching to body ????
alert($objParent.id);
			return false;	
		}
		
		return $objContentArea.appendChild($elmWidget);
	}
	
	//------------------------------------------------------------------------//
	// create
	//------------------------------------------------------------------------//
	/**
	 * create()
	 *
	 * Create a JavaScript widget object.
	 * The DOM portion of the widget should already be loaded before this 
	 * method is called.
	 *
	 * @param  string  Type        The widget type to create
	 * @param  object  Widget      The widget definition
	 * @param  widget  Parent      The parent widget to attach to
	 * @param  object  PyEvents    Object containing data requirements for Python backend event handlers
	 *
	 * @return  widget  the created widget or false if the widget type is not found
	 */
	this.create = function($strType, $objWidget, $objParent, $objPyEvents)
	{	
		// check widget type exists
		if (!this._objType[$strType])
		{
alert('bad widget type: ' + $strType);
			return false;
		}
		
		// create a new widget
		var $wgtWidget = new this._objType[$strType]['c']();
		
		// add type
		$wgtWidget.type = $strType;
		
		// add property, style, etc
		if ($objWidget)
		{
			for (var i in $objWidget)
			{
				switch (i)
				{
					case 'property':
					case 'style':
					case 'dhtml':
						$wgtWidget['_obj' + i.ucFirst()] = this.w3.deepCopy($objWidget[i]);
						break;
					default:
						$wgtWidget[i]	= this.w3.deepCopy($objWidget[i]);
				}
			}
		}
		else
		{
			$wgtWidget._objProperty	= {};
			$wgtWidget._objStyle	= {};
		}
		
		// add shortcut to id, name & type
		$wgtWidget.id 	= $wgtWidget._objProperty.id;
		$wgtWidget.name = $wgtWidget._objProperty.name;
		$wgtWidget._objProperty.type = $strType;
	
			
		// add python events
		if ($objPyEvents)
		{
			$wgtWidget._objPyEvents = $objPyEvents;
		}
		
		// provide a local way of accessing w3 from inside the widget
		$wgtWidget.w3	= this.w3;
		
		// attach parent
		if ($objParent)
		{
			this.attachParent($wgtWidget, $objParent)
		}

		// store a pointer to the widget
		this._objWidget[$wgtWidget.id] = $wgtWidget;

		// onload event
		$wgtWidget.triggerEvent('onload');

		// return the widget
		return $wgtWidget;
	}
	
	//------------------------------------------------------------------------//
	// attachParent
	//------------------------------------------------------------------------//
	/**
	 * attachParent()
	 *
	 * Add a widget to its parent, and the parent to the widget.
	 * The widget is added to the .Children object of the parent.
	 * The parent is appended to the widget as .Parent
	 * The form(view) is also appended to the widget as .View
	 *
	 * @param  widget  Widget      The widget
	 * @param  widget  Parent      The parent
	 *
	 * @return  bool
	 */
	this.attachParent = function($objWidget, $objParent)
	{
		// check for a valid widget
		if (!this.isWidget($objWidget))
		{
				return false;
		}
		
		// check if the widget is a form
		if ($objParent === this.SELF)
		{
			// forms are their own parent and form
			$objWidget.Parent 	= $objWidget;
			$objWidget.Form 	= $objWidget;
		}
		else if ($objParent === this.NONE)
		{
			// no parent
		}
		else if (this.isWidget($objParent))
		{
			// add the parent & form
			$objWidget.Parent 	= $objParent;
			$objWidget.Form 	= $objParent.Form;
				
			// add to parent
			if (!$objParent.Children)
			{
				$objParent.Children = {};
			}
			$objParent.Children[$objWidget._objProperty.name] 	= $objWidget;
			if (!$objParent[$objWidget._objProperty.name])
			{
				$objParent[$objWidget._objProperty.name]		= $objWidget;
			}
		}
		else
		{
			// invalid parent
			return false;
		}
		
		return true;
	}
		
	//------------------------------------------------------------------------//
	// destroyChildren
	//------------------------------------------------------------------------//
	/**
	 * destroyChildren()
	 *
	 * Destroy all children of a widget. Kill them, kill their children, kill 
	 * their DOM nodes, make them as dead as we can.
	 *
	 * @param  widget  Widget      The widget that is no longer fit to be a parent.
	 *
	 * @return  bool  false if the widget had no children to begin with.
	 */
	this.destroyChildren = function($objWidget)
	{
		// get the widget
		if (typeof($objWidget) == 'string')
		{
			$objWidget 	= this.getById($objWidget);
		}
		
		// check that the widget has children
		if (!$objWidget.Children)
		{
			return false;
		}
		
		// for each child
		for (var $strChild in $objWidget.Children)
		{
			// remove the child
			this.destroy($objWidget.Children[$strChild]);
		}
		
		return true;
	}

	//------------------------------------------------------------------------//
	// destroy
	//------------------------------------------------------------------------//
	/**
	 * destroy()
	 *
	 * Destroy a widget. Kill it, kill it's children, kill its DOM nodes, make 
	 * it as dead as we can. 
	 *
	 * @param  widget  Widget      The widget that's living on borrowed time.
	 *
	 * @return  bool  false if it wasn't a widget you were trying to murder
	 */
	this.destroy = function($objWidget)
	{
		// get the widget
		if (typeof($objWidget) == 'string')
		{
			$objWidget 	= this.getById($objWidget);
		}
		
		// fail if we don't have a widget
		if (!this.isWidget($objWidget))
		{
			return false;
		}
		
		// remove any references to child dom nodes
		if ($objWidget._objElement)
		{
			for (var i in $objWidget._objElement)
			{
				delete($objWidget._objElement[i]);
			}
			delete($objWidget._objElement);
		}
		
		// get the dom node
		var $elmWidget 	= $objWidget._getElement();
		if ($elmWidget)
		{
			// remove the cached reference to the dom node
			delete($objWidget._elmWidget);
			
			// remove the dom node
			$elmWidget.parentNode.removeChild($elmWidget);
		}
		
		// destroy the widgets children
		this.destroyChildren($objWidget);

		// delete the widgets reference to its parent and form
		var $objParent	= $objWidget.Parent;
		delete($objWidget.Parent);
		delete($objWidget.Form);
		
		// delete the widget
		delete($objParent.Children[$objWidget._objProperty.name]);
		if (this.isWidget($objParent[$objWidget._objProperty.name]) && $objParent[$objWidget._objProperty.name]._objProperty.id == $objWidget._objProperty.id)
		{
			delete($objParent[$objWidget._objProperty.name]);
		}
		
		// remove our internal pointer to the widget
		delete(this._objWidget[$objWidget.id]);
		
		return true;
	}
	
	//------------------------------------------------------------------------//
	// isWidget
	//------------------------------------------------------------------------//
	/**
	 * isWidget()
	 *
	 * Check if something is a widget like object.
	 *
	 * @param  widget  Widget      A widget, or maybe not.
	 *
	 * @return  bool
	 */
	this.isWidget = function($objWidget)
	{
		if (typeof($objWidget) == 'object' && $objWidget.w3)
		{
			return true;	
		}
		return false;
	}
	
	//------------------------------------------------------------------------//
	// isValidWidget
	//------------------------------------------------------------------------//
	/**
	 * isValidWidget()
	 *
	 * Check if something is a valid widget like object.
	 * Checks for a .Parent object and an .id
	 *
	 * @param  widget  Widget      A widget, or maybe not.
	 *
	 * @return  bool
	 */
	this.isValidWidget = function($objWidget)
	{
		if (typeof($objWidget) == 'object' && $objWidget.w3 && typeof($objWidget.Parent) == 'object' && $objWidget.id)
		{
			return true;	
		}
		return false;
	}
	
} 

// register module
window[W3_NAMESPACE].registerModule(new W3_widget_module());

// Remove Class Definition
delete(W3_widget_module);

// global functions
window.document.getWidgetById = window[W3_NAMESPACE].widget.getById;

