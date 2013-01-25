/*jslint plusplus: true, browser: true, devel: true, indent: 4 */
/*global G_vmlCanvasManager */

"use strict";

function Draw() {
    this.arrX = [];
    this.arrY = [];
    
}


Draw.prototype.initCanvas = function (element, width, height) {
    console.log("FN: Draw.initCanvas", element);
    
    if (typeof G_vmlCanvasManager !== 'undefined') {
        element = G_vmlCanvasManager.initElement(element);
    }
    
    this.canvasElement = element;
    this.canvasElement.width = width;
    this.canvasElement.height = height;
    
    this.canvasContext = element.getContext("2d");
};


Draw.prototype.draw = function (point1, point2) {
    var cxt = this.canvasContext;
    
    cxt.beginPath();
    cxt.lineJoin = "round";
    cxt.lineCap = "round";
    cxt.lineWidth = 5;
    cxt.moveTo(point1.x, point1.y);
    cxt.lineTo(point2.x, point2.y);
    cxt.stroke();
    
};

Draw.prototype.redraw = function () {
    //console.log("FN: Draw.redraw", this.arrX.length, this.arrY.length);
    
    var i = 0;
    
    this.clear();
  
    for (i = 0; i < this.arrX.length; i++) {
        this.draw({x: this.arrX[i], y: this.arrY[i]}, {x: this.arrX[i + 1], y: this.arrY[i + 1]});
    }
};

Draw.prototype.clear = function () {
    this.canvasContext.clearRect(0, 0, this.canvasElement.offsetWidth, this.canvasElement.offsetHeight);
};