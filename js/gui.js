var deg = 12;
let button1;
let button2;
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background('#141430')

  textSize(20);
  fill('#0');
  text('1st Track', 5, 18);
  sel1 = createSelect();
  sel1.position(110, 10);
  sel1.option('Membrane');
  sel1.option('Pluck');
  sel1.selected('Membrane');

  textSize(20);
  text('2nd Track', 5, 38);
  sel2 = createSelect();
  sel2.position(110, 30);
  sel2.option('Membrane');
  sel2.option('Pluck');
  sel2.selected('Pluck');

  textSize(20);
  text('3rd Track', 5, 58);
  sel3 = createSelect();
  sel3.position(110, 50);
  sel3.option('Membrane');
  sel3.option('Pluck');
  sel3.selected('Membrane');

  textSize(20);
  text('4th Track', 5, 78);
  sel4 = createSelect();
  sel4.position(110, 70);
  sel4.option('Membrane');
  sel4.option('Pluck');
  sel4.selected('Pluck');

  button1 = createButton('Start/Reset me');
  button1.position(100, 100);
  button1.mousePressed(start_stop);

  button2= createButton('Pause/Cont');
  button2.position(300, 100);
  button2.mousePressed(pause_cont);

  textSize(20);
  text('Onsets 1st Track', 800, 18);
  let inp = createInput(onsetsA);
  inp.position(1000, 10);
  inp.size(100);
  inp.input(function (){onsetsA = this.value()});

  textSize(20);
  text('Pulses 2nd Track', 800, 38);
  let inp2 = createInput(pulsesA);
  inp2.position(1000, 30);
  inp2.size(100);
  inp2.input(function (){pulsesA = this.value()});

  textSize(20);
  text('Onsets 2nd Track', 800, 58);
  let inp3 = createInput(onsetsB);
  inp3.position(1000, 50);
  inp3.size(100);
  inp3.input(function (){onsetsB = this.value()});

  textSize(20);
  text('Pulses 2nd Track', 800, 78);
  let inp4 = createInput(pulsesB);
  inp4.position(1000, 70);
  inp4.size(100);
  inp4.input(function (){pulsesB = this.value()});
}

function myInputEvent() {
  console.log('you are typing: ', this.value());
}

function draw() {
  if (mouseIsPressed) {
    fill(0);
  } else {
    fill(255);
  }

  push();
  translate (window.innerWidth/2, window.innerHeight/2);
  //fill()
  rotate (radians (deg));
  ellipse (0,0,200,200);
  line(0, 100, 0, 0);
  pop();
  deg+=3;
}

function start_stop(){
  SynthTypes = [sel1.value(),sel2.value(),sel3.value(),sel4.value()];
  start_aud();
}



