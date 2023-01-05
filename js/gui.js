// ------- P5 JS -----

let w = window.innerWidth;
let h = 1000;

let gen_button;
let play_button;
let stop_button;
let state = false;

let All_Synths = ['AMSynth','DuoSynth','FMSynth','MembraneSynth', 'MetalSynth',
   'MonoSynth', 'NoiseSynth', 'PluckSynth', 'PolySynth', 'Sampler', 'Synth']

let x=0;
let cl_bg = '#4F5D75';

var bg;

function preload(){
  //bg = loadImage("https://raw.githubusercontent.com/Rabbid76/graphics-snippets/master/resource/texture/background.jpg")
  let bg = loadImage("https://cdn.videoplasty.com/animation/merry-christmas-background-and-giftcard-stock-animation-16874-1280x720.jpg")
}

function setup() {
  frameRate(100)
  createCanvas(w,h);


  // --- Get as input the values of the Onsets and Pulses of the Tracks.
  gen_button = createButton('Generate');
  gen_button.position(3.5*w/12, 3.5*h/12);
  gen_button.style('background-color', '#878F9B');
  gen_button.style('color','#FFFFFF');
  gen_button.style('font-family: Bahnschrift');
  gen_button.style('border-color', '#878F9B');
  gen_button.style('border-radius' , 10 + '%');
  gen_button.style('z-index',  100);
  gen_button.mousePressed(function() {
    clear()

    stop_aud();
    phaseShiftAmount = parseInt(phaseShiftAmountInp.value());           // How many pulses is each shift
    phaseShiftPeriod = parseInt(phaseShiftAmountInp.value());           // After how many bars does a shift occur
    length = parseInt(lengthInp.value());                               // Length of total piece
    numberOfTracks = parseInt(numberOfTracksInp.value());
    onsetsA = parseInt(inp1.value());
    pulsesA = parseInt(inp2.value());
    onsetsB = parseInt(inp3.value());
    pulsesB = parseInt(inp4.value());
    tempo_bpm = parseInt(tempoBpmInp.value());
    generateMidi(onsetsA, pulsesA, onsetsB, pulsesB, tempo_bpm);

    //gen_button.style('background-color', '#02139b')
  });


  // ---- Selection of the type of Synth according to the user

  tr1 = createSelect();
  tr1.position(9.6*w/12,h/11);

  tr2 = createSelect();
  tr2.position(9.6*w/12,h/11+20);

  tr3 = createSelect();
  tr3.position(9.6*w/12,h/11+40);

  tr4 = createSelect();
  tr4.position(9.6*w/12,h/11+60);

  for( i = 0; i<All_Synths.length;i++){
    tr1.option(All_Synths[i]);
    tr2.option(All_Synths[i]);
    tr3.option(All_Synths[i]);
    tr4.option(All_Synths[i]);
  }
  tr1.selected('MonoSynth');
  tr2.selected('MonoSynth');
  tr3.selected('MonoSynth');
  tr4.selected('MonoSynth');

  // ---- Play button
  play_button = createButton('&#9658');
  play_button.position(6*w/12, 3.5*h/12);
  play_button.style('background-color', '#878F9B');
  play_button.style('color','#FFFFFF');
  play_button.style('font-family', 'Bahnschrift');
  play_button.style('border-color', '#878F9B');
  play_button.style('border-radius' , 10+'%');
  play_button.mousePressed(start_aud_gui);

  // ---- Stop button
  stop_button = createButton('&#9208');
  stop_button.position(8*w/12, 3.5*h/12);
  stop_button.style('background-color','#878F9B');
  stop_button.style('color','#FFFFFF');
  stop_button.style('font-family','Noto Emoji Regular');
  stop_button.style('border-color','#878F9B');
  stop_button.style('border-radius' , 10+'%');
  stop_button.mousePressed(stop_aud);

// ----- Inputs of the Onsets and Pulses of the Euclidean Rhythm
  let inp1 = createInput(onsetsA.toString());
  inp1.position(2.6*w/12, h/10+35);
  inp1.size(50);

  let inp2 = createInput(pulsesA.toString());
  inp2.position(2.6*w/12, h/10+55);
  inp2.size(50);

  let inp3 = createInput(onsetsB.toString());
  inp3.position(5.7*w/12, h/10+35);
  inp3.size(50);

  let inp4 = createInput(pulsesB.toString());
  inp4.position(5.7*w/12, h/10+55);
  inp4.size(50);

  let phaseShiftAmountInp = createInput(phaseShiftAmount.toString());
  phaseShiftAmountInp.position(9.6*w/12, h/11+80);
  phaseShiftAmountInp.size(30);

  let phaseShiftPeriodInp = createInput(phaseShiftPeriod.toString());
  phaseShiftPeriodInp.position(9.6*w/12, h/11+100);
  phaseShiftPeriodInp.size(30);

  let lengthInp = createInput(length.toString());
  lengthInp.position(9.6*w/12, h/11+120);
  lengthInp.size(30);

  let numberOfTracksInp = createInput(numberOfTracks.toString());
  numberOfTracksInp.position(9.6*w/12, h/11+140);
  numberOfTracksInp.size(30);

  let tempoBpmInp = createInput(tempo_bpm.toString());
  tempoBpmInp.position(9.6*w/12, h/11+160);
  tempoBpmInp.size(30);


  // Mixer Sliders

  track1_vol_slider = createSlider(-36, 0, -36);
  track1_vol_slider.position(10, 100);
  track1_vol_slider.style("transform","rotate(90deg)");



}

function draw() {

  //channel1_vol = track1_vol_slider.value();
  //channel1.volume = channel1_vol;



  background(cl_bg);

  fill('#FFFFFF');
  textSize(40);
  textFont('Bahnschrift');

  textAlign(CENTER,BASELINE);
  text('MIDI EUCLIDEAN RHYTHM GENERATOR', w/2, h/20);

  textAlign(LEFT,CENTER);
  text('1st Track', w/12, h/10);
  textSize(20);
  text('Onsets 1st Track', w/12, h/10+40);
  text('Pulses 1st Track', w/12, h/10+60);
  textSize(40);
  text('2nd Track', 4*w/12, h/10);
  textSize(20);
  text('Onsets 2nd Track', 4*w/12, h/10+40);
  text('Pulses 2nd Track', 4*w/12, h/10+60);

  text('1st Track', 6.5*w/10, h/11);
  text('2nd Track', 6.5*w/10, h/11+20);
  text('3rd Track', 6.5*w/10, h/11+40);
  text('4th Track', 6.5*w/10, h/11+60);
  text('Phase Shift Amount', 6.5*w/10, h/11+80);
  text('Phase Shift Period', 6.5*w/10, h/11+100);
  text('Piece length', 6.5*w/10, h/11+120);
  text('Number of Tracks', 6.5*w/10, h/11+140);
  text('Tempo (BPM)', 6.5*w/10, h/11+160);


  // ------- Generation of Concentric Circles

  let c_x = w/4; // center
  let c_y = 2*h/4; // center
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
    circle(c_x,c_y, 2 * r * proportion);
    for (let i = 0; i < pulses; i++) {
      let n_x = c_x + (proportion * r * cos(i * 2 * PI / pulses));
      let n_y = c_y + (proportion * r * sin(i * 2 * PI / pulses));

      if (onset[i] == 1) {
        stroke(color1);
        fill(color1);
        circle(n_x, n_y, c_x/10);
      } else {
        stroke(color2);
        fill(color2);
        circle(n_x, n_y, c_x/10);
      }
    }
  }

  proportion = 1;
  ShuffleCircle(binaryRhythmA,pulsesA,proportion,cl1,cl2);

  proportion = 0.7;
  ShuffleCircle(binaryRhythmB,pulsesB,proportion,cl3,cl4);

  function ShuffleCircle(onset,pulses,prt,color1,color2){
    noStroke();

    let x = 3*w/4;
    let y = 2*h/4;
    let r2 = w/4;

    for(let i = 0; i < pulses; i++) {
      if(onset[i] == 1){
        stroke(cl_bg);
        fill(color1);
        arc(x,y,prt*r2,prt*r2,2*PI*(1-(i+1)/pulses),2*PI*(1-i/pulses),PIE);
        fill(cl_bg);
        arc(x,y,prt*r2-15,prt*r2-15,0,2*PI,PIE);
      }else{
        stroke(cl_bg);
        fill(color2);
        arc(x,y,r2*prt,r2*prt,2*PI*(1-(i+1)/pulses),2*PI*(1-i/pulses),PIE);
        fill(cl_bg);
        arc(x,y,prt*r2-15,prt*r2-15,0,2*PI,PIE);
      }
    }
  }
}

function start_aud_gui() {

  if(state){
    console.log("state: true, continue playing, dont restart")
  }
  else if(!state){
    console.log("state: false, so start audio and visual")
    SynthTypes = [tr1.value(), tr2.value(), tr3.value(), tr4.value()];
    console.log('Call start_aud');
    Tone.Transport.toggle()
    start_aud();
  }


}

