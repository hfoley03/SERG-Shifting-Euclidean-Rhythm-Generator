//Synths that will play the sound
let synths = []

let main_loop_interval = 2;// duration of looping

let main_loop = new Tone.Loop(playNotes , main_loop_interval);
let print_loop = new Tone.Loop(() => {console.log("loop")});

let pause_flag = false;

let time_instants_to_play = [];

let synth_counter = 0;

// Channel Strip and Effects

let channel1_vol = -6
let channel2_vol = -6
let channel3_vol = -6
let channel4_vol = -6

const reverb = new Tone.Reverb({
  decay : 4 ,
  preDelay : 0.08,
  wet: 0.4
}).toDestination();
let chorus = new Tone.Chorus({
  frequency : 100.5 ,
  delayTime : 0.5,
  depth : 0.9 ,
  spread : 90}).connect(reverb);
let limiter = new Tone.Limiter(-6).connect(chorus);
let channel1 = new Tone.Channel(-6, 0.5).connect(limiter);
let channel2 = new Tone.Channel(-6, -0.5).connect(limiter);
let channel3 = new Tone.Channel(-6, 0.75).connect(limiter);
let channel4 = new Tone.Channel(-6, -0.75).connect(limiter);

channel1.name = "Channel 1"
channel2.name = "Channel 2"
channel3.name = "Channel 3"
channel4.name = "Channel 4"

let channelStrip = [channel1, channel2, channel3, channel4];


//Functions for playing on the browser


//This function creates the synths and sends them to the master
function playNotes() {
  console.log("Notes Loop")
  finalMidiObject.tracks.forEach((track, index) => {

    //console.log('track name: ' + track.name)
    //console.log('index: ' + index);
    //console.log(channelStrip[index]);
    //console.log(channel1.volume.value)

    synth_type = SynthTypes[index];

    if (synth_type == "PolySynth") var synth = new Tone.PolySynth().connect(channelStrip[index]);
    else if (synth_type == "PluckSynth") var synth = new Tone.PluckSynth().connect(channelStrip[index]);
    /*else if (synth_type == "AMSynth") var synth = new Tone.AMSynth().connect(channelStrip[index]);
    else if (synth_type == "DuoSynth") var synth = new Tone.DuoSynth().connect(channelStrip[index]);
    else if (synth_type == "FMSynth") var synth = new Tone.FMSynth().connect(channelStrip[index]);
    else if (synth_type == "MetalSynth") var synth = new Tone.MetalSynth().connect(channelStrip[index])
    else if (synth_type == "MonoSynth") var synth = new Tone.MonoSynth().connect(channelStrip[index]);
    else if (synth_type == "NoiseSynth") var synth = new Tone.NoiseSynth().connect(channelStrip[index])
    else if (synth_type == "PolySynth") var synth = new Tone.PolySynth().connect(channelStrip[index]);
    //else if (synth_type == "Sampler") var synth = new Tone.PluckSynth().toMaster()
    //create a synth for each track*/

    synths.push(synth)
    console.log(synths)
   // synth_counter = synth_counter + 1
    //console.log("synth counter: " + synth_counter)
    //schedule the events
    time_common_track = Tone.context.currentTime;
    track.notes.forEach(note => {
      time_inst_to_play = time_common_track + note.time + 0.0001;
      time_instants_to_play.push(time_inst_to_play);
      synth.triggerAttackRelease(note.name, note.duration, time_inst_to_play, note.velocity)
    })

  })
}

// Initializes and starts and stops the audio, called from gui.js
function start_aud() {
  state = true;
  Tone.context.resume()
  Tone.Transport.bpm.value = tempo_bpm;
  Tone.Destination.volume.value = -9; // this value is in dB
  main_loop_interval = (120/tempo_bpm)*2*length; // duration of looping
  console.log(main_loop_interval)
  main_loop.interval = main_loop_interval
  console.log(main_loop.interval)
  Tone.start().then(()=>{

    Tone.Transport.start();
    main_loop.start();
    //print_loop.start();
  });
}

function stop_aud(){
  Tone.Transport.stop();
  console.log("stopAud")

  for (var i = 0; i < synths.length; i++) {
    synths[i].context._timeouts.cancel(0);
    synths[i].dispose();
  }
  synths = []
  //console.log(synths)
  state = false;
}

function pause_cont(){

  if (synths.some((x) => x.volume.value > -79)){
    for (var i = 0; i < synths.length; i++) {
      synths[i].volume.value = -89;
      pause_flag = true;
    }
  }
  else {
    for (var i = 0; i < synths.length; i++) {
      synths[i].volume.value = -9;
      pause_flag = false;

    }
  }
}



