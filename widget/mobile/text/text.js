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

this._getPropertyValue = function()
{
	return this.getElement().innerHTML;
}

this._setPropertyValue = function($strValue)
{
	return this._setNodeText(this.getElement(), $strValue);
}
