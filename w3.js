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

// Define global constants
var FALSE 			= false;
var TRUE 			= true;
var False 			= false;
var True 			= true;
var W3_NAMESPACE	= 'w3';

// Define w3 class
function W3_class()
{
	// define constants
	this.ID_PREFIX		= 'w3';
	this.ID_SEPARATOR	= '__';
	this.CSS_PREFIX		= 'w3';
	this.CSS_SEPARATOR	= '-';
	this.VERSION		= '12.03.14';
	this.UI_NAMESPACE	= 'ui';

	this._objModule 		= {};
	this._elmTemp;
				
	//------------------------------------------------------------------------//
	// requestPost
	//------------------------------------------------------------------------//
	/**
	 * requestPost()
	 *
	 * Send an AJAX POST request
	 * 
	 * WARNING : The params and functionality of this method WILL be 
	 * changed in the next API review!
	 *
	 * @param  string  Module      The path of the module making the request
	 * @param  string  Url         The URL to send the request to
	 * @param  object  Send        The data to send with the request
	 * @param  string  Target      The id of a DOM element to fill (innerHTML) with the result of the request
	 * @param  string  Id          The id of the request
	 *
	 * @return  bool
	 */
	this.requestPost = function($strModule, $strUrl, $objSend, $strTarget, $strId)
	{
		var $objRequest = this._newRequestObject();
		if ($objRequest)
		{
			$objRequest.w3Id = $strId;
			$objRequest.w3TargetElement = $strTarget;
			$objRequest.w3ModuleName = $strModule;
			$objRequest.open("POST", $strUrl, true);
			$objRequest.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			$objRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			$objRequest.send(JSON.stringify($objSend));
			return true;
		}
		return false;
	}
	
	//------------------------------------------------------------------------//
	// requestGet
	//------------------------------------------------------------------------//
	/**
	 * requestGet()
	 *
	 * Send an AJAX GET request
	 * 
	 * WARNING : The params and functionality of this method WILL be 
	 * changed in the next API review!
	 *
	 * @param  string  Module      The path of the module making the request
	 * @param  string  Url         The URL to send the request to
	 * @param  string  Target      The id of a DOM element to fill (innerHTML) with the result of the request
	 * @param  string  Id          The id of the request
	 *
	 * @return  bool
	 */
	this.requestGet = function($strModule, $strUrl, $strTarget, $strId)
	{
		var $objRequest = this._newRequestObject();
		if ($objRequest)
		{
			$objRequest.w3Id = $strId;
			$objRequest.w3TargetElement = $strTarget;
			$objRequest.w3ModuleName = $strModule;
			$objRequest.open("GET", $strUrl, true);
			$objRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			$objRequest.send(null);
			return true;
		}
		return false;
	}
	
	//[**] return a new AJAX request object
	this._newRequestObject = function()
	{
		var $objRequest = this._getNewRequestObject();
		if ($objRequest)
		{
			$objRequest.onreadystatechange = function()
			{
				if (this.readyState == 4)
				{
					if (this.status == 200)
					{
						window[W3_NAMESPACE]._handleReply(this);
					} else {
						window[W3_NAMESPACE]._handleError(this);
					}
				}
			}
		}
		return $objRequest;
	}
	
	this._getNewRequestObject = function()
	{
		// Native XMLHttpRequest browsers (Mozilla, Netscape, Firefox etc)
		if (typeof(XMLHttpRequest) != 'undefined')
		{
			try
			{
				return new XMLHttpRequest();
			}
			catch ($objError)
			{
			}
		}
		
		// IceBrowser
		if (window.createRequest)
		{
			try
			{
				return window.createRequest();
			}
			catch ($objError)
			{
			}
		}
		
		// ie
		if (window.ActiveXObject)
		{
			try
			{
				return new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch ($objError)
			{
				try
				{
					return new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch ($objError)
				{
				}
			}
		}
		
		// fail
		return false;
	}
	
	//[**] handle AJAX reply error
	this._handleError = function($objRequest)
	{		
		if (this._objModule[$objRequest.w3ModuleName] && typeof(this._objModule[$objRequest.w3ModuleName]._handleError) == 'function')
		{
			this._objModule[$objRequest.w3ModuleName]._handleError($objRequest);
		}
	}
	
	//[**] handle AJAX reply
	this._handleReply = function($objRequest)
	{
		// target specified with request
		if ($objRequest.w3TargetElement)
		{
			var $elmTemp = document.getElementById($objRequest.w3TargetElement);
			$elmTemp.innerHTML = $objRequest.responseText;
			this.runScripts($elmTemp);
		}
		else if (this._objModule[$objRequest.w3ModuleName] && typeof(this._objModule[$objRequest.w3ModuleName]._handleReply) == 'function')
		{
			this._objModule[$objRequest.w3ModuleName]._handleReply($objRequest);
		}
		else
		{
			var $elmTemp = this.elmTemp();
			$elmTemp.innerHTML = $objRequest.responseText;
			this.runScripts($elmTemp);
			$elmTemp.innerHTML = "";
		}
	}
	
	//------------------------------------------------------------------------//
	// elmTemp
	//------------------------------------------------------------------------//
	/**
	 * elmTemp()
	 *
	 * Get a temporary element.
	 * 
	 * WARNING : This method may be changed to an internal method at the next
	 * API review.
	 *
	 * @return  element  A hidden div element
	 */
	this.elmTemp = function()
	{
		if (!this._elmTemp)
		{
			var $elmTemp = document.createElement('div');
			$elmTemp.id  = 'w3.tmp.element';
			$elmTemp.style.visibility = 'hidden';
			$elmTemp.style.display    = 'none';
			document.body.appendChild($elmTemp);
			this._elmTemp = document.getElementById('w3.tmp.element');
		}
		return this._elmTemp;
	}
	
	//------------------------------------------------------------------------//
	// runScripts
	//------------------------------------------------------------------------//
	/**
	 * runScripts()
	 *
	 * Recursively execute all of the script tags in a DOM element and its 
	 * children.
	 * 
	 * Script tags added to the DOM via .innerHTML do not get executed, this 
	 * method needs to be called if you want the scripts to be run.
	 *
	 * @param  elm     Target      DOM element
	 *
	 * @return  void
	 */
	this.runScripts = function($elmTarget)
	{
		// return if node is invalid type
		if ($elmTarget.nodeType != 1)
		{
			return;
		}
 
		if ($elmTarget.tagName.toLowerCase() == 'script')
		{
			var $elmScript = document.createElement('script'); 
			$elmScript.text=$elmTarget.text;
			document.body.appendChild($elmScript);
		}
		else
		{
			var $elmChild = $elmTarget.firstChild;
			while ($elmChild)
			{
				this.runScripts($elmChild);
				$elmChild = $elmChild.nextSibling;
			}
		}
	}
	
	//------------------------------------------------------------------------//
	// loadJS
	//------------------------------------------------------------------------//
	/**
	 * loadJS()
	 *
	 * Dynamically load a JavaScript script
	 * 
	 * This method probably should be reviewed (specifically the Onload 
	 * property) to see if we should be using a callback rather than a string.
	 *
	 * @param  string  URL         URL of the JavaScript resource to be loaded
	 * @param  string  Onload      optional JavaScript to be executed once the script finishes loading
	 *
	 * @return  void
	 */
	this.loadJS = function($strURL, $strOnload)
	{
		var $elmScript = document.createElement('script');
		$elmScript.setAttribute("type", "text/javascript");
		$elmScript.setAttribute("src",  $strURL);
		if ($strOnload)
		{
			$elmScript.setAttribute("onload",  $strOnload);
		}
		document.getElementsByTagName("head")[0].appendChild($elmScript);
	}
	
	//------------------------------------------------------------------------//
	// loadCSS
	//------------------------------------------------------------------------//
	/**
	 * loadCSS()
	 *
	 * Dynamically load a CSS file
	 *
	 * @param  string  URL         URL of the CSS resource to be loaded
	 *
	 * @return  void
	 */
	this.loadCSS = function($strURL)
	{
		var $elmLink = document.createElement("link");
		$elmLink.setAttribute("rel",  "stylesheet");
		$elmLink.setAttribute("type", "text/css");
		$elmLink.setAttribute("href", $strURL);
		document.getElementsByTagName("head")[0].appendChild($elmLink);
	}
	
	//------------------------------------------------------------------------//
	// applyCSS
	//------------------------------------------------------------------------//
	/**
	 * applyCSS()
	 *
	 * Dynamically apply CSS from a string
	 *
	 * @param  string  CSS         CSS to be applied
	 *
	 * @return  void
	 */
	this.applyCSS = function($strCSS)
	{
		var $elmTarget = document.createElement('style');
		$elmTarget.setAttribute("type", "text/css");
		document.getElementsByTagName("head")[0].appendChild($elmTarget);
		if ($elmTarget.styleSheet)
		{
			// ie
			$elmTarget.styleSheet.cssText = $strCSS;
		}
		else
		{
			// real browsers
			$elmTarget.appendChild(document.createTextNode($strCSS));
		}
	}
	
	//------------------------------------------------------------------------//
	// deepCopy
	//------------------------------------------------------------------------//
	/**
	 * deepCopy()
	 *
	 * Make a deep copy of an object or array. All descendant objects will be
	 * copied rather than referenced.
	 * 
	 * Don't pass objects with circular references to this method or you will
	 * break the internet. That means you can't pass widgets to this method.
	 *
	 * @param  mixed   Value       Object or array to be copied.
	 *
	 * @return  mixed  Object or array
	 */
	this.deepCopy = function($mixValue)
	{
		if (typeof($mixValue) == 'object')
		{
			return JSON.parse(JSON.stringify($mixValue));
		}
		else
		{
			return $mixValue;
		}
	}
	
	//------------------------------------------------------------------------//
	// applyCallback
	//------------------------------------------------------------------------//
	/**
	 * applyCallback()
	 *
	 * Run a callback method on a module.
	 * 
	 * The method expects a callback array like:
	 * ['moduleName', 'methodName']
	 * or
	 * [objModule, 'methodName']
	 * 
	 * Params can be passed to the callback like:
	 * ['moduleName', 'methodName', 'value1', 'value2', ... ]
	 *
	 * @param  array   Callback    a callback array
	 *
	 * @return  void
	 */
	this.applyCallback = function($arrCallback)
	{
		var $mixMod		= $arrCallback.shift();
		var $strMethod	= $arrCallback.shift();
		if (typeof($mixMod) == "string")
		{
			$mixMod = this._objModule[$mixMod];
		}
		return $mixMod[$strMethod].apply($mixMod, $arrCallback);
	}
	
	//------------------------------------------------------------------------//
	// enhanceLinks
	//------------------------------------------------------------------------//
	/**
	 * enhanceLinks()
	 *
	 * Enhance links on a page.
	 *
	 * @return  void
	 */
	this.enhanceLinks = function()
	{
		var $arrLink = document.getElementsByTagName('a');
		var i;
		for (i in $arrLink)
		{
			if ($arrLink[i].href)
			{
				var $strAction = $arrLink[i].getAttribute('data-enhance');
				switch ($strAction)
				{
					case 'none':
						break;
					case 'remove':
						$arrLink[i].removeAttribute('href');
						break;
					default:
						$arrLink[i].target = "_blank";
				}
			}
		}
	}
	
	//------------------------------------------------------------------------//
	// registerModule
	//------------------------------------------------------------------------//
	/**
	 * registerModule()
	 *
	 * Register a module
	 *
	 * @param  object  Module      an instance of the module to be registered
	 *
	 * @return  void
	 */
	this.registerModule = function($objModule)
	{
		// set parent & path
		if (!$objModule.parent)
		{
			$objModule.parent	= this;
			$objModule.path		= $objModule.name;
		}
		else
		{
			$objModule.parent	= this._objModule[$objModule.parent];
			$objModule.path		= $objModule.parent.path + "." + $objModule.name;
		}
		
		// add in the w3 module
		$objModule.w3 = this;
		
		// cache module by path
		this._objModule[$objModule.path]		= $objModule;
		
		// add module to parent
		$objModule.parent[$objModule.name] 		= $objModule;
		if ($objModule.alias)
		{
			$objModule.parent[$objModule.alias]	= $objModule;
		}
	}
}

// load w3 class
window[W3_NAMESPACE] = new W3_class();

// Remove Class Definition
delete(W3_class);
