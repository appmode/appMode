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
	this.views = {};
	
	
	
	
	

	
	
} 

// register module
window[W3_NAMESPACE].registerModule(new W3_form_module());

// Remove Class Definition
delete(W3_form_module);


