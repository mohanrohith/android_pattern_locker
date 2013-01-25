/*jslint plusplus: true, browser: true, devel: true, indent: 4 */
/*global PatternLocker, eraseCookie*/

"use strict";

function clearPattern() {
    eraseCookie("pl_set");
    eraseCookie("pl_pattern");
    document.querySelector(".logger").innerText = "Please set the pattern";
}


function domReadyCallback() {
    //console.log("FN: Pattern Locker ready ");
    
    var logger = document.querySelector(".logger"),
        patternlocker = new PatternLocker(document.querySelector(".grid-container"), document.querySelector("canvas"), logger);
    
    patternlocker.init();
    
    if (!patternlocker.isPatternSet()) {
        logger.innerText = "Please set the pattern";
    } else {
        logger.innerText = "Please unlock using pattern";
    }
    
    //Binding the clear pattern button
    document.querySelector("#clear-pattern").addEventListener("click", clearPattern, true);
}



if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', domReadyCallback, false);
}