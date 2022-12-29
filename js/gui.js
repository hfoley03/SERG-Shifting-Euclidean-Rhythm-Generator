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

let loc_dict = {}
let loc_dict_txt = {}

let onsetsA_loc;
let onsetsB_loc;
let pulsesA_loc;
let pulsesB_loc;
function preload(){
  //bg = loadImage("https://raw.githubusercontent.com/Rabbid76/graphics-snippets/master/resource/texture/background.jpg")
  let bg = loadImage("https://cdn.videoplasty.com/animation/merry-christmas-background-and-giftcard-stock-animation-16874-1280x720.jpg")
}

function setup() {
  frameRate(100)
  createCanvas(w,h);

  // ---- Selection of the type of Synth according to the user
  let synth_x = 9.6*w/12;
  let synth_y = h/11;
  for(let i = 1; i<=4; i++){
    let tmp_synth_str = "tr" + i + "_synth";
    let tmp_synth = window[tmp_synth_str];
    tmp_synth = createSelect();
    tmp_synth.position(synth_x,synth_y+ 20 * (i-1));
    loc_dict[tmp_synth_str+ "_loc"] = [synth_x,synth_y+ 20 * (i-1)]
    for( let k = 0; k<All_Synths.length;k++){
      tmp_synth.option(All_Synths[k]);
    }
    tmp_synth.selected(All_Synths[8]);
  }

  let phase_shift_amount_inp = createInput(phaseShiftAmount.toString());
  let phase_shift_amount_inp_loc = [9.6*w/12, h/11+80];
  loc_dict['phase_shift_amount_inp_loc'] = phase_shift_amount_inp_loc
  phase_shift_amount_inp.position(phase_shift_amount_inp_loc[0],phase_shift_amount_inp_loc[1]);
  phase_shift_amount_inp.size(20);

  let phase_shift_period_inp = createInput(phaseShiftPeriod.toString());
  let phase_shift_period_inp_loc = [phase_shift_amount_inp_loc[0], phase_shift_amount_inp_loc[1]+20];
  loc_dict['phase_shift_period_inp_loc'] = phase_shift_period_inp_loc
  phase_shift_period_inp.position(phase_shift_amount_inp_loc[0],phase_shift_amount_inp_loc[1]+20);
  phase_shift_period_inp.size(20);

  let length_inp = createInput(length.toString());
  let length_inp_loc = [phase_shift_amount_inp_loc[0], phase_shift_amount_inp_loc[1]+40];
  loc_dict['length_inp_loc'] = length_inp_loc
  length_inp.position(length_inp_loc[0],length_inp_loc[1]);
  length_inp.size(20);

  let number_of_tracks_inp = createInput(numberOfTracks.toString());
  let number_of_tracks_inp_loc = [phase_shift_amount_inp_loc[0], phase_shift_amount_inp_loc[1]+60];
  loc_dict['number_of_tracks_inp_loc'] = number_of_tracks_inp_loc
  number_of_tracks_inp.position(number_of_tracks_inp_loc[0],number_of_tracks_inp_loc[1]);
  number_of_tracks_inp.size(20);


// ----- Inputs of the Onsets and Pulses of the Euclidean Rhythm
  let onsetsA_x = 2.6*w/12;
  let onsetsA_x_txt = onsetsA_x/2.6;
  let onsetsA_y = h/10+35;
  let onsetsA_y_txt = onsetsA_y + 5;
  let onsets_pulses = [onsetsA,pulsesA, onsetsB, pulsesB];
  let onsets_pulses_str = ["onsetsA","pulsesA", "onsetsB", "pulsesB"];
  for(let i = 1; i<=4; i++){
    let tmp_onsets_str = onsets_pulses_str[i-1] + "_loc";
    let tmp_onsets_txt_str = onsets_pulses_str[i-1] + "_txt_loc";
    let tmp_onsets = window[tmp_onsets_str];
    tmp_onsets = createInput(onsets_pulses[i-1]);
    if(i == 1 || i == 2) {
      tmp_onsets.position(onsetsA_x, onsetsA_y + 20 * (i - 1));
      loc_dict[tmp_onsets_str] = [onsetsA_x, onsetsA_y + 20 * (i - 1)];
      loc_dict_txt[tmp_onsets_txt_str] = [onsetsA_x_txt, onsetsA_y_txt + 20 * (i - 1)];
    }
    else{
      tmp_onsets.position(onsetsA_x+ 330, onsetsA_y + 20 * (i - 3));
      loc_dict[tmp_onsets_str] = [onsetsA_x + 330, onsetsA_y + 20 * (i - 3)];
      loc_dict_txt[tmp_onsets_txt_str] = [onsetsA_x_txt+330, onsetsA_y_txt + 20 * (i - 3)];

    }
    tmp_onsets.size(100);
  }

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
    phaseShiftAmount = parseInt(phase_shift_amount_inp.value());           // How many pulses is each shift
    phaseShiftPeriod = parseInt(phase_shift_amount_inp.value());           // After how many bars does a shift occur
    length = parseInt(length_inp.value());                               // Length of total piece
    numberOfTracks = parseInt(number_of_tracks_inp.value());
    onsetsA = parseInt(onsetsA_loc.value());
    pulsesA = parseInt(pulsesA_loc.value());
    onsetsB = parseInt(onsetsB_loc.value());
    pulsesB = parseInt(pulsesB_loc.value());
    generateMidi(onsetsA, pulsesA, onsetsB, pulsesB);

    //gen_button.style('background-color', '#02139b')
  });

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

}

function draw() {

  background(cl_bg);

  fill('#FFFFFF');
  textSize(40);
  textFont('Bahnschrift');

  textAlign(CENTER,BASELINE);
  text('MIDI EUCLIDEAN RHYTHM GENERATOR', w/2, h/20);

  textAlign(LEFT,CENTER);
  text('1st Track', loc_dict_txt['onsetsA_txt_loc'][0], loc_dict_txt['onsetsA_txt_loc'][1] - 40);
  textSize(20);
  text('Onsets 1st Track', loc_dict_txt['onsetsA_txt_loc'][0], loc_dict_txt['onsetsA_txt_loc'][1]);
  text('Pulses 1st Track', loc_dict_txt['pulsesA_txt_loc'][0], loc_dict_txt['pulsesA_txt_loc'][1]);
  textSize(40);
  text('2nd Track', loc_dict_txt['onsetsB_txt_loc'][0], loc_dict_txt['onsetsB_txt_loc'][1]-40);
  textSize(20);
  text('Onsets 2nd Track', loc_dict_txt['onsetsB_txt_loc'][0], loc_dict_txt['onsetsB_txt_loc'][1]);
  text('Pulses 2nd Track', loc_dict_txt['pulsesB_txt_loc'][0], loc_dict_txt['pulsesB_txt_loc'][1]);

  loc_dict_txt['tr1_synth_txt_loc'] = [loc_dict["tr1_synth_loc"][0] - 100, loc_dict["tr1_synth_loc"][1]];
  text('1st Track', loc_dict_txt['tr1_synth_txt_loc'][0], loc_dict_txt['tr1_synth_txt_loc'][1]);
  loc_dict_txt['tr2_synth_txt_loc'] = [loc_dict["tr2_synth_loc"][0] - 100, loc_dict["tr2_synth_loc"][1]];
  text('2nd Track', loc_dict_txt['tr2_synth_txt_loc'][0], loc_dict_txt['tr2_synth_txt_loc'][1]);
  loc_dict_txt['tr3_synth_txt_loc'] = [loc_dict["tr3_synth_loc"][0] - 100, loc_dict["tr3_synth_loc"][1]];
  text('3rd Track', loc_dict_txt['tr3_synth_txt_loc'][0], loc_dict_txt['tr3_synth_txt_loc'][1]);
  loc_dict_txt['tr4_synth_txt_loc'] = [loc_dict["tr4_synth_loc"][0] - 100, loc_dict["tr4_synth_loc"][1]];
  text('4th Track', loc_dict_txt['tr4_synth_txt_loc'][0], loc_dict_txt['tr4_synth_txt_loc'][1]);

  loc_dict_txt["phase_shift_amount_inp_loc"] = [loc_dict["phase_shift_amount_inp_loc"][0]-200, loc_dict["phase_shift_amount_inp_loc"][1]];
  text('Phase Shift Amount', loc_dict_txt["phase_shift_amount_inp_loc"][0],loc_dict_txt["phase_shift_amount_inp_loc"][1]);
  loc_dict_txt["phase_shift_period_inp_loc"] = [loc_dict["phase_shift_period_inp_loc"][0]-200, loc_dict["phase_shift_period_inp_loc"][1]];
  text('Phase Shift Period', loc_dict_txt["phase_shift_period_inp_loc"][0],loc_dict_txt["phase_shift_period_inp_loc"][1]);
  loc_dict_txt["length_inp_loc"] = [loc_dict["length_inp_loc"][0]-200, loc_dict["length_inp_loc"][1]];
  text('Piece length', loc_dict_txt["length_inp_loc"][0],loc_dict_txt["length_inp_loc"][1]);
  loc_dict_txt["number_of_tracks_inp_loc"] = [loc_dict["number_of_tracks_inp_loc"][0]-200, loc_dict["number_of_tracks_inp_loc"][1]];
  text('Number of Tracks', loc_dict["number_of_tracks_inp_loc"][0]-200, loc_dict["number_of_tracks_inp_loc"][1]);

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

function mouseHover(){


}

function start_aud_gui() {

  if (state) {
    console.log("state: true")
    console.log("already playing")
  } else if (!state) {
    console.log("state false")
    SynthTypes = [tr1_synth.value(), tr2_synth.value(), tr3_synth.value(), tr4_synth.value()];
    console.log('Call start_aud');
    Tone.Transport.toggle()
    start_aud();
  }

}
