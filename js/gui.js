// ------- P5 JS -----

let w = window.innerWidth;  //1250
let h = 1000;

let cl_bg = '#4F5D75';  // Background Color

let gen_button;
let play_button;
let stop_button;
let state = false;

let All_Synths = ['AMSynth','DuoSynth','FMSynth','MembraneSynth', 'MetalSynth',
   'MonoSynth', 'NoiseSynth', 'PluckSynth', 'PolySynth', 'Sampler', 'Synth'];

let x=0;

let loc_dict = {}
let loc_dict_txt = {}

let synthinps = [];
let onsetsinps = [];

let pulse_durationA;
let pulse_durationB;
let bar_durationA;
let bar_durationB;

let first_cycleA = 0;
let first_cycleB = 0;
let normal = 0;
let indexA = 0;
let indexB = 0;
let actualbarA = 0;
let actualbarB = 0;
let proportion_indexA = 0.8;
let proportion_indexB = 0.8;
let indexA_1;
let indexA_2;
let indexB_1;
let indexB_2;

let interval_visualA_fixed;
let interval_visualB_fixed;
let interval_visualA_shift;
let interval_visualB_shift;

function windowResized() {
  resizeCanvas(w, h);
}

function setup() {
  windowResized()
  frameRate(100)
  createCanvas(w,h);
  angleMode(DEGREES);

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
    synthinps.push(tmp_synth)
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
    let tmp_onsets_txt_str = onsets_pulses_str[i-1] + "_loc_txt";
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
    onsetsinps.push(tmp_onsets);
  }

  // --- Get as input the values of the Onsets and Pulses of the Tracks.
  gen_button = createButton('Generate');
  gen_button.position(3.5*w/12, 3.5*h/12);
  gen_button.style('background-color', 'rgba(135, 143, 155,.5)');
  gen_button.style('color','#FFFFFF');
  gen_button.style('font-family: Bahnschrift');
  gen_button.style('border-color', 'rgba(135, 143, 155,.25)');
  gen_button.style('border-radius' , 10 + '%');
  gen_button.style('z-index',  100);
  gen_button.mousePressed(function() {
    clear()

    stop_aud();
    phaseShiftAmount = parseInt(phase_shift_amount_inp.value());           // How many pulses is each shift
    phaseShiftPeriod = parseInt(phase_shift_amount_inp.value());           // After how many bars does a shift occur
    length = parseInt(length_inp.value());                               // Length of total piece
    numberOfTracks = parseInt(number_of_tracks_inp.value());
    onsetsA = parseInt(onsetsinps[0].value());
    pulsesA = parseInt(onsetsinps[1].value());
    onsetsB = parseInt(onsetsinps[2].value());
    pulsesB = parseInt(onsetsinps[3].value());
    generateMidi(onsetsA, pulsesA, onsetsB, pulsesB);

  });

  // ---- Play button
  play_button = createButton('&#9658');
  play_button.position(6*w/12, 3.5*h/12);
  play_button.style('background-color', 'rgba(135, 143, 155,.5)');
  play_button.style('color','#FFFFFF');
  play_button.style('font-family', 'Bahnschrift');
  play_button.style('border-color', 'rgba(135, 143, 155,.25)');
  play_button.style('border-radius' , 10+'%');
  play_button.mousePressed(function() {
    start_aud_gui();
    initialization();
  })


  // ---- Stop button
  stop_button = createButton('S');
  stop_button.position(8*w/12, 3.5*h/12);
  stop_button.style('background-color','rgba(135, 143, 155,.5)');
  stop_button.style('color','#FFFFFF');
  stop_button.style('font-family','Bahnschrift');
  stop_button.style('border-color','rgba(135, 143, 155,.25)');
  stop_button.style('border-radius' , 10+'%');
  stop_button.mousePressed(function(){stop_aud()});

  initialization();
  //console.log(finalMidiObject.tracks)
  //console.log("Shift_binary1 : "+GetBinaryShiftedOnset(1));
  //console.log("Shift_binary0 : "+GetBinaryShiftedOnset(0));
}

function draw() {
  background(cl_bg);

  fill('#FFFFFF');
  textSize(40);
  textFont('Bahnschrift');

  textAlign(CENTER, BASELINE);
  text('MIDI EUCLIDEAN RHYTHM GENERATOR', w / 2, h / 20);

  textAlign(LEFT, CENTER);
  text('1st Track', loc_dict_txt['onsetsA_loc_txt'][0], loc_dict_txt['onsetsA_loc_txt'][1] - 40);
  textSize(20);
  text('Onsets 1st Track', loc_dict_txt['onsetsA_loc_txt'][0], loc_dict_txt['onsetsA_loc_txt'][1]);
  text('Pulses 1st Track', loc_dict_txt['pulsesA_loc_txt'][0], loc_dict_txt['pulsesA_loc_txt'][1]);
  textSize(40);
  text('2nd Track', loc_dict_txt['onsetsB_loc_txt'][0], loc_dict_txt['onsetsB_loc_txt'][1] - 40);
  textSize(20);
  text('Onsets 2nd Track', loc_dict_txt['onsetsB_loc_txt'][0], loc_dict_txt['onsetsB_loc_txt'][1]);
  text('Pulses 2nd Track', loc_dict_txt['pulsesB_loc_txt'][0], loc_dict_txt['pulsesB_loc_txt'][1]);

  loc_dict_txt['tr1_synth_loc_txt'] = [loc_dict["tr1_synth_loc"][0] - 100, loc_dict["tr1_synth_loc"][1]];
  text('1st Track', loc_dict_txt['tr1_synth_loc_txt'][0], loc_dict_txt['tr1_synth_loc_txt'][1]);
  loc_dict_txt['tr2_synth_loc_txt'] = [loc_dict["tr2_synth_loc"][0] - 100, loc_dict["tr2_synth_loc"][1]];
  text('2nd Track', loc_dict_txt['tr2_synth_loc_txt'][0], loc_dict_txt['tr2_synth_loc_txt'][1]);
  loc_dict_txt['tr3_synth_loc_txt'] = [loc_dict["tr3_synth_loc"][0] - 100, loc_dict["tr3_synth_loc"][1]];
  text('3rd Track', loc_dict_txt['tr3_synth_loc_txt'][0], loc_dict_txt['tr3_synth_loc_txt'][1]);
  loc_dict_txt['tr4_synth_loc_txt'] = [loc_dict["tr4_synth_loc"][0] - 100, loc_dict["tr4_synth_loc"][1]];
  text('4th Track', loc_dict_txt['tr4_synth_loc_txt'][0], loc_dict_txt['tr4_synth_loc_txt'][1]);

  loc_dict_txt["phase_shift_amount_inp_loc_txt"] = [loc_dict["phase_shift_amount_inp_loc"][0] - 200, loc_dict["phase_shift_amount_inp_loc"][1]];
  text('Phase Shift Amount', loc_dict_txt["phase_shift_amount_inp_loc_txt"][0], loc_dict_txt["phase_shift_amount_inp_loc_txt"][1]);
  loc_dict_txt["phase_shift_period_inp_loc_txt"] = [loc_dict["phase_shift_period_inp_loc"][0] - 200, loc_dict["phase_shift_period_inp_loc"][1]];
  text('Phase Shift Period', loc_dict_txt["phase_shift_period_inp_loc_txt"][0], loc_dict_txt["phase_shift_period_inp_loc_txt"][1]);
  loc_dict_txt["length_inp_loc_txt"] = [loc_dict["length_inp_loc"][0] - 200, loc_dict["length_inp_loc"][1]];
  text('Piece length', loc_dict_txt["length_inp_loc_txt"][0], loc_dict_txt["length_inp_loc_txt"][1]);
  loc_dict_txt["number_of_tracks_inp_loc_txt"] = [loc_dict["number_of_tracks_inp_loc"][0] - 200, loc_dict["number_of_tracks_inp_loc"][1]];
  text('Number of Tracks', loc_dict_txt["number_of_tracks_inp_loc_txt"][0], loc_dict_txt["number_of_tracks_inp_loc_txt"][1]);

  // ------- Generation of Concentric Circles

  let cl1 = 'rgba(0,52,89,1)';       // color onsets Track 1
  let cl2 = 'rgba(0,52,89,0.3)';     // color pulses Track 1
  let cl3 = 'rgba(170, 52, 89,1)';   // color onsets Track 2
  let cl4 = 'rgba(170, 52, 89,0.3)'; // color pulses Track 2
  let cl5 = 'rgba(0, 52, 89,0.2)'; // color pulses Track 2

  // top-left
  FixedCircle(2*w/6, 3*h/6, binaryRhythmA, pulsesA, cl1, cl2);      // Track 1 Fixed Circle
  VisualShift(1, cl3, cl4);                                         // Visual Track 2 Shifting circle
  VisualFix(0, pulsesA, cl5);                                        // Visual Actual pulse playing Track 1-2

  // Top-right
  FixedCircle(4*w/6, 3*h/6, binaryRhythmB, pulsesB, cl1, cl2);      // Track 3  Fixed Circle
  VisualShift(3, cl3, cl4);                                         // Visual Track 4 Shifting circle
  VisualFix(2, pulsesB, cl5);                                        // Visual Actual pulse playing Track 3-4
}
// ----- Functions for the visuals for the fixed circles  -----

function initialization(){
  pulse_durationA = finalMidiObject.tracks[1].notes[1].duration;
  pulse_durationB = finalMidiObject.tracks[3].notes[1].duration;
  bar_durationA = pulse_durationA*pulsesA;
  bar_durationB = pulse_durationB*pulsesB;

  indexA_1 = pulsesA+1;
  indexA_2 = pulsesA;
  indexB_1 = pulsesB+1;
  indexB_2 = pulsesB;
}

function FixedCircle(x, y, onset, pulses, color1, color2) {
  let r2 = w/4;
  strokeWeight(4);

  for (let i = 0; i < pulses; i++) {
    if (onset[i] == 1) {
      stroke(cl_bg);
      fill(color1);
      arc(x, y, r2, r2, 360*(1-(i+1)/pulses), 360*(1-i/pulses), PIE);
      fill(cl_bg);
      arc(x, y, r2 - 25, r2 - 25, 0, 360, PIE);
    } else {
      stroke(cl_bg);
      fill(color2);
      arc(x, y, r2, r2, 360*(1-(i+1)/pulses), 360*(1-i/pulses), PIE);
      fill(cl_bg);
      arc(x, y, r2-25, r2-25, 0, 360, PIE);
    }
  }
}
function VisualFix(track, pulses, color){
  let end;
  let start;
  let x_arc;
  let y_arc;

  if (track==0){
    end = map(indexA_1,0,pulses,0,360);
    start = map(indexA_2,0,pulses,0,360);
    x_arc = 2*w/6;
    y_arc = 3*h/6;
  }else if (track==2){
    end = map(indexB_1,0,pulses,0,360);
    start = map(indexB_2,0,pulses,0,360);
    x_arc = 4*w/6;
    y_arc = 3*h/6;
  }

  stroke(color);
  strokeWeight(0);
  strokeCap(SQUARE);
  fill(color);

  if((!first_cycleA && indexA_1==pulsesA+1) && (!first_cycleB && indexB_1==pulsesB+1)){
    noStroke();
    noFill();
  }
  if (normal==1 && indexA_1==pulsesA+1){
    stroke(color);
    strokeWeight(0);
    strokeCap(SQUARE);
    fill(color);
  }
  arc(x_arc,y_arc,w/4-4,w/4-4,start,end);
}
function VisualFixTimingA(){
  indexA++;
  indexA_1--;
  indexA_2--;

  if (indexA == pulsesA+1){
    first_cycleA = 1;
    indexA = 0;
    indexA_1 = pulsesA;
    indexA_2 = pulsesA-1;
  } else if (indexA == pulsesA+1 && first_cycleA){
    first_cycleA = 0;
    indexA = 0;
    indexA_1 = pulsesA;
    indexA_2 = pulsesA-1;
  } else if(indexA == pulsesA && !first_cycleA){
    normal = 1;
    indexA = 0;
    indexA_1 = pulsesA+1;
    indexA_2 = pulsesA;
  }
}
function VisualFixTimingB(){
  indexB++;
  indexB_1--;
  indexB_2--;

  if (indexB == pulsesB+1){
    first_cycleB = 1;
    indexB = 0;
    indexB_1 = pulsesB;
    indexB_2 = pulsesB-1;
  } else if (indexB == pulsesB+1 && first_cycleB){
    first_cycleB = 0;
    indexB = 0;
    indexB_1 = pulsesB;
    indexB_2 = pulsesB-1;
  } else if(indexB == pulsesB && !first_cycleB){
    normal = 1;
    indexB = 0;
    indexB_1 = pulsesB+1;
    indexB_2 = pulsesB;
  }
}

// --------- Functions for the visuals of the shifting ------
function ShuffleCircle(x, y, onset, pulses, prt, color1, color2) {
  let r2 = w / 4;
  strokeWeight(1);

  for (let i = 0; i<pulses; i++) {
    if (onset[i] == 1) {
      stroke(cl_bg);
      fill(color1);
      arc(x, y, prt*r2, prt*r2, 360*(1-(i+1)/pulses), 360*(1-i/pulses), PIE);
      fill(cl_bg);
      arc(x, y, prt*r2-15, prt*r2-15, 0, 360, PIE);
    } else{
      stroke(cl_bg);
      fill(color2);
      arc(x, y, r2 * prt, r2 * prt, 360 * (1 - (i + 1) / pulses), 360 * (1 - i / pulses), PIE);
      fill(cl_bg);
      arc(x, y, prt * r2 - 15, prt * r2 - 15, 0, 360, PIE);
    }
  }
}
function VisualShift(track,color1, color2){

  let pulses;
  let Shift_binary = [];
  let proportion;
  let actualbar;

  let x_c;
  let y_c;
  let aux_onsets = [];

  if (track == 1){
    pulses = pulsesA;
    proportion = proportion_indexA;
    actualbar = actualbarA;
    x_c = 2*w/6;
    y_c = 3*h/6;
  }else if (track == 3){
    pulses = pulsesB;
    proportion = proportion_indexB;
    actualbar = actualbarB;
    x_c = 4*w/6;
    y_c = 3*h/6;
  }

  Shift_binary = GetBinaryShiftedOnset(track);
  console.log("Track : "+track);
  console.log("Shift_binary : "+Shift_binary);

  // Divide the binary array in bars to then draw the shifted bar
  if (actualbar <= length){
    for (let i = 0; i < pulses; i++) {
      aux_onsets = Shift_binary.slice(actualbar*pulses, (actualbar+1)*pulses);
    }
    ShuffleCircle(x_c, y_c, aux_onsets, pulses,proportion , color1, color2);
  }
}
function GetBinaryShiftedOnset(track){
  let pulses
  let pulse_duration;
  let Total_pulses;
  let Time_notes_aux = [];
  let TNA;
  let t_aux = 0;
  let Time_index = 0;
  let Shift_binary = [];

  if (track == 1){
    pulses = pulsesA;
    pulse_duration = pulse_durationA;
    Total_pulses = pulses*length;
  }
  if(track == 3){
    pulses = pulsesB;
    pulse_duration = pulse_durationB;
    Total_pulses = pulses*length;
  }

  finalMidiObject.tracks[track].notes.forEach((note,index) => {
    Time_notes_aux[index] = note.time;
  })

  //console.log("Track: "+track)
  console.log("Time Notes: "+Time_notes_aux)
  console.log("Total pulses: "+Total_pulses)
  console.log("pulse_duration: "+pulse_duration)

  //Cycle to compare the times of the Onsets to set the full binary array of the Track
  for(let n=0;n<Total_pulses;n++){

    TNA = Time_notes_aux[t_aux];
    //console.log("n: "+n)
    //console.log("t_aux: "+t_aux)
    //console.log("Time Index : "+Time_index)
    //console.log("Time Notes Aux : "+TNA.toFixed(4))

    if(TNA.toFixed(4) == Time_index.toFixed(4)){
      Shift_binary[n] = 1;
      t_aux++;
      Time_index=Time_index+pulse_duration;
    }else{
      Shift_binary[n] = 0;
      Time_index = Time_index+pulse_duration;
    }
    if(t_aux == Time_notes_aux.length){
      t_aux = t_aux-1;
    }
    //console.log("Shift_binary[n]: "+Shift_binary[n])
  }
  return Shift_binary
}

function VisualShiftTimingA(){
  actualbarA++;
  if(actualbarA == length){
    actualbarA = 0;
  }
  proportion_indexA = proportion_indexA - 0.2;
  if (proportion_indexA < 0.4){
    proportion_indexA = 0.8;
  }
}
function VisualShiftTimingB(){
  actualbarB++;
  if(actualbarB == length){
    actualbarB = 0;
  }

  proportion_indexB = proportion_indexB - 0.2;
  if (proportion_indexB < 0.4){
    proportion_indexB = 0.8;
  }
}

function startTimer(){
    interval_visualA_fixed = setInterval(VisualFixTimingA,pulse_durationA*1000);
    interval_visualB_fixed = setInterval(VisualFixTimingB,pulse_durationB*1000);
    interval_visualA_shift = setInterval(VisualShiftTimingA,bar_durationA*1000);
    interval_visualB_shift = setInterval(VisualShiftTimingB,bar_durationB*1000);
  if (state) {
    normal = 0;
    indexA = 0;
    indexA_1 = pulsesA+1;
    indexA_2 = pulsesA;
    indexB = 0;
    indexB_1 = pulsesB+1;
    indexB_2 = pulsesB;
    actualbarA = 0;
    proportion_indexA = 0.8;
    actualbarB = 0;
    proportion_indexB = 0.8;

  }
}
function stopTimer(){
    clearInterval(interval_visualA_fixed);
    clearInterval(interval_visualB_fixed);
    clearInterval(interval_visualA_shift);
    clearInterval(interval_visualB_shift);
  if (state) {
    normal = 0;
    indexA = 0;
    indexA_1 = pulsesA+1;
    indexA_2 = pulsesA;
    indexB = 0;
    indexB_1 = pulsesB+1;
    indexB_2 = pulsesB;
  }
}
function start_aud_gui() {
  if (state) {
    //console.log("state: true")
    //console.log("already playing")
  } else if (!state) {
    //console.log("state false")
    SynthTypes = [synthinps[0].value(), synthinps[1].value(), synthinps[2].value(), synthinps[3].value()];
    //console.log('Call start_aud');
    Tone.Transport.toggle()
    start_aud();
    startTimer();
  }
}

