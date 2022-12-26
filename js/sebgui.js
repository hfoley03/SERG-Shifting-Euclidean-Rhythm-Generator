// ------- P5 JS -----

let w = window.innerWidth;
let h = window.innerHeight;
let pulses = pulsesA;
let pulses_2 = pulsesB;
let onset_1 = binaryRhythmA;
let onset_2 = binaryRhythmB;
let onset_3 = binaryRhythmA;
let onsetsA_buf;
let onsetsB_buf;
let pulsesA_buf;
let pulsesB_buf;

let gen_button;
let play_button;
let stop_button;

function setup() {
  frameRate(5)
  createCanvas(w,h);
  background('#141430')
  textSize(20);
  push();
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

  gen_button = createButton('Generate');
  gen_button.position(100, 100);
  gen_button.mousePressed(function() {
    stop_aud();
    onsetsA = onsetsA_buf;
    onsetsB = onsetsB_buf;
    pulsesA = pulsesA_buf;
    pulsesB = pulsesB_buf;
    generateMidi(onsetsA, pulses, onsetsB, pulsesB);

  });

  play_button= createButton('Play');
  play_button.position(100, 150);
  play_button.mousePressed(start_aud_gui);

  stop_button= createButton('Stop/Reset');
  stop_button.position(100, 200);
  stop_button.mousePressed(stop_aud);


  textSize(20);
  text('Onsets 1st Track', 800, 18);
  let inp = createInput(onsetsA);
  inp.position(1000, 10);
  inp.size(100);
  inp.input(function (){  clear();
    onsetsA_buf = this.value()});

  textSize(20);
  text('Pulses 2nd Track', 800, 38);
  let inp2 = createInput(pulsesA);
  inp2.position(1000, 30);
  inp2.size(100);
  inp2.input(function (){  clear();
    pulsesA_buf = this.value()});

  textSize(20);
  text('Onsets 2nd Track', 800, 58);
  let inp3 = createInput(onsetsB);
  inp3.position(1000, 50);
  inp3.size(100);
  inp3.input(function (){  clear();
    onsetsB_buf = this.value()});

  textSize(20);
  text('Pulses 2nd Track', 800, 78);
  let inp4 = createInput(pulsesB);
  inp4.position(1000, 70);
  inp4.size(100);
  inp4.input(function (){  clear();
    pulsesB_buf = this.value()});

  pop();
}

function draw() {
  //background(220);
  let c = w/4; //center
  let r = w/6; // radious main circle
  // main circle
  fill('#003459');
  circle(c, c, 2*r);

  for (let i = 0; i < pulses; i ++){
    let n_x = c+(r*cos(i*2*PI/pulses));
    let n_y = c+(r*sin(i*2*PI/pulses));
    fill(255,255,255);
    circle(n_x,n_y, c/10);
    if (onset_1[i]==1){
      fill('#02c39a');
      circle(n_x,n_y, c/10);
    }
  }

  // Second circle
  fill('#028090');
  circle(c, c, 2*r*0.7);

  for (let i = 0; i < pulses; i ++){
    let n_x = c+(r*0.7*cos(i*2*PI/pulses));
    let n_y = c+(r*0.7*sin(i*2*PI/pulses));

    fill(255,255,255);
    circle(n_x,n_y, c/10);
    if (onset_2[i]==1){
      fill('#fce38a');
      circle(n_x,n_y, c/10);
    }
  }

  // third circle

  fill('#003459');
  circle(c, c, 2*r*0.4);

  for (let i = 0; i < pulses_2; i ++){
    let n_x = c+(r*0.4*cos(i*2*PI/pulses_2));
    let n_y = c+(r*0.4*sin(i*2*PI/pulses_2));

    fill(255,255,255);
    circle(n_x,n_y, c/10);
    if (onset_3[i]==1){
      fill('#02c39a');
      circle(n_x,n_y, c/10);
    }
  }
}

function start_aud_gui(){
  SynthTypes = [sel1.value(),sel2.value(),sel3.value(),sel4.value()];
  console.log('audio started');
  start_aud();
}
