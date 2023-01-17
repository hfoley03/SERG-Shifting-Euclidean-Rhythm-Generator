// ------- P5 JS -----
let w;        //windowWidth
let h = 900;  //windowHeight

let clr_bg = '#5a606c';       //Background Color
let clr_tittle = '#A3E7FC';
let clr_subtittle = '#B9E28C';
let clr_txt = '#FFFFFF';   //Color of Text

let cl1 = 'rgba(132, 221, 99,1)';       // color onsets Fixed Circle
let cl2 = 'rgba(132, 221, 99,0.3)';     // color offsets Fixed Circle
let cl3 = 'rgba(203, 255, 77,1)';      // color onsets Shifting Circle
let cl4 = 'rgba(203, 255, 77,0.3)';    // color offsets Shifting Circle
let cl5 = 'rgba(191, 192, 192,0.2)';   // color Visual Fixed

let phase_shift_amount_inp;
let phase_shift_period_inp;
let length_inp;
let tempo_bpm_inp;
let velAmtSlider;
let colorAmtSlider;
let scaleTypeSelect;
let rootNoteSelect;
let box2nd,box3rd,box4th,box5th,box6th,box7th;

let gen_button;
let play_button;
let stop_button;
let tutorial_button;
let state = false;
let tutorial;
let tutorial_state = false;

let All_Synths = ['MonoSynth', 'Kick', 'Snare' ,'Synth','Hihat'];

let synthinps = [];
let onsetsinps = [];

let pulse_durationA, pulse_durationB;
let bar_durationA, bar_durationB;

let first_cycleA = 0;
let first_cycleB = 0;
let normal = 0;
let indexA = 0;
let indexB = 0;
let actualbarA = 0;
let actualbarB = 0;
let proportion_indexA = 0.8;
let proportion_indexB = 0.8;
let indexA_1, indexA_2;
let indexB_1, indexB_2;

let interval_visualA_fixed;
let interval_visualB_fixed;
let interval_visualA_shift;
let interval_visualB_shift;

let Volume1, Volume2, Volume3, Volume4;
let Mute1, Mute2, Mute3, Mute4;
let Solo1, Solo2, Solo3, Solo4;
let Reverb;
let Delay1;
let Delay2;

let alpha1 = 0.5, alpha2 = 0.5, alpha3 = 0.5, alpha4 = 0.5;

let error_message = " ";

let draw_flag = false;

function windowResized() {
  resizeCanvas(windowWidth, h);
}

function setup() {
  createCanvas(windowWidth,h);
  angleMode(DEGREES);

  w = width;
  let gui = createGui();

  tutorial = createGraphics(w, h);
  toggleTutorial();

  // ---- Selection Synth type by the user
  let synth_x = 22.5*w/60+8;
  let synth_y = 11.5*h/60-4;
  for(let i = 1; i<=4; i++){
    let tmp_synth_str = "tr" + i + "_synth";
    let tmp_synth = window[tmp_synth_str];
    tmp_synth = createSelect();
    if(i==1 || i==2){tmp_synth.position(synth_x,synth_y+20*(i-1)+1);}
    if(i==3 || i==4){tmp_synth.position(synth_x+16*w/60,synth_y+20*(i-3)+1);}
    for( let k = 0; k<All_Synths.length;k++){
      tmp_synth.option(All_Synths[k]);
    }
    tmp_synth.selected(All_Synths[0]);
    tmp_synth.size(91);
    tmp_synth.style('color:'+clr_txt);
    tmp_synth.style('background:'+clr_bg);
    synthinps.push(tmp_synth)
  }


  // ----- Inputs of Onsets and Pulses for the Euclidean Rhythm
  let x_onsets = 22.5*w/60+8;
  let y_onsets = 8.5*h/60;
  let onsets_pulses = [onsetsA,pulsesA, onsetsB, pulsesB];
  let onsets_pulses_str = ["onsetsA","pulsesA", "onsetsB", "pulsesB"];

  for(let i = 1; i<=4; i++){
    let tmp_onsets_str = onsets_pulses_str[i-1];
    let tmp_onsets = window[tmp_onsets_str];

    if (i==1 || i==3){
      tmp_onsets = createInput(onsets_pulses[i-1]);
      tmp_onsets.size(32);
      tmp_onsets.style('background:'+clr_bg);
    }
    else{
      tmp_onsets = createSelect();
      tmp_onsets.option(2);tmp_onsets.option(4);
      tmp_onsets.option(8);tmp_onsets.option(16);tmp_onsets.option(32);
      tmp_onsets.size(40)
      tmp_onsets.selected(onsets_pulses[i-1])
    }
    if(i==1 || i==2) {tmp_onsets.position(x_onsets, y_onsets+22*(i-1));}
    else{tmp_onsets.position(x_onsets+16*w/60, y_onsets+22*(i-3));}
    onsetsinps.push(tmp_onsets);
    tmp_onsets.style('color:'+clr_bg);

  }


  // ----- Inputs of lenght of piece, shifting amount and shifting period, Tempo, Root, Scale
  let x_inputs = 26*w/60;
  let x_inputs2 = 37*w/60;
  let y_inputs = 20.5*h/60-3;

  phase_shift_amount_inp = createInput(phaseShiftAmount.toString());
  phase_shift_amount_inp.position(x_inputs,y_inputs);
  phase_shift_amount_inp.size(32);

  phase_shift_period_inp = createInput(phaseShiftPeriod.toString());
  phase_shift_period_inp.position(x_inputs,y_inputs+22);
  phase_shift_period_inp.size(32);

  length_inp = createInput(length.toString());
  length_inp.position(x_inputs,y_inputs+44);
  length_inp.size(32);

  tempo_bpm_inp = createInput(tempo_bpm.toString());
  tempo_bpm_inp.position(x_inputs,y_inputs+66);
  tempo_bpm_inp.size(32);

  velAmtSlider =  createSlider('Velocity Amount Slider', 29*w/60-7, 29*h/60-11,6.5*w/60,w/60,);
  velAmtSlider.setStyle({rounding: 5, trackWidth: 0.1});

  rootNoteSelect = createSelect();
  rootNoteSelect.option("C");rootNoteSelect.option("C#");rootNoteSelect.option("D");rootNoteSelect.option("D#");
  rootNoteSelect.option("E");rootNoteSelect.option("F");rootNoteSelect.option("F#");rootNoteSelect.option("G");
  rootNoteSelect.option("G#");rootNoteSelect.option("A");rootNoteSelect.option("A#");rootNoteSelect.option("B#");
  rootNoteSelect.size(40)
  rootNoteSelect.position(x_inputs2,y_inputs);

  scaleTypeSelect = createSelect();
  scaleTypeSelect.option("Major");scaleTypeSelect.option("Minor");scaleTypeSelect.option("Melodic Minor");
  scaleTypeSelect.size(60)
  scaleTypeSelect.position(x_inputs2,y_inputs+20);

  box2nd = createToggle("2", x_inputs2-7,y_inputs+33, w/60, w/60);
  box2nd.setStyle({
    textSize:w/60,
    rounding: 5,
    fillLabelOn:color('#4E5258'), fillLabelOnHover:color('#4E5258'), fillLabelOnActive:color('#4E5258'),
    fillBgOn:color('rgba(170, 250, 200,1)'),
    fillBgOnHover:color('rgba(170, 250, 200,.5)'),
    fillBgOnActive:color('rgba(170, 250, 200,.3)')});
  box3rd = createToggle("3", x_inputs2+17, y_inputs+33, w/60, w/60);
  box3rd.setStyle({
    textSize:w/60,
    rounding: 5,
    fillLabelOn:color('#4E5258'), fillLabelOnHover:color('#4E5258'), fillLabelOnActive:color('#4E5258'),
    fillBgOn:color('rgba(170, 250, 200,1)'),
    fillBgOnHover:color('rgba(170, 250, 200,.5)'),
    fillBgOnActive:color('rgba(170, 250, 200,.3)')});
  box4th = createToggle("4", x_inputs2+41, y_inputs+33, w/60, w/60);
  box4th.setStyle({
    textSize:w/60,
    rounding: 5,
    fillLabelOn:color('#4E5258'), fillLabelOnHover:color('#4E5258'), fillLabelOnActive:color('#4E5258'),
    fillBgOn:color('rgba(170, 250, 200,1)'),
    fillBgOnHover:color('rgba(170, 250, 200,.5)'),
    fillBgOnActive:color('rgba(170, 250, 200,.3)')});
  box5th = createToggle("5", x_inputs2+65, y_inputs+33, w/60, w/60);
  box5th.setStyle({
    textSize:w/60,
    rounding: 5,
    fillLabelOn:color('#4E5258'), fillLabelOnHover:color('#4E5258'), fillLabelOnActive:color('#4E5258'),
    fillBgOn:color('rgba(170, 250, 200,1)'),
    fillBgOnHover:color('rgba(170, 250, 200,.5)'),
    fillBgOnActive:color('rgba(170, 250, 200,.3)')});
  box6th = createToggle("6", x_inputs2+89, y_inputs+33, w/60, w/60);
  box6th.setStyle({
    textSize:w/60,
    rounding: 5,
    fillLabelOn:color('#4E5258'), fillLabelOnHover:color('#4E5258'), fillLabelOnActive:color('#4E5258'),
    fillBgOn:color('rgba(170, 250, 200,1)'),
    fillBgOnHover:color('rgba(170, 250, 200,.5)'),
    fillBgOnActive:color('rgba(170, 250, 200,.3)')});
  box7th = createToggle("7",x_inputs2+113, y_inputs+33, w/60, w/60);
  box7th.setStyle({
    textSize:w/60,
    rounding: 5,
    fillLabelOn:color('#4E5258'), fillLabelOnHover:color('#4E5258'), fillLabelOnActive:color('#4E5258'),
    fillBgOn:color('rgba(170, 250, 200,1)'),
    fillBgOnHover:color('rgba(170, 250, 200,.5)'),
    fillBgOnActive:color('rgba(170, 250, 200,.3)')});

  colorAmtSlider =  createSlider('Color Amt Slider', x_inputs2-7, y_inputs+57,6.5*w/60,w/60, 1, 0);
  colorAmtSlider.setStyle({rounding: 5, trackWidth: 0.1});


  // --- Get as input the values of the Onsets and Pulses of the Tracks.
  gen_button = createButton('GENERATE', 17*w/60, 33*h/60,6*w/60,2*h/60);
  gen_button.setStyle({
    fillBg:color('#85898F'),
    rounding: 5,
    font:'Bahnschrift',
    textSize: w/60,
    fillLabel:color('#FFFFFF'),
    fillLabelHover:color('#4E5258'),
    fillLabelActive:color('#4E5258'),
    strokeBg:color('#4E5258')
  });

  // ---- Play button
  play_button = createButton('PLAY',27*w/60, 33*h/60,6*w/60,2*h/60);
  play_button.setStyle({
    fillBg:color('#85898F'),
    rounding: 5,
    font:'Bahnschrift', textSize: w/60,
    fillLabel:color('#FFFFFF'), fillLabelHover:color('#4E5258'), fillLabelActive:color('#4E5258'),
    strokeBg:color('#4E5258')
  });

  // ---- Stop button
  stop_button = createButton('STOP',37*w/60, 33*h/60,6*w/60,2*h/60);
  stop_button.setStyle({
    fillBg:color('#85898F'),
    rounding: 5,
    font:'Bahnschrift', textSize: w/60,
    fillLabel:color('#FFFFFF'), fillLabelHover:color('#4E5258'), fillLabelActive:color('#4E5258'),
    strokeBg:color('#4E5258')
  });

  // ---- Volume Sliders
  Volume1 = createSliderV('Volume1', 29.5*w/60, 41.5*h/60, w/60, 6*w/60, -30, 0);
  Volume1.setStyle({rounding: 5, trackWidth: 0.1});
  Volume2 = createSliderV('Volume2', 32*w/60, 41.5*h/60, w/60, 6*w/60, -30, 0);
  Volume2.setStyle({rounding: 5, trackWidth: 0.1});
  Volume3 = createSliderV('Volume3', 34.5*w/60, 41.5*h/60, w/60, 6*w/60, -30, 0);
  Volume3.setStyle({rounding: 5, trackWidth: 0.1});
  Volume4 = createSliderV('Volume4', 37*w/60, 41.5*h/60, w/60, 6*w/60, -30, 0);
  Volume4.setStyle({rounding: 5, trackWidth: 0.1});

  // ---- Mute Selecotors
  Mute1 = createToggle("M", 29.5*w/60, 51*h/60, w/60, w/60);
  Mute1.setStyle({
    textSize:w/60,
    rounding: 5,
    fillLabelOn:color('#FFFFFF'),fillLabelOnHover:color('#FFFFFF'),fillLabelOnActive:color('#FFFFFF'),
    fillBgOn:color('rgba(254, 95, 85,1)'),
    fillBgOnHover:color('rgba(254, 95, 85,.5)'),
    fillBgOnActive:color('rgba(254, 95, 85,.3)')});
  Mute2 = createToggle("M", 32*w/60, 51*h/60, w/60, w/60);
  Mute2.setStyle({
    textSize:w/60,
    rounding: 5,
    fillLabelOn:color('#FFFFFF'),fillLabelOnHover:color('#FFFFFF'),fillLabelOnActive:color('#FFFFFF'),
    fillBgOn:color('rgba(254, 95, 85,1)'),
    fillBgOnHover:color('rgba(254, 95, 85,.5)'),
    fillBgOnActive:color('rgba(254, 95, 85,.3)')});
  Mute3 = createToggle("M", 34.5*w/60, 51*h/60, w/60, w/60);
  Mute3.setStyle({
    textSize:w/60,
    rounding: 5,
    fillLabelOn:color('#FFFFFF'),fillLabelOnHover:color('#FFFFFF'),fillLabelOnActive:color('#FFFFFF'),
    fillBgOn:color('rgba(254, 95, 85,1)'),
    fillBgOnHover:color('rgba(254, 95, 85,.5)'),
    fillBgOnActive:color('rgba(254, 95, 85,.3)')});
  Mute4 = createToggle("M", 37*w/60, 51*h/60, w/60, w/60);
  Mute4.setStyle({
    textSize:w/60,
    rounding: 5,
    fillLabelOn:color('#FFFFFF'),fillLabelOnHover:color('#FFFFFF'),fillLabelOnActive:color('#FFFFFF'),
    fillBgOn:color('rgba(254, 95, 85,1)'),
    fillBgOnHover:color('rgba(254, 95, 85,.5)'),
    fillBgOnActive:color('rgba(254, 95, 85,.3)')});


  // ---- Solo Selectors
  Solo1 = createToggle("S", 29.5*w/60, 53*h/60, w/60, w/60);
  Solo1.setStyle({
    textSize:w/60,
    rounding: 5,
    fillLabelOn:color('#4E5258'), fillLabelOnHover:color('#4E5258'), fillLabelOnActive:color('#4E5258'),
    fillBgOn:color('rgba(170, 250, 200,1)'),
    fillBgOnHover:color('rgba(170, 250, 200,.5)'),
    fillBgOnActive:color('rgba(170, 250, 200,.3)')});
  Solo2 = createToggle("S", 32*w/60, 53*h/60, w/60, w/60);
  Solo2.setStyle({
    textSize:w/60,
    rounding: 5,
    fillLabelOn:color('#4E5258'), fillLabelOnHover:color('#4E5258'), fillLabelOnActive:color('#4E5258'),
    fillBgOn:color('rgba(170, 250, 200,1)'),
    fillBgOnHover:color('rgba(170, 250, 200,.5)'),
    fillBgOnActive:color('rgba(170, 250, 200,.3)')});
  Solo3 = createToggle("S", 34.5*w/60, 53*h/60, w/60, w/60);
  Solo3.setStyle({
    textSize:w/60,
    rounding: 5,
    fillLabelOn:color('#4E5258'), fillLabelOnHover:color('#4E5258'), fillLabelOnActive:color('#4E5258'),
    fillBgOn:color('rgba(170, 250, 200,1)'),
    fillBgOnHover:color('rgba(170, 250, 200,.5)'),
    fillBgOnActive:color('rgba(170, 250, 200,.3)')});
  Solo4 = createToggle("S", 37*w/60, 53*h/60, w/60, w/60);
  Solo4.setStyle({
    textSize:w/60,
    rounding: 5,
    fillLabelOn:color('#4E5258'), fillLabelOnHover:color('#4E5258'), fillLabelOnActive:color('#4E5258'),
    fillBgOn:color('rgba(170, 250, 200,1)'),
    fillBgOnHover:color('rgba(170, 250, 200,.5)'),
    fillBgOnActive:color('rgba(170, 250, 200,.3)')});

  // ---- Effects Sliders
  Reverb = createSlider('Reverb', 22*w/60, 41.5*h/60, 6*w/60, w/60, 0, 1);
  Reverb.setStyle({rounding: 5, trackWidth: 0.1});
  Delay1 = createSlider('Delay1', 22*w/60, 45*h/60, 6*w/60, w/60, 0, 1);
  Delay1.setStyle({rounding: 5, trackWidth: 0.1});
  Delay2 = createSlider('Delay2', 22*w/60, 48.5*h/60, 6*w/60, w/60, 0, 1);
  Delay2.setStyle({rounding: 5, trackWidth: 0.1});

  tutorial_button = createButton("?",54*w/60, 5*h/60,2*w/60,2*h/60);

  initialization();
  checkErrors()
}

function draw() {
  background(clr_bg);
  drawGui();

  //image(tutorial, 0, 0);

  w = width;

  //reposition();

  //console.log('first', first_time_inst_play)
  //console.log(Tone.context.currentTime)

  if(draw_flag == false && first_time_inst_play - 0.4 < Tone.context.currentTime ){
    startTimer();
    console.log('the conditions met')
    draw_flag = true;
  }

  fill(clr_tittle);
  textSize(w*0.04);
  textFont('Bahnschrift');
  textAlign(CENTER);
  text('MIDI EUCLIDEAN RHYTHM GENERATOR', w/2, 2*h/60);

  // ----- First box text
  stroke('#FFD5C2');
  strokeWeight(w*0.003);
  noFill();
  rect(16*w/60,7*h/60,12*w/60,7.5*h/60,5);

  fill(clr_subtittle);
  strokeWeight(0);
  textAlign(CENTER, CENTER);
  textSize(w*0.025);
  text('FIRST SET', 22*w/60, 6*h/60);
  textAlign(RIGHT, CENTER);
  fill(clr_txt);
  textSize(w*0.015);
  let xx1 = 21.5*w/60;
  let yy = 8.5*h/60;
  text('Onsets', xx1, yy);
  text('Pulses', xx1, yy+22);
  text('1st Track', xx1, yy+44);
  text('2nd Track', xx1, yy+66);

  // ----- Second box text
  stroke('#FFD5C2');
  strokeWeight(w*0.003);
  noFill();
  rect(32*w/60,7*h/60,12*w/60,7.5*h/60,5);

  textAlign(CENTER, CENTER);
  textSize(w*0.025);
  fill(clr_subtittle);
  strokeWeight(0);
  text('SECOND SET', 38*w/60, 6*h/60);
  textAlign(RIGHT, CENTER);
  fill(clr_txt);
  textSize(w*0.015);
  let xx2 = 37.5*w/60;
  text('Onsets', xx2, yy);
  text('Pulses', xx2, yy+22);
  text('3rd Track', xx2, yy+44);
  text('4th Track', xx2, yy+66);

  // ----- Third box text
  stroke('#FFD5C2');
  strokeWeight(w*0.003);
  noFill();
  rect(15*w/60,18*h/60,30*w/60,13.5*h/60,5);

  textAlign(CENTER, CENTER);
  textSize(w*0.025);
  fill(clr_subtittle);
  strokeWeight(0);
  text('PARAMETERS', 30*w/60, 17*h/60);
  stroke('#93B7BE');
  strokeWeight(w*0.003);
  noFill();
  rect(16*w/60,19*h/60,13*w/60,7.5*h/60,5);
  textAlign(RIGHT, CENTER);
  fill(clr_txt);
  textSize(w*0.015);
  strokeWeight(0);
  let xx3 = 25*w/60;
  let yy2 = 20.5*h/60;
  text('Phase Shift Amount', xx3, yy2);
  text('Phase Shift Period', xx3, yy2+22);
  text('Piece length', xx3, yy2+44);
  text('Tempo (BPM)', xx3, yy2+66);

  stroke('#9EC5AB');
  strokeWeight(w*0.003);
  noFill();
  rect(31*w/60,19*h/60,13*w/60,7.5*h/60,5);
  textAlign(RIGHT, CENTER);
  fill(clr_txt);
  textSize(w*0.015);
  strokeWeight(0);
  let xx4 = 36.5*w/60;
  text('Root Note', xx4, yy2)
  text('Scale Mode', xx4, yy2+22)
  text('Notes', xx4, yy2+44)
  text('Color Rate', xx4, yy2+66)

  stroke('#D0BCD5');
  strokeWeight(w*0.003);
  noFill();
  rect(23.5*w/60,27.5*h/60,13*w/60,3*h/60,5);
  textAlign(RIGHT, CENTER);
  fill(clr_txt);
  textSize(w*0.015);
  strokeWeight(0);
  text('Velocity', 28*w/60, 29*h/60);

  // ----- Buttons
  if (gen_button.isPressed){
    clear();
    stop_aud();

    let error_flag = checkErrors(); // if true, there are errors

    if (error_flag){
    }
    else{
      phaseShiftAmount = parseInt(phase_shift_amount_inp.value());         // How many pulses is each shift
      phaseShiftPeriod = parseInt(phase_shift_period_inp.value());         // After how many bars does a shift occur
      length = parseInt(length_inp.value());                               // Length of total piece
      onsetsA = parseInt(onsetsinps[0].value());
      pulsesA = parseInt(onsetsinps[1].value());
      onsetsB = parseInt(onsetsinps[2].value());
      pulsesB = parseInt(onsetsinps[3].value());
      tempo_bpm = parseInt(tempo_bpm_inp.value());

      generateMidi(onsetsA, pulsesA, onsetsB, pulsesB, tempo_bpm, scaleTypeSelect.value(), rootNoteSelect.value());
      initialization();
    }
  }
  text(error_message, 12*w/60, 24*w/60 + 70)

  if(play_button.isPressed){
    start_aud_gui();
  }
  if(stop_button.isPressed){
    stop_aud();
  }

  userSelected[1] = box2nd.val
  userSelected[2] = box3rd.val
  userSelected[3] = box4th.val
  userSelected[4] = box5th.val
  userSelected[5] = box6th.val
  userSelected[6] = box7th.val

  if (colorAmtSlider.isChanged) {
    colorAmt = colorAmtSlider.val;
  }

  if (velAmtSlider.isChanged) {
    velAmount = velAmtSlider.val;
    console.log(velAmount)
  }

    // ------- Mixer - Control Volume BOX
  strokeWeight(w*0.003);
  stroke('rgba(135, 143, 155,.5)');
  fill('rgba(135, 143, 155,.5)');
  rect(21*w/60,39*h/60,18*w/60,17*h/60,10);

  textAlign(CENTER, CENTER);
  textSize(w*0.025);
  fill(clr_subtittle);
  strokeWeight(0);
  text('MIXER', 30*w/60, 38*h/60);
  fill('#FFFFFF');
  textSize(w*0.015);
  text('1', 30*w/60, 40.5*h/60);
  text('2', 32.5*w/60, 40.5*h/60);
  text('3', 35*w/60, 40.5*h/60);
  text('4', 37.5*w/60, 40.5*h/60);
  textSize(w*0.015);
  text('Reverb', 25*w/60, 40.5*h/60);
  text('Delay 1/4th', 25*w/60, 44*h/60);
  text('Delay 1/8th', 25*w/60, 47.5*h/60);

  text('Mute', 27*w/60, 51*h/60+12);
  text('Solo', 27*w/60, 53*h/60+12);
  strokeWeight(w*0.003);
  stroke('rgba(135, 143, 155,.8)');
  noFill();
  rect(25.5*w/60,50.5*h/60,13*w/60,4.5*h/60,10);

  if (Volume1.isChanged){
    channel1.volume.value = Math.round(Volume1.val);
    alpha1 = map(Volume1.val,-30,0,0,1);
  }
  if (Volume2.isChanged){
    channel2.volume.value = Math.round(Volume2.val);
    alpha2 = map(Volume2.val,-30,0,0,1);
  }
  if (Volume3.isChanged){
    channel3.volume.value = Math.round(Volume3.val);
    alpha3 = map(Volume3.val,-30,0,0,1);
  }
  if (Volume4.isChanged){
    channel4.volume.value = Math.round(Volume4.val);
    alpha4 = map(Volume4.val,-30,0,0,1);
  }

  channel1.mute = Mute1.val
  channel2.mute = Mute2.val
  channel3.mute = Mute3.val
  channel4.mute = Mute4.val

  channel1.solo = Solo1.val
  channel2.solo = Solo2.val
  channel3.solo = Solo3.val
  channel4.solo = Solo4.val

  if(Reverb.isChanged){reverb.wet.value = Reverb.val}
  if(Delay1.isChanged){feedbackDelay1.wet.value = Delay1.val}
  if(Delay2.isChanged){feedbackDelay2.wet.value = Delay2.val}

  // ------- Generation of Concentric Circles

  // Left Circles Track 1 and 2
  FixedCircle(0);      // Track 1 Fixed Circle
  VisualShift(1);      // Visual Track 2 Shifting circle
  VisualFix(0, pulsesA, cl5);    // Visual Actual pulse playing Track 1-2

  // Right Circles Track 3 and 4
  FixedCircle(2);      // Track 3  Fixed Circle
  VisualShift(3);      // Visual Track 4 Shifting circle
  VisualFix(2, pulsesB, cl5);    // Visual Actual pulse playing Track 3-4

  // ------- Tutorial section
  if(tutorial_button.isPressed){
    toggleTutorial();
  }
}
// ----- Functions for the visuals for the fixed circles  -----

function initialization(){
  pulse_durationA = finalMidiObject.tracks[1].notes[1].duration;
  pulse_durationB = finalMidiObject.tracks[3].notes[1].duration;
  bar_durationA = pulse_durationA*pulsesA;
  bar_durationB = pulse_durationB*pulsesB;

  indexA_1 = -1;
  indexA_2 = 0;
  indexB_1 = -1;
  indexB_2 = 0;
  first_cycleA = 0;
  first_cycleB = 0;
}
function FixedCircle(track) {
  let pulses;
  let onset;
  let x_c;
  let y_c;
  let alpha;
  let r2 = 12*w/60;

  if (track == 0){
    onset= binaryRhythmA;
    pulses = pulsesA;
    x_c = 10*w/60;
    y_c = 47.5*h/60;
    alpha = alpha1;
    noStroke();
    fill(clr_txt);
    for (let i = 0; i < pulses; i++) {
      text(i+1,(x_c*0.7)*cos(-90+(360/pulses)*(i+1/2))+x_c, (x_c*0.7)*sin(-90+(360/pulses)*(i+1/2))+y_c);
    }
  }else if (track == 2){
    onset= binaryRhythmB;
    pulses = pulsesB;
    x_c = 50*w/60;
    y_c = 47.5*h/60;
    alpha = alpha3;
    noStroke();
    fill(clr_txt);
    for (let i = 0; i < pulses; i++) {
      text(i+1,(x_c*0.13)*cos(-90+(360/pulses)*(i+1/2))+x_c, (x_c*0.13)*sin(-90+(360/pulses)*(i+1/2))+y_c);
    }
  }
  cl1 = 'rgba(234, 115, 23,'+alpha+')';       // color onsets Track 1
  cl2 = 'rgba(234, 115, 23,'+alpha*0.3+')';    // color pulses Track 1

  strokeWeight(w*0.002);
  for (let i = 0; i < pulses; i++) {
    if (onset[i] == 1) {
      stroke(clr_bg);
      fill(cl1);
      arc(x_c, y_c, r2, r2, -90+360/pulses*i, -90+360/pulses*(i+1), PIE);
      fill(clr_bg);
      arc(x_c, y_c, r2 - 1.5*w/60, r2 - 1.5*w/60, 0, 360, PIE);
    } else {
      stroke(clr_bg);
      fill(cl2);
      arc(x_c, y_c, r2, r2, -90+360/pulses*i, -90+360/pulses*(i+1), PIE);
      fill(clr_bg);
      arc(x_c, y_c, r2-1.5*w/60, r2-1.5*w/60, 0, 360, PIE);
    }
  }
}
function VisualFix(track, pulses, color){
  let end;
  let start;
  let x_arc;
  let y_arc;

  if (track==0){
    end = map(indexA_2,0,pulses,-90,270);
    start = map(indexA_1,0,pulses,-90,270);
    x_arc = 10*w/60;
    y_arc = 47.5*h/60;
  }else if (track==2){
    end = map(indexB_2,0,pulses,-90,270);
    start = map(indexB_1,0,pulses,-90,270);
    x_arc = 50*w/60;
    y_arc = 47.5*h/60;
  }

  stroke(color);
  strokeWeight(0);
  strokeCap(SQUARE);
  fill(color);

  if((track==0 && !first_cycleA && indexA_1==-1) || (track==2 && !first_cycleB && indexB_1==-1)){
    noStroke();
    noFill();
  }
  if((track==0 && first_cycleA && indexA_1==-1) || (track==2 && first_cycleB && indexB_1==-1)){
    noStroke();
    noFill();
  }
  if ((normal==1 && indexA_1==-1)||(normal==1 && indexB_1==-1)||(first_cycleA && indexA_1==-1)){
    stroke(color);
    strokeWeight(0);
    strokeCap(SQUARE);
    fill(color);
  }
  arc(x_arc,y_arc,12*w/60,12*w/60,start,end);
}
function VisualFixTimingA(){
  indexA++;
  indexA_1++;
  indexA_2++;

  if (indexA == pulsesA+1){
    first_cycleA = 1;
    indexA = 0;
    indexA_1 = -1;
    indexA_2 = 0;
  } else if (indexA == pulsesA+1 && first_cycleA){
    first_cycleA = 0;
    indexA = 0;
    indexA_1 = -1;
    indexA_2 = 0;
  } else if(indexA == pulsesA && !first_cycleA){
    first_cycleA = 0;
    normal = 1;
    indexA = 0;
    indexA_1 = -1;
    indexA_2 = 0;
  }
}
function VisualFixTimingB(){
  indexB++;
  indexB_1++;
  indexB_2++;

  if (indexB == pulsesB+1){
    first_cycleB = 1;
    indexB = 0;
    indexB_1 = -1;
    indexB_2 = 0;
  } else if (indexB == pulsesB+1 && first_cycleB){
    first_cycleB = 0;
    indexB = 0;
    indexB_1 = -1;
    indexB_2 = 0;
  } else if(indexB == pulsesB && !first_cycleB){
    normal = 1;
    indexB = 0;
    indexB_1 = -1;
    indexB_2 = 0;
  }
}

// --------- Functions for the visuals of the shifting ------
function ShuffleCircle(x, y, onset, pulses, prt, color1, color2) {
  let r2 = 12*w/60;
  strokeWeight(w*0.002);

  for (let i = 0; i<pulses; i++) {
    if (onset[i] == 1) {
      stroke(clr_bg);
      fill(color1);
      arc(x, y, prt*r2, prt*r2, -90+360/pulses*i, -90+360/pulses*(i+1), PIE);
      fill(clr_bg);
      arc(x, y, prt*r2-1.5*w/60, prt*r2-1.5*w/60, 0, 360, PIE);
    } else{
      stroke(clr_bg);
      fill(color2);
      arc(x, y, r2 * prt, r2*prt, -90+360/pulses*i, -90+360/pulses*(i+1), PIE);
      fill(clr_bg);
      arc(x, y, prt * r2-1.5*w/60, prt * r2-1.5*w/60, 0, 360, PIE);
    }
  }
}
function VisualShift(track,){
  let pulses;
  let Shift_binary = [];
  let proportion;
  let actualbar;
  let x_c;
  let y_c;
  let aux_onsets = [];
  let alpha;

  if (track == 1){
    pulses = pulsesA;
    proportion = proportion_indexA;
    actualbar = actualbarA;
    x_c = 10*w/60;
    y_c = 47.5*h/60;
    alpha=alpha2;
  }else if (track == 3){
    pulses = pulsesB;
    proportion = proportion_indexB;
    actualbar = actualbarB;
    x_c = 50*w/60;
    y_c = 47.5*h/60;
    alpha=alpha4;
  }

  Shift_binary = GetBinaryShiftedOnset(track);
  //console.log("Track : "+track);
  //console.log("Shift_binary : "+Shift_binary);

  cl3 = 'rgba(254, 198, 1,'+alpha+')';      // color onsets Shifting Circle
  cl4 = 'rgba(254, 198, 1,'+alpha*.3+')';    // color offsets Shifting Circle

  // Divide the binary array in bars to then draw the shifted bar
  if (actualbar <= length){
    for (let i = 0; i < pulses; i++) {
      aux_onsets = Shift_binary.slice(actualbar*pulses, (actualbar+1)*pulses);
    }
    ShuffleCircle(x_c, y_c, aux_onsets, pulses,proportion, cl3, cl4);
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
  //console.log("Time Notes: "+Time_notes_aux)
  //console.log("Total pulses: "+Total_pulses)
  //console.log("pulse_duration: "+pulse_duration)

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
}
function stopTimer(){
    draw_flag = false;
    first_time_inst_play = 9999999999
    clearInterval(interval_visualA_fixed);
    clearInterval(interval_visualB_fixed);
    clearInterval(interval_visualA_shift);
    clearInterval(interval_visualB_shift);
  if (state) {
    normal = 0;
    indexA = 0;
    indexA_1 = -1;
    indexA_2 = 0;
    indexB = 0;
    indexB_1 = -1;
    indexB_2 = 0;
    actualbarA = 0;
    proportion_indexA = 0.8;
    actualbarB = 0;
    proportion_indexB = 0.8;
    first_cycleA = 0;
    first_cycleB = 0;
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
    //Tone.Transport.toggle();
    start_aud();
    //startTimer();
  }
}

function toggleTutorial() {
  if (!tutorial_state) {
    tutorial.background(255, 255, 255, 100);
    tutorial.fill(0,0,0,150);
    tutorial.textSize(10);
    tutorial.textAlign(CENTER,CENTER);
    tutorial.text("This is a play button hihi", w/2, h/2);
    tutorial_state = true;
    console.log('a')
  }
  else{
    tutorial.clear();
    tutorial_state=false;
  }
}

function reposition(){

  // Positioning when resizes

  synth_x = 15 * w / 60 + 10;
  synth_y = 16 * h / 60 + 1;


  for (i = 1; i <= 4; i++) {
    tmp_synth = synthinps[i-1]
    if(i==1 || i ==2) tmp_synth.position(synth_x, synth_y + 20 * (i - 1) + 1);
    if (i == 3 || i == 4) {
      tmp_synth.position(synth_x + 15 * w / 60, synth_y + 20 * (i - 3) + 1);
    }
  }


  let x_onsets = 15*w/60+10;
  let y_onsets = 11*h/60;
  for(let i = 1; i<=4; i++){
    let tmp_onsets = onsetsinps[i-1]

    if(i == 1 || i == 2) {
      tmp_onsets.position(x_onsets, y_onsets + 22 * (i - 1));
    }
    else{
      tmp_onsets.position(x_onsets+15*w/60, y_onsets + 22 * (i - 3));
    }
  }

  let x_inputs = 49*w/60;
  let y_inputs = 13*h/60-2;
  phase_shift_amount_inp.position(x_inputs,y_inputs);

  phase_shift_period_inp.position(x_inputs,y_inputs+22);
  length_inp.position(x_inputs,y_inputs+44);
  tempo_bpm_inp.position(x_inputs,y_inputs+66);
  scaleTypeSelect.position(x_inputs,y_inputs+88);
  rootNoteSelect.position(x_inputs,y_inputs+110);

  gen_button.x = 12*w/60
  gen_button.y = 24*h/60


  play_button.x = 27*w/60
  play_button.y = 24*h/60


  stop_button.x = 42*w/60
  stop_button.y = 24*h/60


  tutorial_button.x = 54*w/60
  tutorial_button.y = 5*h/60


  Volume1.x = 22*w/60
  Volume1.y = 36*h/60

  Volume2.x = 24.5*w/60
  Volume2.y = 36*h/60

  Volume3.x = 27*w/60
  Volume3.y = 36*h/60

  Volume4.x = 29.5*w/60
  Volume4.y = 36*h/60

  Mute1.x = 22*w/60
  Mute1.y = 51*h/60

  Mute2.x = 24.5*w/60
  Mute2.y = 51*h/60

  Mute3.x = 27*w/60
  Mute3.y = 51*h/60

  Mute4.x = 29.5*w/60
  Mute4.y = 51*h/60



  Solo1.x = 22*w/60
  Solo1.y = 54*h/60

  Solo2.x = 24.5*w/60
  Solo2.y = 54*h/60

  Solo3.x = 27*w/60
  Solo3.y = 54*h/60

  Solo4.x = 29.5*w/60
  Solo4.y = 54*h/60


  Reverb.x = 32*w/60
  Reverb.y = 36*h/60


  Delay1.x = 32*w/60
  Delay1.y = 41.5*h/60

  Delay2.x = 32*w/60
  Delay2.y = 41.5*h/60


  box2nd.x = x_inputs
  box2nd.y = y_inputs+132

  box3rd.x = x_inputs + 20
  box3rd.y = y_inputs+132

  box4th.x = x_inputs + 40
  box4th.y = y_inputs+132

  box5th.x = x_inputs + 60
  box5th.y = y_inputs+132

  box6th.x = x_inputs + 80
  box6th.y = y_inputs+132

  box7th.x = x_inputs + 100
  box7th.y = y_inputs+132


  colorAmtSlider.x = x_inputs+100
  colorAmtSlider.y = y_inputs+154
}


function checkErrors(){
  /*
  parseInt(phase_shift_amount_inp.value()) = parseInt(phase_shift_amount_inp.value());         // How many pulses is each shift
  parseInt(phase_shift_period_inp.value()) = parseInt(phase_shift_period_inp.value());         // After how many bars does a shift occur
  length = parseInt(length_inp.value());                               // Length of total piece
  onsetsA = parseInt(onsetsinps[0].value());
  parseInt(onsetsinps[1].value()) = parseInt(onsetsinps[1].value());
  parseInt(onsetsinps[3].value()) = parseInt(onsetsinps[2].value());
  parseInt(onsetsinps[2].value()) = parseInt(onsetsinps[3].value());
  parseInt(onsetsinps[3].value()) = parseInt(tempo_bpm_inp.value());
   */

  error_message = "";
  error_flag = true // if true, errors present
  error_color = "#FE5F55FF";
  if (parseInt(phase_shift_amount_inp.value()) > parseInt(onsetsinps[1].value())){
    error_message += "The phase shift amount, can't be more than number of pulses of the first track.";
    phase_shift_amount_inp.style('background-color', error_color)
  }
  else{
    phase_shift_amount_inp.style('background-color', "white")
  }
  if (parseInt(phase_shift_amount_inp.value()) > parseInt(onsetsinps[2].value())){
    error_message += "The phase shift amount, can't be more than number of pulses of the second track.";
    phase_shift_amount_inp.style('background-color', error_color)
  }
  else{
    phase_shift_amount_inp.style('background-color', "white")
  }
  if (parseInt(phase_shift_period_inp.value()) > parseInt(length_inp.value())) {
    error_message += "The phase shift period can't be more than piece length"
    phase_shift_period_inp.style('background-color', error_color)
  }
  else{
    phase_shift_period_inp.style('background-color', "white")
  }
  if (parseInt(tempo_bpm_inp.value()) < 30) {
    error_message += "The bpm can't be less than 30"
    tempo_bpm_inp.style('background-color', error_color)
  }
  else{
    tempo_bpm_inp.style('background-color', "white")
  }
  if(parseInt(onsetsinps[1].value()) < 1){
    error_message += "Number of pulses should be greater than 0"
    onsetsinps[1].style('background-color', error_color)
  }
  else{
    onsetsinps[1].style('background-color', "white")
  }
  if(parseInt(onsetsinps[2].value()) < 1){
    error_message += "Number of pulses should be greater than 0"
    onsetsinps[3].style('background-color', error_color)
  }
  else{
    onsetsinps[3].style('background-color', "white")
  }
  if(parseInt(onsetsinps[0].value()) < 1){
    error_message += 'Number of onsets should be greater than 0'
    onsetsinps[0].style('background-color', error_color)
  }
  else{
    onsetsinps[0].style('background-color', "white")
  }
  if(parseInt(onsetsinps[3].value()) < 1){
    error_message += "Number of onsets should be greater than 0"
    onsetsinps[2].style('background-color', error_color)
  }
  else{
    onsetsinps[2].style('background-color', "white")
  }
  if(parseInt(onsetsinps[0].value()) > parseInt(onsetsinps[1].value())){
    error_message += "Number of onsets can't be more than number of pulses"
    onsetsinps[0].style('background-color', error_color)
    onsetsinps[1].style('background-color', error_color)
  }
  else{
    onsetsinps[0].style('background-color', "white")
    onsetsinps[1].style('background-color', "white")
  }
  if(parseInt(onsetsinps[3].value()) < parseInt(onsetsinps[2].value())){
    error_message += "Number of onsets can't be more than number of pulses"
    onsetsinps[2].style('background-color', error_color)
    onsetsinps[3].style('background-color', error_color)
  }
  else{
    onsetsinps[2].style('background-color', "white")
    onsetsinps[3].style('background-color', "white")
  }
  if(parseInt(length_inp.value()) < 1){
    error_message += "The piece length should be greater than or equal to 1"
    length_inp.style('background-color', error_color)
  }
  else{
    length_inp.style('background-color', "white")
  }

  console.log(error_message)

  return error_flag;
}
