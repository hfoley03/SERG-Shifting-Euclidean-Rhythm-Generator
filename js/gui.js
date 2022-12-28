// ------- P5 JS -----

let w = window.innerWidth;
let h = window.innerHeight;

let gen_button;
let play_button;
let stop_button;

var x=0;

let All_Synths = ['AMSynth',
  'DuoSynth',
  'FMSynth',
  'MembraneSynth',
  'MetalSynth',
  'MonoSynth',
  'NoiseSynth',
  'PluckSynth',
  'PolySynth',
  'Sampler',
  'Synth']

var bg;

function preload(){
  //bg = loadImage("https://raw.githubusercontent.com/Rabbid76/graphics-snippets/master/resource/texture/background.jpg")
  bg = loadImage("https://cdn.videoplasty.com/animation/merry-christmas-background-and-giftcard-stock-animation-16874-1280x720.jpg")
}
function setup() {
  frameRate(100)
  createCanvas(w,h);


  // --- Get as input the values of the Onsets and Pulses of the Tracks.
  gen_button = createButton('⚡');
  gen_button.position(3.5*w/12, h/3);
  gen_button.style('background-color', '#878F9B');
  gen_button.style('border-color', '#878F9B');
  gen_button.style('border-radius' , 10 + '%');
  gen_button.style('z-index',  100);
  gen_button.mousePressed(function() {
    clear()

    stop_aud();
    phaseShiftAmount = parseInt(phaseShiftAmountInp.value());                   // How many pulses is each shift
    phaseShiftPeriod = parseInt(phaseShiftAmountInp.value());                   // After how many bars does a shift occur
    length = parseInt(lengthInp.value());                            // Length of total piece
    numberOfTracks = parseInt(numberOfTracksInp.value());
    onsetsA = parseInt(inp1.value());
    pulsesA = parseInt(inp2.value());
    onsetsB = parseInt(inp3.value());
    pulsesB = parseInt(inp4.value());
    generateMidi(onsetsA, pulsesA, onsetsB, pulsesB);

    gen_button.style('background-color', '#02139b')
  });

  // ---- Selection of the type of Synth according to the user

  tr1 = createSelect();
  tr1.position(11*w/12,h/10);

  tr2 = createSelect();
  tr2.position(11*w/12,h/10+20);

  tr3 = createSelect();
  tr3.position(11*w/12,h/10+40);

  tr4 = createSelect();
  tr4.position(11*w/12,h/10+60);

  for( i = 0; i<All_Synths.length;i++){
    tr1.option(All_Synths[i]);
    tr2.option(All_Synths[i]);
    tr3.option(All_Synths[i]);
    tr4.option(All_Synths[i]);
  }
  tr1.selected('MembraneSynth');
  tr2.selected('PluckSynth');
  tr3.selected('MembraneSynth');
  tr4.selected('PluckSynth');

  // ---- Play button
  play_button = createButton('&#9654');
  play_button.position(6*w/12, h/3);
  play_button.style('background-color', '#878F9B');
  play_button.style('border-color', '#878F9B');
  play_button.style('border-radius' , 10 + '%');
  play_button.mousePressed(start_aud_gui);

  // ---- Stop button
  stop_button = createButton('&#9982');
  stop_button.position(8*w/12, h/3);
  stop_button.style('background-color', '#878F9B');
  stop_button.style('border-color', '#878F9B');
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

  let phaseShiftAmountInp = createInput(phaseShiftAmount.toString());
  phaseShiftAmountInp.position(1000, 90);
  phaseShiftAmountInp.size(20);

  let phaseShiftPeriodInp = createInput(phaseShiftPeriod.toString());
  phaseShiftPeriodInp.position(1000, 110);
  phaseShiftPeriodInp.size(20);

  let lengthInp = createInput(length.toString());
  lengthInp.position(1000, 130);
  lengthInp.size(20);

  let numberOfTracksInp = createInput(numberOfTracks.toString());
  numberOfTracksInp.position(1000, 150);
  numberOfTracksInp.size(20);

}

function draw() {

  background('#4F5D75');
  //background('#141430')
  //background(bg)
  fill('#FFFFFF');
  textSize(40);
  textFont('Papyrus')

  text('1st Track', w/12, h/10);
  textSize(20);
  text('Onsets 1st Track', w/12, h/10+40);
  text('Pulses 1st Track', w/12, h/10+60);
  textSize(40);
  text('2nd Track', 4*w/12, h/10);
  textSize(20);
  text('Onsets 2nd Track', 4*w/12, h/10+40);
  text('Pulses 2nd Track', 4*w/12, h/10+60);

  text('1st Track', 8.3*w/10, h/10);
  text('2nd Track', 8.3*w/10, h/10+20);
  text('3rd Track', 8.3*w/10, h/10+40);
  text('4th Track', 8.3*w/10, h/10+60);

  text('Phase Shift Amount', 800, 98)
  text('Phase Shift Period', 800, 118)
  text('Piece length', 800, 138)
  text('Number of Tracks', 800, 158)

  // ------- Generation of Concentric Circles

  let c = w/4; // center
  let r = w/8; // radius main circle

  let proportion = 1;                // Relation between concentric circles
  let cl1 = 'rgba(0,52,89,1)';       // color onsets Track 1
  let cl2 = 'rgba(0,52,89,0.3)';     // color pulses Track 1
  let cl3 = 'rgba(170, 52, 89,1)';   // color onsets Track 2
  let cl4 = 'rgba(170, 52, 89,0.3)'; // color pulses Track 2



  // main circle
  proportion = 1;
  TrackCircle(binaryRhythmA,pulsesA,proportion, cl1, cl2);
  // second circle
  proportion = 0.7;
  TrackCircle(binaryRhythmB,pulsesB,proportion, cl3, cl4);

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

  proportion = 1;
  ShuffleCircle(binaryRhythmA,pulsesA,proportion,cl1,cl2)

  proportion = 0.7;
  ShuffleCircle(binaryRhythmB,pulsesB,proportion,cl3,cl4)

  function ShuffleCircle(onset,pulses,prt,color1,color2){
    noStroke();

    let x = 6*h/4;
    let y = w/4;
    let r2 = w/4;

    for(let i = 0; i < pulses; i++) {
      if(onset[i] == 1){
        fill(color1)
        arc(x,y,prt*r2,prt*r2,2*PI*(1-(i+1)/pulses),2*PI*(1-i/pulses),PIE);
        fill('#4F5D75')
        arc(x,y,prt*r2-15,prt*r2-15,0,2*PI,PIE);
      }else{
        fill(color2)
        arc(x,y,r2*prt,r2*prt,2*PI*(1-(i+1)/pulses),2*PI*(1-i/pulses),PIE);
        fill('#4F5D75')
        arc(x,y,prt*r2-15,prt*r2-15,0,2*PI,PIE)
      }
    }
  }
}
function start_aud_gui() {
  SynthTypes = [tr1.value(), tr2.value(), tr3.value(), tr4.value()];
  console.log('audio started');
  start_aud();
}

