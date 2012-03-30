w3.base.style
================================================================================

[TOC]

Attributes
--------------------------------------------------------------------------------

The w3 style widget extends the w3 base widget and inherits all attributes from 
it.

Methods
--------------------------------------------------------------------------------

The w3 style widget extends the w3 base widget and inherits all methods from it.

Widgets which extent the w3 style widget also inherit the following methods:

mixed   .style       ([$strName [, $mixValue]])
:   Get or set a style value of the widget.

    When called with one parameter the value of the style will be returned.

    When called with two parameters the value of the style will be set. The 
    actual value of the style will be returned (this value may differ from
    the $mixValue parameter as the .style() method may convert the value). 
    
    When called with no parameters the entire style object of the widget will 
    be returned as an associative array object with the style names as keys.
    Modifying a style in this object will directly modify the style
    within the widget (bypassing the .style() method). Modifying a style
    directly may have unexpected results and is not advised.

    str     $strName
    The name of the style to get or set.
                    
    mixed   $mixValue
    The value of the style to be set.
                    
    mixed   return
    The value of the style, or the entire style object of the widget.
