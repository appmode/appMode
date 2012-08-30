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
// ui.mod
//----------------------------------------------------------------------------//
/*
 * Module for managing ui components
 */

// Define Class
W3_ui_module = function()
{
	// module name
	this.name		= 'ui';
	
	// constants
	this.SELF		= 'self';
	this.NONE		= 'none';
	
	// object to hold widget types
	this._objType	= {};
	
	// object to hold all widgets (by id)
	this.widgets	= {};
	
	// object to hold all views (by name)
	this.views		= {};
	
	// view target
	this._strTarget = 'app/view/';
	
	this._strWait		= false;
	
	// load queues
	this._objLoadQueue	= {};
	this._objWaitQueue	= {};
	this._objFailQueue	= {};

	//------------------------------------------------------------------------//
	// loadView
	//------------------------------------------------------------------------//
	/**
	 * loadView()
	 *
	 * Load a view.
	 *
	 * @param  string  Name        name of the view to load
	 * @param  string  Wait        Optional. If $strWait matches the name of another view which
									is currently loading, the view ($strView) will not render
									until after the specified view has finished loading.
	 *
	 * @return  void
	 */
	this.loadView = function($strName, $strWait)
	{
		// add to load queue
		this._objLoadQueue[$strName] = $strWait || this._strWait;
		
		this._strWait = $strName;
		
		// load
		this.parent.requestGet(this.path, this._strTarget + $strName + '.w3v', null, $strName);
	}
	
	//[**] reply handler
	this._handleReply = function($objRequest, $strName)
	{
		if (this._strWait == $strName)
		{
			this._strWait	= false;
		}
		if (!this._objLoadQueue[$strName] || !(this._objLoadQueue[$strName] in this._objLoadQueue))
		{
			// load view
			this._loadView($objRequest);
		
			// remove from queues
			delete(this._objLoadQueue[$strName]);
			delete(this._objWaitQueue[$strName]);
		
			// load any waiting views
			var i;
			for (i in this._objWaitQueue)
			{
				if (this._objLoadQueue[i] == $strName)
				{
					this._handleReply(this._objWaitQueue[i], i);
				}
			}
		}
		else
		{
			// add to wait queue
			this._objWaitQueue[$strName] = $objRequest;
		}
	}
	
	this._handleError = function($objRequest, $strName)
	{
		// add to the fail queue
		this._objFailQueue[$strName] = this._objFailQueue[$strName] || 0;
		
		// give up on loading the view
		if (this._objFailQueue[$strName] > 5)
		{
			// remove from load queue
			delete(this._objLoadQueue[$strName]);
		
			// load any waiting views
			var i;
			for (i in this._objWaitQueue)
			{
				if (this._objLoadQueue[i] == $strName)
				{
					this._handleReply(this._objWaitQueue[i], i);
				}
			}
		}
		// try and reload the view
		else
		{
			this._objFailQueue[$strName]++;
			this.loadView($strName, this._objLoadQueue[$strName]);
		}
	}
		
	this._loadView = function($objRequest)
	{
		// create a temporary div node
		var $elmDiv = document.createElement("div");
		
		// insert our html into the div
		$elmDiv.innerHTML = $objRequest.responseText;

		// attach nodes to body
		var $elmNode = $elmDiv.firstChild;
		while ($elmNode)
		{
			if ($elmNode.nodeType != 1)
			{
				$elmDiv.removeChild($elmNode);
			}
			else if ($elmNode.tagName.toLowerCase() == 'script')
			{
				// use eval so we can see any errors
				if (window.execScript)
				{
					window.execScript($elmNode.text);
				}
				else
				{
					eval($elmNode.text);
				}
				// run script
				//var $elmScript = document.createElement('script'); 
				//$elmScript.text=$elmNode.text;
				//document.body.appendChild($elmScript);
				$elmDiv.removeChild($elmNode);
			}
			else
			{
				// attach div
				document.body.appendChild($elmNode);
			}
			$elmNode = $elmDiv.firstChild;
		}
		delete($elmDiv);
	}

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
				// set the prototype
				$objConstructor.prototype = this._objType[$strExtends];
			}
			else
			{
alert($strType + " missing extends " + $strExtends);
				return false;
			}
		}
		
		// register widget
		this._objType[$strType] = new $objConstructor();
		
		// return widget
		return this._objType[$strType];
	}

	//------------------------------------------------------------------------//
	// getWidgetById
	//------------------------------------------------------------------------//
	/**
	 * getWidgetById()
	 *
	 * Get a widget by id.
	 *
	 * @param  string  Id          the id of the widget you are looking to get
	 *
	 * @return  widget  The widget, or false if the widget is not found.
	 */
	this.getWidgetById = function($strId)
	{
		if ($strId in this.widgets)
		{
			return this.widgets[$strId]
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
	 * address. 
	 * 
	 * This method will return something like:
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
	// createView
	//------------------------------------------------------------------------//
	/**
	 * createView()
	 *
	 * Create a JavaScript view object (along with its child widgets).
     *
     * The DOM portion of the view should already be loaded before this 
     * method is called.
	 *
	 * @param  string  Name        The name of the view to create.
	 * @param  object  View        The view definition.
	 *
	 * @return  widget
	 */
	this.createView = function($strName, $objView)
	{
		this.views[$strName]				= this.createWidget($objView.type, $objView);
		this.views[$strName].parentWidget	= this.views[$strName];
		this.views[$strName].parentView		= this.views[$strName];
		return this.views[$strName];
	}
	
	
	//------------------------------------------------------------------------//
	// createWidget
	//------------------------------------------------------------------------//
	/**
	 * createWidget()
	 *
	 * Create a JavaScript widget object.
	 * 
	 * The DOM portion of the widget should already be loaded before this 
	 * method is called.
	 *
	 * @param  string  Type        The widget type to create.
	 * @param  object  Widget      The widget definition.
	 * @param  bool    Children    Set false to prevent child widgets from being created, defaults to true 
	 *
	 * @return  widget  the created widget or false if the widget type is not found
	 */
	this.createWidget = function($strType, $objWidget, $bolChildren)
	{	
		// check widget type exists
		if (!this._objType[$strType])
		{
alert('bad widget type: ' + $strType);
			return false;
		}
		
		// create a new widget
		this._createWidget.prototype = this._objType[$strType];
		var $wgtWidget = new this._createWidget();
		
		// add type
		$wgtWidget.type = $strType;
		
		// add property, style, attributes, etc
		if ($objWidget)
		{
			for (var i in $objWidget)
			{
				switch (i)
				{
					case 'property':
					case 'style':
					case 'dhtml':
					case 'pyEvents':
						$wgtWidget['_obj' + i.ucFirst()] = this.w3.deepCopy($objWidget[i]);
						break;
					case 'Children':
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
		
		// provide a local way of accessing w3 from inside the widget
		$wgtWidget.w3	= this.w3;

		// store a pointer to the widget
		this.widgets[$wgtWidget.id] = $wgtWidget;

		// create and append child widgets
		if ($bolChildren !== false)
		{
			if ($objWidget && 'Children' in $objWidget)
			{
				var i;
				for (i in $objWidget.Children)
				{
					// create/append child widget
					$wgtWidget.appendChild(this.createWidget($objWidget.Children[i].type, $objWidget.Children[i]));
				}
			}
		}

		// onload event
		$wgtWidget.trigger('onload');

		// return the widget
		return $wgtWidget;
	}
	
	this._createWidget = function()
	{
		
	}
	

	//------------------------------------------------------------------------//
	// isView
	//------------------------------------------------------------------------//
	/**
	 * isView()
	 *
	 * Check if something is a form(view) like object.
	 *
	 * @param  widget  Widget      A view widget, or maybe not. 
	 *
	 * @return  bool
	 */
	this.isView = function($objWidget)
	{
		if (typeof($objWidget) == 'object' && $objWidget.w3 && typeof($objWidget.parentView) == 'object' && $objWidget.id == $objWidget.parentView.id)
		{
			return true;	
		}
		return false;
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
		
} 

// register module
window[W3_NAMESPACE].registerModule(new W3_ui_module());

// Remove Class Definition
delete(W3_widget_module);

// add a global ui object to hold all forms (shortcut to w3.parentView.parentViews)
window[window[W3_NAMESPACE].UI_NAMESPACE] = window[W3_NAMESPACE].ui.views;

