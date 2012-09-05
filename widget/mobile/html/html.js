//----------------------------------------------------------------------------//
// appMode
//----------------------------------------------------------------------------//
/*
 * appMode (c) Copyright 2012 APPMO LTD
 * 
 * author    : Flame Herbohn
 * download  : https://github.com/appmode/appMode
 * license   : GNU Affero General Public License version 3
 */

this._getPropertyHtml = function()
{
	return this.getElement().innerHTML;
}

this._setPropertyHtml = function($strValue)
{
	return this.getElement().innerHTML = $strValue;
}
