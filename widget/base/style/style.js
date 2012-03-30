//#extends w3/base/base
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
// PUBLIC Style Widget Methods
//----------------------------------------------------------------------------//


//----------------------------------------------------------------------------//
// style
//----------------------------------------------------------------------------//
/**
 * style()
 *
 * see full documentation at http://appmo.de/docs
 *
 * @param  string  Name       
 * @param  mixed   Value      
 *
 */
this.style = function($strName, $mixValue)
{
	if (arguments.length == 2)
	{
		return this._setStyle($strName, $mixValue);
	}
	else if (arguments.length == 1)
	{
		return this._getStyle($strName);
	}
	else if (arguments.length == 0)
	{
		return this._objStyle;
	}
	return false;
}

//----------------------------------------------------------------------------//
// PRIVATE Style Widget Methods
//----------------------------------------------------------------------------//

this._addPxToStyle = function($strName, $mixValue)
{
	// lowercase the style name
	$strName = $strName.toLowerCase();
	
	switch ($strName)
	{
		// add px by style name
		case 'left':
		case 'right':
		case 'top':
		case 'bottom':
		case 'height':
		case 'width':
		case 'fontsize':
		case 'margin':
		case 'padding':
			return String($mixValue).addPx();
			break;
		default:
		// add px by suffix
			if ($strName.length > 3)
			{
				if ($strName.substring($strName.length - 3) == 'top')
				{
					return String($mixValue).addPx();
				}
				if ($strName.substring($strName.length - 4) == 'left')
				{
					return String($mixValue).addPx();
				}
			}
			if ($strName.length > 5)
			{
				switch ($strName.substring($strName.length - 5))
				{
					case 'right':
					case 'width':
						return String($mixValue).addPx();
				}
				switch ($strName.substring($strName.length - 6))
				{
					case 'height':
					case 'radius':
					case 'offset':
					case 'bottom':
						return String($mixValue).addPx();
				}
			}
			
	}
	return $mixValue;
}

this._getElementsByStyle = function($strName)
{
	var $objElements = {};
	var $strGroup;
	
	// base element styles
	switch ($strName)
	{
		case 'top':
		case 'bottom':
		case 'left':
		case 'right':
		case 'height':
		case 'width':
		case 'margin':
		case 'marginLeft':
		case 'marginRight':
		case 'marginTop':
		case 'marginBottom':
		case 'maxWidth':
		case 'minWidth':
		case 'maxHeight':
		case 'minHeight':
		case 'cursor':
		case 'clear':
		case 'float':	
		case 'position':
			// syle only valid on base element 
			$objElements['.'] = this._getElement();
			return $objElements;
		case 'padding':
		case 'paddingLeft':
		case 'paddingRight':
		case 'paddingTop':
			// style not valid on base element
			break;
		default:
			// any other style
			$objElements['.'] = this._getElement();
	}
	
	// by style group
	if (this._objElementsByStyleGroup)
	{
		switch ($strName)
		{
			case 'direction':
			case 'color':
				$strGroup = 'text';
				break;
			default:
				if ($strName.length > 3)
				{
					switch ($strName.substring(0, 4))
					{
						case 'font':
						case 'text':
							$strGroup = 'text';
							break;
					}
				}
				if ($strName.length > 5)
				{
					switch ($strName.substring(0, 6))
					{
						case 'backgr':
							$strGroup = 'background';
							break;
						case 'border':
							$strGroup = 'border';
							break;
						case 'outlin':
							$strGroup = 'outline';
							break;
						case 'paddin':
							$strGroup = 'padding';
							break;
					}
				}
				
		}
		if ($strGroup && this._objElementsByStyleGroup[$strGroup])
		{
			// get elements
			this._getElements(this._objElementsByStyleGroup[$strGroup], $objElements);
		}
	}
	
	// by style name
	if (this._objElementsByStyleName && this._objElementsByStyleName[$strName])
	{
		// get elements
		this._getElements(this._objElementsByStyleName[$strName], $objElements);
	}
	
	// return object of elements
	return $objElements;
}

this._fixStyleName = function($strName)
{
	switch ($strName.toLowerCase())
	{
		case 'visible':
			return 'visibility';
	}
	return $strName;
}

this._fixStyleValue = function($strName, $mixValue)
{
	switch ($strName)
	{
		case 'position':
			return $mixValue || 'absolute';
		case 'visible':
			return ($mixValue) ? 'inherit' : 'hidden';
		case 'backgroundImage':
			if (!$mixValue.startsWith('URL'))
			{
				return 'URL("' + $mixValue + '")';
			}
			break;
	}
	return $mixValue;
}

this._getStyle = function($strName)
{	
	// get style
	return this._objStyle[$strName]
}

this._setStyle = function($strName, $mixValue)
{
	// add px if required
	$mixValue = this._addPxToStyle($strName, $mixValue);
	
	// fix style value (must be done before the name)
	$mixValue = this._fixStyleValue($strName, $mixValue);
	
	// normal set style
	if (this._objStyle[$strName] !== $mixValue)
	{
		// look for a style specific method
		var $strMethod = "_setStyle" + $strName.ucFirst();
		if ($strMethod in this)
		{
			return this[$strMethod]($mixValue);
		}
		
		// set widget style
		this._objStyle[$strName] = $mixValue;
		
		// get elements
		var $objElement = this._getElementsByStyle($strName);
		
		// get actual style name
		var $strStyleName = this._fixStyleName($strName);
		
		// set node style
		if ($objElement)
		{
			for (var i in  $objElement)
			{
				$objElement[i].style[$strStyleName] = $mixValue;
			}
		}
	}
	return this._objStyle[$strName];
}
