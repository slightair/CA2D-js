////
// CA2D

function CA2D() {
  var width;
  var height;
  var cells;
  var canvas;
  var rule;
  var ruleParams;
  var cellSize;
  var timer;
}

// constants
CA2D.RuleParamsSurvive = 0;
CA2D.RuleParamsBorn = 1;
CA2D.RuleParamsNumConditions = 2;

CA2D.prototype = {
  init: function(canvasId, w, h, rule) {
    var i;

    this.width = w;
    this.height = h;

    this.cells = new Array(w * h);

    var canvas = document.getElementById(canvasId);
    if (!canvas || !canvas.getContext) {
      return false;
    }
    this.canvas = canvas;
    this.rule = rule;

    var str;
    var params = rule.split("/");

    str = params[CA2D.RuleParamsSurvive];
    var survive = 0;
    for (i=0;i<str.length;i++) {
      survive += 1 << parseInt(str.charAt(i), 10) - 1;
    }

    str = params[CA2D.RuleParamsBorn];
    var born = 0;
    for (i=0;i<str.length;i++) {
      born += 1 << parseInt(str.charAt(i), 10) - 1;
    }

    var numConditions = parseInt(params[CA2D.RuleParamsNumConditions], 10);
    this.ruleParams = new Array(survive, born, numConditions);

    this.cellSize = 3.0;

    for (i=0;i<w*h;i++) {
      if (Math.random() < 0.1) {
        this.cells[i] = numConditions - 1;
      }
      else {
        this.cells[i] = 0;
      }
    }

    return true;
  },

  run: function() {
    var _this = this;
    this.timer = setInterval(function(){_this.tick();}, 1000 / 30);
  },

  tick: function() {
    var prevCells = this.cells;
    cells = new Array(prevCells.length);

    var x, y, i, j, count;
    var w = this.width;
    var h = this.height;
    var lastX = w - 1;
    var lastY = h - 1;
    var condMax = this.ruleParams[CA2D.RuleParamsNumConditions] - 1;

    for(y=0;y<h;y++){
      for(x=0;x<w;x++){
        count = 0;

        if(y===0){
          // top edge
          if(x===0){
            // left edge
            if(prevCells[lastX + lastY * w] == condMax)count++;
            if(prevCells[0 + lastY * w] == condMax)count++;
            if(prevCells[1 + lastY * w] == condMax)count++;
            if(prevCells[lastX + 0 * w] == condMax)count++;
            if(prevCells[lastX + 1 * w] == condMax)count++;
            for(j=0;j<=1;j++){
              for(i=0;i<=1;i++){
                if(prevCells[i + j * w] == condMax)count++;
              }
            }
          }
          else if(x==lastX){
            // right edge
            if(prevCells[(lastX-1) + lastY * w] == condMax)count++;
            if(prevCells[lastX + lastY * w] == condMax)count++;
            if(prevCells[0 + lastY * w] == condMax)count++;
            if(prevCells[0 + 0 * w] == condMax)count++;
            if(prevCells[0 + 1 * w] == condMax)count++;
            for(j=0;j<=1;j++){
              for(i=lastX-1;i<=lastX;i++){
                if(prevCells[i + j * w] == condMax)count++;
              }
            }
          }
          else{
            for(i=x-1;i<=x+1;i++){
              if(prevCells[i + lastY * w] == condMax)count++;
            }
            for(j=0;j<=1;j++){
              for(i=x-1;i<=x+1;i++){
                if(prevCells[i + j * w] == condMax)count++;
              }
            }
          }
        }
        else if(y==lastY){
          // bottom edge
          if(x===0){
            // left edge
            for(j=lastY-1;j<=lastY;j++){
              for(i=0;i<=1;i++){
                if(prevCells[i + j * w] == condMax)count++;
              }
            }
            if(prevCells[lastX + (lastY-1) * w] == condMax)count++;
            if(prevCells[lastX + lastY * w] == condMax)count++;
            if(prevCells[lastX + 0 * w] == condMax)count++;
            if(prevCells[0 + 0 * w] == condMax)count++;
            if(prevCells[1 + 0 * w] == condMax)count++;
          }
          else if(x==lastX){
            // right edge
            for(j=lastY-1;j<=lastY;j++){
              for(i=lastX-1;i<=lastX;i++){
                count += prevCells[i + j * w] == condMax ? 1 : 0;
              }
            }
            count += prevCells[0 + (lastY-1) * w] == condMax ? 1 : 0;
            count += prevCells[0 + lastY * w] == condMax ? 1 : 0;
            count += prevCells[(lastX-1) + 0 * w] == condMax ? 1 : 0;
            count += prevCells[lastX + 0 * w] == condMax ? 1 : 0;
            count += prevCells[0 + 0 * w] == condMax ? 1 : 0;
          }
          else{
            for(i=x-1;i<=x+1;i++){
              if(prevCells[i + 0 * w] == condMax)count++;
            }
            for(j=lastY-1;j<=lastY;j++){
              for(i=x-1;i<=x+1;i++){
                if(prevCells[i + j * w] == condMax)count++;
              }
            }
          }
        }
        else if(x===0){
          // left edge
          for(j=y-1;j<=y+1;j++){
            for(i=0;i<=1;i++){
              if(prevCells[i + j * w] == condMax)count++;
            }
            if(prevCells[lastX + j * w] == condMax)count++;
          }
        }
        else if(x==lastX){
          // right edge
          for(j=y-1;j<=y+1;j++){
            for(i=lastX-1;i<=lastX;i++){
              count += prevCells[i + j * w] == condMax ? 1 : 0;
            }
            count += prevCells[0 + j * w] == condMax ? 1 : 0;
          }
        }
        else{
          for(j=y-1;j<=y+1;j++){
            for(i=x-1;i<=x+1;i++){
              if(prevCells[i + j * w] == condMax)count++;
            }
          }
        }

        if(prevCells[x + y * w] == condMax)count--;

        var env = 0;
        if(count > 0){
          env = (1 << (count - 1));
        } 

        var survive = this.ruleParams[CA2D.RuleParamsSurvive];
        var born = this.ruleParams[CA2D.RuleParamsBorn];
        var prevCond = prevCells[x + y * w];

        if(prevCond === 0 && born & env){
          cells[x + y * w] = condMax;
        }
        else if(prevCond == condMax && survive & env){
          cells[x + y * w] = prevCond;
        }
        else{
          if(prevCond > 0){
            cells[x + y * w] = prevCond - 1;
          }
          else{
            cells[x + y * w] = 0;
          }
        }
      }
    }
    this.cells = cells;

    this.draw();
  },

  draw: function() {
    var canvas = document.createElement('canvas');
    canvas.width = this.width * this.cellSize;
    canvas.height = this.height * this.cellSize;

    var ctx = canvas.getContext('2d');
    var image = ctx.createImageData(canvas.width, canvas.height);
    var imageData = image.data;

    var i = 0;
    // image と canvas の大きさが同じとはかぎらないらしい
    var ew = Math.floor(image.width/canvas.width) * this.cellSize;
    var eh = Math.floor(image.height/canvas.height) * this.cellSize;
    var condition;
    var offset;
    var numConditions = this.ruleParams[CA2D.RuleParamsNumConditions];
    var magenta;
    var rgb;

    for (var y=0;y<this.height;y++) {
      for (var ey=0;ey<eh;ey++) {
        for (var x=0;x<this.width;x++) {
          condition = this.cells[x + this.width * y];

          for (var ex=0;ex<ew;ex++) {
            offset = i * 4;

            if (condition === 0) {
              imageData[offset    ] = 0;
              imageData[offset + 1] = 0;
              imageData[offset + 2] = 0;
              imageData[offset + 3] = 255;
            }
            else{
              magenta = 1.0 - (1.0 / (numConditions - 2) * (condition - 1));
              rgb = RGBFromCMYK(0.0, magenta, 1.0, 0.0);
              imageData[offset    ] = rgb[0] * 255;
              imageData[offset + 1] = rgb[1] * 255;
              imageData[offset + 2] = rgb[2] * 255;
              imageData[offset + 3] = 255;
            }

            i++;
          }
        }
      }
    }
    ctx.putImageData(image, 0, 0);

    var _ctx = this.canvas.getContext('2d');
    _ctx.drawImage(canvas, 0, 0);
  }
};
////
// support functions

function RGBFromCMYK(cyan, magenta, yellow, black) {
  var red   = 1 - Math.min(1.0, cyan    * (1.0 - black)) + black;
  var green = 1 - Math.min(1.0, magenta * (1.0 - black)) + black;
  var blue  = 1 - Math.min(1.0, yellow  * (1.0 - black)) + black;

  var rgb = new Array(red, green, blue);
  return rgb;
}
