/****************************************************
 * Copyright © Legwork Studio. All Rights Reserved. *
 * Updated by: Matt Wiggins and Jos, 13-Jun-2011    *
 *                                                  *
 * Hidden, magical things are at the top.           *
 ****************************************************
/                                                  */
    
// scroll past the media area on sub pages
// (as quick as possible)

if(window.location.href.indexOf('#') === -1) { // don't scroll if it's a hash
	(function() {
	    var scrollTop;

        if ('pageXOffset' in window) {  // all browsers, except IE before version 9
            scrollTop = window.pageYOffset;
        }
        else {  // Internet Explorer before version 9
            scrollTop = document.documentElement.scrollTop;
        }
        
		try {
			if((scrollTop > 0) === false) {
				window.scrollTo(0, 550);
				setTimeout(arguments.callee, 1); // recurse until scrolled
			}
		} catch(e) {
		    setTimeout(arguments.callee, 1); // recurse if document.body fails
		}
	})();
} 

