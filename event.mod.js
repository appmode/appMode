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
// event.mod
//----------------------------------------------------------------------------//
/*
 * Module for normalizing event objects
 */
 
// Note : may contain traces of jquery
W3_event_module = function()
{
	// module name
	this.name	= 'event';
	
	// module alias
	this.alias	= 'e';
		
	//------------------------------------------------------------------------//
	// normalize
	//------------------------------------------------------------------------//
	/**
	 * normalize()
	 *
	 * Normalize an event object.
	 *
	 * @param  object  Event       Browser event object (or normalized event object)
	 *
	 * @return  object  A normalized event object.
	 */
	this.normalize = function($objEvent)
	{
		// don't re-normalize an event object
		if ($objEvent.w3)
		{
			return $objEvent;
		}
		
		// create a normalized event object
		var $objNormal = new this._ClassNormalizedEvent($objEvent);
	
		// make sure the event has a target
		$objNormal.target = $objEvent.target || $objEvent.srcElement || document;
		
		// account for safari textnode target bug
		if ($objNormal.target.nodeType == 3)
		{
			$objNormal.target = $objNormal.target.parentNode;
		}
		
		// normalize relatedTarget
		if ($objEvent.relatedTarget)
		{
			$objNormal.relatedTarget = $objEvent.relatedTarget;
		}
		else if ($objEvent.fromElement) 
		{
			$objNormal.relatedTarget = $objEvent.fromElement === $objEvent.target ? $objEvent.toElement : $objEvent.fromElement;
		}
		
		// cache target node
		if (!$objNormal.target.targetNode)
		{
			this.getTargetNode($objNormal.target);
		}
		this.targetWithId = $objNormal.target.targetNode;
		
		// cache relatedTarget node
		if ($objNormal.relatedTarget)
		{
			if (!$objNormal.relatedTarget.targetNode)
			{
				this.getTargetNode($objNormal.relatedTarget);
			}
			this.relatedTargetWithId = $objNormal.relatedTarget.targetNode;
		}
		
		// normalize keycodes (which)
		$objNormal.which = $objEvent.which || $objEvent.charCode || $objEvent.keyCode;
		
		// normalize page position
		$objNormal.pageX = $objEvent.pageX || 0;
		$objNormal.pageY = $objEvent.pageY || 0;
// from jquery
		if ($objEvent.pageX == null && $objEvent.clientX != null)
		{
			var $elmDoc  = document.documentElement;
			var $elmBody = document.body;
			$objNormal.pageX = $objEvent.clientX + ($elmDoc && $elmDoc.scrollLeft || $elmBody && $elmBody.scrollLeft || 0) - ($elmDoc && $elmDoc.clientLeft || $elmBody && $elmBody.clientLeft || 0);
			$objNormal.pageY = $objEvent.clientY + ($elmDoc && $elmDoc.scrollTop  || $elmBody && $elmBody.scrollTop  || 0) - ($elmDoc && $elmDoc.clientTop  || $elmBody && $elmBody.clientTop  || 0);
		}
// end from jquery		
		// normalize layer position
		if ('offsetX' in $objEvent)
		{
			$objNormal.offsetX	= $objEvent.offsetX;
			$objNormal.offsetY	= $objEvent.offsetY;
		}
		else if ('layerX' in $objEvent)
		{
			$objNormal.offsetX	= $objEvent.layerX;
			$objNormal.offsetY	= $objEvent.layerY;
		}
		else
		{
			$objNormal.offsetX	= $objEvent.x || 0;
			$objNormal.offsetY	= $objEvent.y || 0;
		}
		
		return $objNormal;
	}
	
	this._ClassNormalizedEvent = function($objEvent)
	{
		this.w3			= window[W3_NAMESPACE];
		this._objEvent	= $objEvent;
		
		this.shiftKey	= $objEvent.shiftKey;
		this.altKey		= $objEvent.altKey;
		this.ctrlKey	= $objEvent.ctrlKey;
		
		this.stopPropagation = function()
		{
			var $objEvent = this._objEvent;
			if (typeof($objEvent) == 'object')
			{
				// ie
				$objEvent.cancelBubble = true;
				// real browsers		
				if ($objEvent.stopPropagation)
				{
					$objEvent.stopPropagation();
				}
			}
		}
		
		this.preventDefault = function()
		{
			var $objEvent = this._objEvent;
			if ($objEvent)
			{
				// ie
				$objEvent.returnValue = false;
				// real browsers
				if ($objEvent.preventDefault)
				{
					$objEvent.preventDefault();
				}
			}
			// used by evt handler to return false
			this.returnValue = false;
		}
		
		this.event = function()
		{
			return this._objEvent;
		}
	}
	
	
	//------------------------------------------------------------------------//
	// getTargetNode
	//------------------------------------------------------------------------//
	/**
	 * getTargetNode()
	 *
	 * Find and cache the first ancestor element which has an id property. The
	 * element passed to this method will have a .targetNode property attached
	 * to it.
	 * 
	 * This method should probably be renamed to getTargetElement before the API
	 * gets to beta.
	 *
	 * @param  element  Node        A DOM element, the target or related target of an event.
	 *
	 * @return  element  The targetNode 
	 */
	this.getTargetNode = function($elmNode)
	{
		if ($elmNode.targetNode)
		{
			return $elmNode.targetNode;
		}
		var $elmTarget = $elmNode;
		
		// if the target has no id
		if(!$elmTarget.id)
		{
			// find the first parent node with an id
			while ($elmTarget.parentNode)
			{
				$elmTarget = $elmTarget.parentNode;			
				if ($elmTarget.id)
				{
					break;
				}
			}
			// return false if we didn't find a node with an id
			if (!$elmTarget.id)
			{
				return false;
			}	
		}
		
		// if the target doesn't already have a widget id
		if (!$elmTarget.targetId)
		{	
			// get widget id
			var $intStart 	= $elmTarget.id.lastIndexOf(this.w3.ID_SEPARATOR) + this.w3.ID_SEPARATOR.length;
			var $intEnd 	= $elmTarget.id.indexOf('_', $intStart);
			if ($intEnd > 0)
			{
				$elmTarget.targetId = $elmTarget.id.substring(0, $intEnd);
			}
			else
			{
				$elmTarget.targetId = $elmTarget.id;
			}
		}
		
		// cache the target
		$elmNode.targetNode = $elmTarget;
		if (!$elmTarget.targetNode)
		{
			$elmTarget.targetNode = $elmTarget;
		}
				
		// return the target
		return $elmTarget;
	}
} 

// register module
window[W3_NAMESPACE].registerModule(new W3_event_module());

// Remove Class Definition
delete(W3_event_module);
