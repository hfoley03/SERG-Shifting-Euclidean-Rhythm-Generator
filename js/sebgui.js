// ------- P5 JS -----

let w = window.innerWidth;
let h = window.innerHeight;
let pulses_1 = pulsesA;
let pulses_2 = pulsesB;
let onset_1 = binaryRhythmA;
let onset_2 = binaryRhythmB;

let gen_button;
let play_button;
let stop_button;

function setup() {
  frameRate(100)
  createCanvas(w,h);


  // --- Get as input the values of the Onsets and Pulses of the Tracks.
  gen_button = createButton('Generate');
  gen_button.position(3.5*w/12, h/3);
  gen_button.style('background-color', '#89a194');
  gen_button.style('border-color', '#89a194');
  gen_button.style('border-radius' , 10 + '%');
  gen_button.style('z-index',  100);
  gen_button.mousePressed(function() {
    clear()

    stop_aud();
    onsetsA = parseInt(inp1.value());
    onsetsB = parseInt(inp3.value());
    pulsesA = parseInt(inp2.value());
    pulsesB = parseInt(inp4.value());
    generateMidi(onsetsA, pulsesA, onsetsB, pulsesB);
    pulses_1 = pulsesA;
    pulses_2 = pulsesB;
    onset_1 = binaryRhythmA;
    onset_2 = binaryRhythmB;
  });

  // ---- Selection of the type of Synth according to the user

  sel1 = createSelect();
  sel1.position(9*w/12,h/10+50);
  sel1.option('Membrane');
  sel1.option('Pluck');
  sel1.selected('Membrane');

  sel2 = createSelect();
  sel2.position(9*w/12,h/10+70);
  sel2.option('Membrane');
  sel2.option('Pluck');
  sel2.selected('Pluck');

  sel3 = createSelect();
  sel3.position(9*w/12,h/10+90);
  sel3.option('Membrane');
  sel3.option('Pluck');
  sel3.selected('Membrane');

  sel4 = createSelect();
  sel4.position(9*w/12,h/10+110);
  sel4.option('Membrane');
  sel4.option('Pluck');
  sel4.selected('Pluck');

  // ---- Play button
  play_button = createButton('Play');
  play_button.position(6*w/12, h/3);
  play_button.style('background-color', '#89a194');
  play_button.style('border-color', '#89a194');
  play_button.style('border-radius' , 10 + '%');
  play_button.mousePressed(start_aud_gui);

  // ---- Stop button
  stop_button = createButton('Stop');
  stop_button.position(8*w/12, h/3);
  stop_button.style('background-color', '#89a194');
  stop_button.style('border-color', '#89a194');
  stop_button.style('border-radius' , 10 + '%');
  stop_button.mousePressed(stop_aud);

// ----- Inputs of the Onsets and Pulses of the Euclidean Rhythm
  let inp1 = createInput(onsetsA.toString());
  inp1.position(2.6*w/12, 2*h/10+30);
  inp1.size(100);

  let inp2 = createInput(pulsesA.toString());
  inp2.position(2.6*w/12, 2*h/10+50);
  inp2.size(100);

  let inp3 = createInput(onsetsB.toString());
  inp3.position(5.7*w/12, 2*h/10+30);
  inp3.size(100);

  let inp4 = createInput(pulsesB.toString());
  inp4.position(5.7*w/12, 2*h/10+50);
  inp4.size(100);

}

function draw() {

  background('#4e5c69');

  fill('#a6c288');
  textSize(40);
  text('1st Track', w/12, h/10);
  textSize(20);
  text('Onsets 1st Track', w/12, h/10+40);
  text('Pulses 1st Track', w/12, h/10+60);
  textSize(40);
  text('2nd Track', 4*w/12, h/10);
  textSize(20);
  text('Onsets 2nd Track', 4*w/12, h/10+40);
  text('Pulses 2nd Track', 4*w/12, h/10+60);

  text('1st Track', 6.5*w/10, h/10);
  text('2nd Track', 6.5*w/10, h/10+20);
  text('3rd Track', 6.5*w/10, h/10+40);
  text('4th Track', 6.5*w/10, h/10+60);


  // ------- Generation of Concentric Circles

  let c = 2*w/8 + 30; // center
  let r = w/8; // radius main circle

  let proportion = 1;                // Relation between concentric circles
  let cl1 = 'rgba(0,52,89,1)';       // color onsets Track 1
  let cl2 = 'rgba(0,52,89,0.3)';     // color pulses Track 1
  let cl3 = 'rgba(170, 52, 89,1)';   // color onsets Track 2
  let cl4 = 'rgba(170, 52, 89,0.3)'; // color pulses Track 2

  // main circle
  proportion = 1;
  TrackCircle(onset_1,pulses_1,proportion, cl1, cl2);
  // second circle
  proportion = 0.7;
  TrackCircle(onset_2,pulses_2,proportion, cl3, cl4);

  function TrackCircle(onset,pulses,proportion,color1,color2) {
    stroke(color1);
    noFill();
    circle(c, c, 2 * r * proportion);
    for (let i = 0; i < pulses; i++) {
      let n_x = c + (proportion * r * cos(i * 2 * PI / pulses));
      let n_y = c + (proportion * r * sin(i * 2 * PI / pulses));

      if (onset[i] == 1) {
        stroke(color1);
        fill(color1);
        circle(n_x, n_y, c / 10);
      } else {
        stroke(color2);
        fill(color2);
        circle(n_x, n_y, c / 10);
      }
    }
  }

}
function start_aud_gui() {
  SynthTypes = [sel1.value(), sel2.value(), sel3.value(), sel4.value()];
  console.log('audio started');
  start_aud();
}

