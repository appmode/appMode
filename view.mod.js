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
// view.mod
//----------------------------------------------------------------------------//
/*
 * Module for managing views (forms)
 */

W3_form_module = function()
{
	// module name
	this.name	= 'form';
	
	// module alias
	this.alias	= 'f';
	
	// object containing all loaded forms
	this.forms = {};
	
	// form target
	this._strTarget = '/w3/form/';
	
	//------------------------------------------------------------------------//
	// load
	//------------------------------------------------------------------------//
	/**
	 * load()
	 *
	 * Load a view.
	 *
	 * @param  string  Name        name of the view to load
	 *
	 * @return  void
	 */
	this.load = function($strName)
	{
		this.parent.requestGet(this.name, this._strTarget + $strName + '.w3f');
	}
	
	//------------------------------------------------------------------------//
	// setTarget
	//------------------------------------------------------------------------//
	/**
	 * setTarget()
	 *
	 * Set the target folder to load views from, there will usually be no need
	 * to change this from the default setting.
	 *
	 * @param  string  Target      path to target folder
	 *
	 * @return  void
	 */
	this.setTarget = function($strTarget)
	{
		this._strTarget = $strTarget;
	}
	
	//[**] reply handler
	this._handleReply = function($objRequest)
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
	// create
	//------------------------------------------------------------------------//
	/**
	 * create()
	 *
	 * Create a view.
	 * Actually, this method was once used to create a view, now it does very 
	 * little. This method will probaly be killed off in the next API review
	 * when we finalize how forms/views are loaded.
	 *
	 * @param  widget  Form        the view widget
	 * @param  string  Parent      optional id of the parent. Defaults to document.body
	 *
	 * @return  widget
	 */
	this.create = function($wgtForm, $strParent)
	{
		// without properties we need to die
		if(typeof($wgtForm) !='object')
		{
			// Stop creating the form
			alert('bad form definition');
			return false;
		}

		// attach element to parent
		if ($wgtForm.parent)
		{
			var $elmForm	= document.getElementById($wgtForm.id)
			var $elmParent	= document.getElementById($strParent) || document.body;
			$elmParent.appendChild($elmForm);
		}

		// bring form to front
//		w3.dhtml.bringToFront(node.id);
		
		// add to the forms object
		this.forms[$wgtForm.name] = $wgtForm;
		
		// return form
		return $wgtForm;
	}
	
	//------------------------------------------------------------------------//
	// destroy
	//------------------------------------------------------------------------//
	/**
	 * destroy()
	 *
	 * Destroy a view. Kill it, kill it's children, kill its widgets, kill its
	 * DOM nodes, make it as dead as we can. 
	 *
	 * @param  mixed   Form        The widget or id of the view to be destroyed.
	 *
	 * @return  bool
	 */
	this.destroy = function($objForm)
	{
		var $objwidget;
		
		// get the widget
		if (typeof($objForm) == 'string')
		{
			// assume we were passed a widget id
			$objwidget 	= this.w3.widget.getById($objForm);
			
			// if widget was not found
			if (!$objwidget)
			{
				// assume that we were passed a form name
				$objWidget = this.forms[$objForm];
			}
		}
		else
		{
			$objwidget = $objForm;
		}
		
		// fail if we don't have a form
		if (!this.isForm($objwidget))
		{
			return false;
		}
		alert($objwidget.id)
				
		// remove froms form object
		delete (this.forms[$objwidget._objProperty.name]);
		
		// remove widget
		return this.parent.widget.destroy($objwidget);
	}
	
	//------------------------------------------------------------------------//
	// isForm
	//------------------------------------------------------------------------//
	/**
	 * isForm()
	 *
	 * Check if something is a form(view) like object.
	 *
	 * @param  widget  Widget      A view widget, or maybe not. 
	 *
	 * @return  bool
	 */
	this.isForm = function($objWidget)
	{
		if (typeof($objWidget) == 'object' && $objWidget.w3 && typeof($objWidget.Form) == 'object' && $objWidget.id == $objWidget.Form.id)
		{
			return true;	
		}
		return false;
	}
} 

// register module
window[W3_NAMESPACE].registerModule(new W3_form_module());

// Remove Class Definition
delete(W3_form_module);

// add a global ui object to hold all forms (shortcut to w3.form.forms)
window[window[W3_NAMESPACE].UI_NAMESPACE] = window[W3_NAMESPACE].form.forms;
