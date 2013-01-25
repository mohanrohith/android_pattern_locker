/*jslint plusplus: true, browser: true, devel: true, indent: 4 */
/*global Draw, getCookie, setCookie, inArray*/

"use strict";

/*Depends on Draw */

var PatternLocker = function (element, canvas, logger) {
    Draw.call(this);
    
    this.element = element;
    this.canvas = canvas;
    this.logger = logger;
};


PatternLocker.prototype = new Draw();
PatternLocker.prototype.constructor = PatternLocker;


PatternLocker.prototype.init = function () {
    //console.log("FN: PatternLocker.init");
    
    this.initCanvas(this.canvas, this.element.offsetWidth, this.element.offsetHeight);
    this.bindEvents();
    
    //helper variables
    this.drag = false;
    this.pattern = [];
};


PatternLocker.prototype.bindEvents = function () {
    //console.log("FN: PatternLocker.bindEvents");
    
    var grid_cells = document.querySelectorAll(".circle"),
        i = 0,
        start_EVT = (typeof (window.ontouchstart) === 'undefined') ? "mousedown" : "touchstart",
        move_EVT = (typeof (window.ontouchmove) === 'undefined') ? "mousemove" : "touchmove",
        end_EVT = (typeof (window.ontouchend) === 'undefined') ? "mouseup" : "touchend";
    
    for (i = 0; i < grid_cells.length; i++) {
        grid_cells[i].addEventListener(start_EVT, this, false);
        grid_cells[i].addEventListener(move_EVT, this, false);
        grid_cells[i].addEventListener(end_EVT, this, false);
    }
};

PatternLocker.prototype.handleEvent = function (event) {
    //console.log("FN: PatternLocker.handleEvents");
    
    switch (event.type) {
    case "mousedown":
        this.onTouchStart(event);
        break;
    case "touchstart":
        this.onTouchStart(event);
        break;
    case "mousemove":
        this.onTouchMove(event);
        break;
    case "touchmove":
        this.onTouchMove(event);
        break;
    case "mouseup":
        this.onTouchEnd(event);
        break;
    case "touchend":
        this.onTouchEnd(event);
        break;
    }
};

PatternLocker.prototype.onTouchStart = function (event) {
    //console.log("EVENT: PatternLocker.onTouchStart", event.target);
    
    var target = (event.target.classList.contains("inner")) ? event.target.parentNode : event.target;
    
    this.point1 = this.getCenterPoint(event.target);
    this.drag = true;
    
    this.pattern = [];
    this.pattern.push(target.getAttribute("data-number"));
    
    this.arrX = [];
    this.arrY = [];
    this.arrX.push(this.point1.x);
    this.arrY.push(this.point1.y);
};


PatternLocker.prototype.onTouchMove = function (event) {
    //console.log("EVENT: PatternLocker.onTouchMove");
    
    if (this.drag) {
        this.point2 = this.getPoints(event);
        
        if (event.target.classList.contains("inner") && event.target.getAttribute("data-set") !== 1) {
            event.target.setAttribute("data-set", 1);
            this.point1 = this.getCenterPoint(event.target);
            
            this.arrX.push(this.point1.x);
            this.arrY.push(this.point1.y);
            
            if (!inArray(this.pattern, event.target.parentNode.getAttribute("data-number"))) {
                this.pattern.push(event.target.parentNode.getAttribute("data-number"));
            }
            
        } else {
            this.arrX[this.arrX.length - 1] = this.point2.x;
            this.arrY[this.arrY.length - 1] = this.point2.y;
        }
        
        this.redraw();
    }
};


PatternLocker.prototype.onTouchEnd = function (event) {
    //console.log("EVENT: PatternLocker.onTouchEnd", event);
    
    if (this.drag) {
        this.drag = false;
        
        //console.log(this.pattern);
        if (this.isPatternSet()) {
            this.checkPattern(this.pattern.toString());
        } else {
            this.storePattern(this.pattern.toString());
            this.logger.innerText = "Pattern has set";
        }
    }
};


PatternLocker.prototype.isPatternSet = function () {
    //console.log("FN: PatternLocker.isPatternSet", getCookie("pl_set"));
    
    if (parseInt(getCookie("pl_set"), 10) === 1) {
        return true;
    }
    
    return false;
};


PatternLocker.prototype.getPoints = function (event) {
    //console.log("FN: PatternLocker.getPoints", event.type);
    
    var point = {
        x: 0,
        y: 0
    };
    
    if (event.type === 'mousedown' || event.type === 'mouseup' || event.type === 'mousemove') {
        point.x = event.pageX;
        point.y = event.pageY;
    } else {
        if (event.type === 'touchstart') {
            point.x = event.touches[0].pageX;
            point.y = event.touches[0].pageY;
        } else {
            point.x = event.changedTouches.touches[0].pageX;
            point.y = event.changedTouches.touches[0].pageY;
        }
    }
    
    point.x -= this.element.offsetLeft;
    point.y -= this.element.offsetTop;
    
    return point;
};


PatternLocker.prototype.getCenterPoint = function (element) {
    //console.log("FN: PatternLocker.getCenterPoint");
    
    var point = {
        x: 0,
        y: 0
    },
        elementDim =  element.getBoundingClientRect();
    
    point.x = elementDim.left + (elementDim.width / 2);
    point.y = elementDim.top + (elementDim.height / 2);
    
    return point;
};


PatternLocker.prototype.checkPattern = function (pattern) {
    //console.log("FN: PatternLocker.checkPattern");
    
    if (this.isPatternSet()) {
        if (getCookie("pl_pattern") === pattern) {
            this.logger.innerText = "INFO: UNLOCKED";
        } else {
            this.logger.innerText = "INFO: WRONG PATTERN";
        }
    } else {
        this.logger.innerText = "ERROR: Pattern not set";
    }
};


PatternLocker.prototype.storePattern = function (pattern) {
    
    setCookie("pl_pattern", pattern);
    setCookie("pl_set", 1);
};