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
// STRING
//----------------------------------------------------------------------------//

// regular expressions
String.prototype.re = {};

if (!String.prototype.hasOwnProperty('endsWith'))
{
	//------------------------------------------------------------------------//
	// String.endsWith
	//------------------------------------------------------------------------//
	/**
	 * String.endsWith()
	 *
	 * Check if a string ends with a suffix
	 *
	 * @param  string  Suffix      The suffix to check
	 *
	 * @return  bool
	 */
	String.prototype.endsWith = function($strSuffix)
	{
		return this.indexOf($strSuffix, this.length - $strSuffix.length) !== -1;
	}
}

if (!String.prototype.hasOwnProperty('startsWith'))
{
	//------------------------------------------------------------------------//
	// String.startsWith
	//------------------------------------------------------------------------//
	/**
	 * String.startsWith()
	 *
	 * Check if a string starts with a prefix
	 *
	 * @param  string  Prefix      The prefix to check
	 *
	 * @return  bool
	 */
	String.prototype.startsWith = function($strPrefix)
	{
		return this.slice(0, $strPrefix.length) == $strPrefix;
	}
}

if (!String.prototype.hasOwnProperty('ucFirst'))
{
	//------------------------------------------------------------------------//
	// String.ucFirst
	//------------------------------------------------------------------------//
	/**
	 * String.ucFirst()
	 *
	 * convert the first character of a string to upper case
	 *
	 * @return  string
	 */
	String.prototype.ucFirst = function()
	{
		if (this.length > 0)
		{
			return this.charAt(0).toUpperCase() + this.slice(1);
		}
		return '';
	}
}

//------------------------------------------------------------------------//
// String.addPx
//------------------------------------------------------------------------//
/**
 * String.addPx()
 *
 * Add a px suffix to a numeric string.
 * 
 * If the string already has a suffix then px is not added.
 * If the string is empty or non-numeric a blank string is returned.
 *
 * @return  string
 */
String.prototype.addPx = function()
{	
	var n = parseFloat(this);
	if (isNaN(n))
	{
		return '';
	}
	if (n == this)
	{
		return n + 'px';
	}
	return this;
}

//------------------------------------------------------------------------//
// String.removePx
//------------------------------------------------------------------------//
/**
 * String.removePx()
 *
 * Removes a px suffix from a numeric string
 * 
 * If the string is empty or non-numeric a blank string is returned.
 *
 * Note: this method will actually strip any suffix from the string.
 *
 * @return  mixed  number or empty string
 */
String.prototype.removePx = function()
{
	var n = parseFloat(this);
	if (isNaN(n))
	{
		return '';
	}
	return n;
}

if (!String.prototype.hasOwnProperty('trim'))
{
	//------------------------------------------------------------------------//
	// String.trim
	//------------------------------------------------------------------------//
	/**
	 * String.trim()
	 *
	 * Trim leading and trailing whitespace from a string.
	 *
	 * @return  string
	 */
	String.prototype.trim = function()
	{
		return this.replace(this.re.trimLeft, '').replace(this.re.trimRight, '');
	}
}

// trimRight()
if (!String.prototype.hasOwnProperty('trimRight'))
{
	//------------------------------------------------------------------------//
	// String.trimRight
	//------------------------------------------------------------------------//
	/**
	 * String.trimRight()
	 *
	 * Trim trailing whitespace from a string.
	 *
	 * @return  string
	 */
	String.prototype.trimRight = function()
	{
		return this.replace(this.re.trimLeft, '');
	}
	String.prototype.re.trimRight = /\s+$/;
}

// trimLeft()
if (!String.prototype.hasOwnProperty('trimLeft'))
{
	//------------------------------------------------------------------------//
	// String.trimLeft
	//------------------------------------------------------------------------//
	/**
	 * String.trimLeft()
	 *
	 * Trim leading whitespace from a string.
	 *
	 * @return  string
	 */
	String.prototype.trimLeft = function()
	{
		return this.replace(this.re.trimRight, '');
	}
	String.prototype.re.trimLeft = /^\s+/;
}

// toSelectorCase()
if (!String.prototype.hasOwnProperty('toSelectorCase'))
{
	//------------------------------------------------------------------------//
	// String.toSelectorCase
	//------------------------------------------------------------------------//
	/**
	 * String.toSelectorCase()
	 *
	 * Convert a string to selector-case from camelCase 
	 *
	 * @return  string
	 */
	String.prototype.toSelectorCase = function()
	{
		return this.replace(this.re.toSelectorCase, '-$1').toLowerCase();
	}
	String.prototype.re.toSelectorCase = /([A-Z])/g;
}

// toCamelCase()
if (!String.prototype.hasOwnProperty('toCamelCase'))
{
	//------------------------------------------------------------------------//
	// String.toCamelCase
	//------------------------------------------------------------------------//
	/**
	 * String.toCamelCase()
	 *
	 * Convert a string to camelCase from selector-case or path/case
	 *
	 * @return  string
	 */
	String.prototype.toCamelCase = function()
	{
		return this.replace(this.re.toCamelCase, function (g) { return g[1].toUpperCase() });
	}
	String.prototype.re.toCamelCase = /[-\/]([a-z_])/g;
}

//----------------------------------------------------------------------------//
// NUMBER
//----------------------------------------------------------------------------//

//------------------------------------------------------------------------//
// Number.addPx
//------------------------------------------------------------------------//
/**
 * Number.addPx()
 *
 * Add a px suffix to a number.
 * 
 * If the number is NaN a blank string is returned.
 *
 * @return  string
 */
Number.prototype.addPx = function()
{
	if (isNaN(this))
	{
		return '';
	}
	return String(this) + 'px';
}

//------------------------------------------------------------------------//
// Number.removePx
//------------------------------------------------------------------------//
/**
 * Number.removePx()
 *
 * Remove a px suffix from a number.
 * 
 * If the number is NaN a blank string is returned.
 *
 * Note: a number can't actually have a px suffix, if it did it would be a 
 * string and not a number. The method name is for consistency with the other
 * add/removePx methods.
 * 
 * @return  mixed  number or empty string
 */
Number.prototype.removePx = function()
{
	if (isNaN(this))
	{
		return '';
	}
	return this;
}


