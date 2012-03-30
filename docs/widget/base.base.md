w3.base.base
================================================================================

[TOC]

Attributes
--------------------------------------------------------------------------------

Widgets which extent the w3 base widget inherit the following attributes:

obj     .childWidgets
:   The child widgets of the widget.
    An associative array object with the child widget names as keys.

str     .id
:   The id of the widget.
    Each widget id is unique and is set at compile time. The id of a widget 
    remains the same even if the widget is appended to a new parent at runtime.
            
str     .name
:   The name of the widget.
    Each widget name is unique within its direct parent. Widgets appended to a 
    new parent at runtime must not have the same name as any other widget which 
    is a direct child of the new parent.           

wgt     .parentView
:   The parent view.
            
wgt     .parentWidget
:   The parent widget.

str     .type
:   The type of the widget.

obj     .w3
:   A shortcut to the w3 runtime object.



Methods
--------------------------------------------------------------------------------

Widgets which extent the w3 base widget inherit the following methods:

void    .addClass    ($strClass)
:   Add a CSS class to the widget.
    
    str     $strClass
    The name of the CSS class to be added to the widget.

wgt     .appendChild    ($wgtChild [, $elmChild])
:   Append a child widget to the widget.
        
    wgt     $wgtChild
    The widget to be appended.
                    
    If set to false and $elmChild is set to a DOM element, only the DOM element 
    will be appended.
        
    elm     $elmChild
    The optional DOM element for the widget. By default the DOM element will be 
    found using the getElement() method of the widget.
                    
    If set to false the DOM element for the widget will not be appended.
            
    wgt     return
    The appended widget.

elm    .getElement     ([$strTarget])
:   Get a DOM element associated with the widget.
    
    When called with no parameters the base element for the widget will be 
    returned.
    
    When called with one parameter a sub element of the widget will be returned.
    
    The DOM element will be cached by the widget.
        
    str     $strTarget
    The optional name of the sub element to get. Refer to the individual widget 
    documentation for sub element names.
                    
    elm     return
    A DOM element.

bool	.hasClass       ($strClass)
:   Check if a widget has a specified CSS class set.
    
    str     $strClass
    The name of the CSS class to check for.

mixed	.property       ([$strName[, $mixValue]])
:   Get or set a property value of the widget.

    When called with one parameter the value of the property will be returned.

    When called with two parameters the value of the property will be set. The 
    actual value of the property will be returned (this value may differ from
    the $mixValue parameter as the .property() method may convert the value). 
    
    When called with no parameters the entire property object of the widget will 
    be returned as an associative array object with the property names as keys.
    Modifying a property in this object will directly modify the property
    within the widget (bypassing the .property() method). Modifying a property
    directly may have unexpected results and is not advised.

    str     $strName
    The name of the property to get or set.
                    
    mixed   $mixValue
    The value of the property to be set.
                    
    mixed   return
    The value of the property, or the entire property object of the widget.

wgt     .removeChild    ($wgtChild [, $bolRemoveDom])
:    Remove a child widget of the widget.
     
     wgt     $wgtChild
     The widget to be removed.
                    
     bool    $bolRemoveDom
     Defaults to true.
                    
     If set to false the DOM element for the widget will not be removed.
                    
     wgt     return
     The removed widget.

void    .removeClass    ($strClass)
:    Remove a CSS class from a widget.
    
     str     $strClass
     The name of the CSS class to be removed from the widget.

mixed	.trigger        ($strEvent [, $objEvent])
:    Trigger an event on the object.
    
     str     $strEvent
     The type of the event to be triggered, for example "onclick".
        
     obj     $objEvent
     An optional event object to be passed to the event handlers.
     If not provided, a pseudo event object will be generated.
        
     mixed   return
     Returns undefined by default.
     Returns false if the .preventDefault() method of the event object has been 
     called.
