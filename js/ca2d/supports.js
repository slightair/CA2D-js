////
// support functions

function RGBFromCMYK(cyan, magenta, yellow, black) {
  var red   = 1 - Math.min(1.0, cyan    * (1.0 - black)) + black;
  var green = 1 - Math.min(1.0, magenta * (1.0 - black)) + black;
  var blue  = 1 - Math.min(1.0, yellow  * (1.0 - black)) + black;

  var rgb = new Array(red, green, blue);
  return rgb;
}
