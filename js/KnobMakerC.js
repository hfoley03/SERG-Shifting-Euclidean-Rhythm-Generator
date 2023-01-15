
//
// Miles DeCoster - codeforartists.com
// MakeKnobC function to create rotating knobs which return different number ranges
// Version C4.1 Sept 30, 2019

// The C version does not use external graphics.
// The knobs are drawn with p5js and you can set a color value for the knob and the text
// The knob colors can be individually programmed to very according to any parameters you want,
// - for instance you could adjust the color brightness of a knob based on its setting

// These are the 11 parameters that need to be passed to the MakeKnob function:

// knobColor - use a word in quotes "red" or rgb value in brackets [255,0,0] or rgba [0,255,255,100]
// diameter - Set knob size in pixels. Integer
// locx, locy - Set the location on the canvas horizontal and vertical pixel coordinates.
// lowNum, hiNum - Set the range of values returned. Floating point numbers are ok.
// defaultNum - Sets the default value of the knob. DO NOT set a frequency knob to 0. Amplitude can be 0.
// numPlaces - Refers to the displayed value below the knob. Sets the number of decimal places to display.
//  - Does not affect the actual value returned which is a float.
// labelText - the text to display below the knob. example: "Frequency"
// textColor - sets the color of the label and display value text;
//  - use a color word in quotes "cyan" or rgb or rgba value in brackets [255,0,0] [200,150,100,150]
// textPt - enter a number (ie. 18) for the size of the type - sets return value and label text size

// NOTES:
// To retrieve the current value use instanceName.knobValue. This is how you access the returned value
// and use it to actually do something.
// Example: myfreq = freqKnob.knobValue; osc.freq(myfreq);
// Each instance of a knob also needs to be attached to mouse actions with the active and inactive methods:
// example:
// function mousePressed() {
//    instancename.active();
// }
// function mouseReleased() {
//    instancename.inactive();
// }

function MakeKnobC(knobColor, diameter, locx, locy, lowNum, hiNum, defaultNum, numPlaces, labelText, textColor, textPt) {
  this.pos = createVector(0,0);
  this.pos.x = locx;
  this.pos.y = locy;
  this.lowNum = lowNum;
  this.hiNum = hiNum;
  this.rotateMe = map(defaultNum, lowNum, hiNum, 0, -280);
  this.currentRot = map(defaultNum, lowNum, hiNum, 0, -280);
  this.radius = diameter;
  this.knobValue = defaultNum;
  this.displayValue=0;
  this.isClickedOn = false;
  this.mouseOver = false;
  this.myY=mouseY;
  this.label=labelText;
  this.numPlaces = numPlaces;
  this.knobColor = knobColor;
  this.textColor = textColor;
  this.textPt = textPt;

  // the update function will be called in the main program draw function
  this.update = function() {
    push(); // store the coordinate matrix ------------------------------------
    fill(255);
    // move the origin to the pivot point
    translate(this.pos.x, this.pos.y);

    // rotate the grid around the pivot point by a
    // number of degrees based on drag on button

    if (dist(this.pos.x, this.pos.y, mouseX, mouseY) < this.radius/2) {
      this.mouseOver = true;
    } else {
      this.mouseOver = false;
    }
    if (mouseIsPressed && this.isClickedOn) {
      this.rotateMe=this.currentRot+map(mouseY, this.myY, 280, 0, 280);
      this.rotateMe=int(this.rotateMe);
      if (this.rotateMe <  -280) { this.rotateMe = -280; }
      if (this.rotateMe > 0) { this.rotateMe = 0; }
      rotate(radians(-this.rotateMe));   // change degrees to radians
    } else {
      rotate(radians(-this.rotateMe));
    }

    if (!mouseIsPressed ) {
      this.currentRot=this.rotateMe;
      this.isClickedOn = false;
    }
    // now we actually draw the knob to the screen ----------------------------
    fill(200);
    ellipse(0, 0, this.radius, this.radius);
    fill(this.knobColor);
    ellipse(0, 0, this.radius-5, this.radius-5);
    fill(100);
    ellipse(0,0,this.radius/2,this.radius/2);
    fill(180);
    ellipse(0,0,(this.radius/2)-5,(this.radius/2)-5);
    fill(255);
    ellipse(-26, this.radius* 0.3, this.radius/10,this.radius/10);
    fill(0);
    pop(); // restore coordinate matrix

    rotate(0);
    fill(255);
    // add the display value and label
    textAlign(CENTER);
    this.knobValue=map(this.rotateMe, -280, 0, hiNum, lowNum);
    textSize(this.textPt);
    fill(this.textColor);
    text(""+ nfc(this.knobValue, numPlaces), this.pos.x, this.pos.y+this.radius/2+this.textPt*1.5);
    text(this.label, this.pos.x, this.pos.y+this.radius/2+this.textPt*2.8);

    if (this.mouseOver || this.isClickedOn) { pointerCursor = true; }
  }; // end update

  this.active = function() {

    if (this.mouseOver){
      this.isClickedOn = true;
      this.myY=mouseY;
      cursor('pointer');
    } else {
      this.isClickedOn = false;
    }
  }

  this.inactive = function() {
    this.currentRot=this.rotateMe;
    this.isClickedOn = false;
    cursor('default');
  }

} // end KnobMakerC
