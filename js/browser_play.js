//Synths that will play the sound
let synths = []

let main_bpm;
let main_loop_interval;// duration of looping

let main_loop;
let print_loop;

let pause_flag = false;

let time_instants_to_play = [];

//Functions for playing on the browser


//This function creates the synths and sends them to the master
function playNotes() {

  //synths = [];
  time_common_track = Tone.now();
  finalMidiObject.tracks.forEach((track, index) => {

    synth_type = SynthTypes[index];

    if (synth_type == "MembraneSynth") var synth = new Tone.MembraneSynth().toMaster()
    else if (synth_type == "PluckSynth") var synth = new Tone.PluckSynth().toMaster()
    else if (synth_type == "AMSynth") var synth = new Tone.AMSynth().toMaster()
    else if (synth_type == "DuoSynth") var synth = new Tone.DuoSynth().toMaster()
    else if (synth_type == "FMSynth") var synth = new Tone.FMSynth().toMaster()
    else if (synth_type == "MetalSynth") var synth = new Tone.MetalSynth().toMaster()
    else if (synth_type == "MonoSynth") var synth = new Tone.MonoSynth().toMaster()
    else if (synth_type == "NoiseSynth") var synth = new Tone.NoiseSynth().toMaster()
    else if (synth_type == "PolySynth") var synth = new Tone.PolySynth().toMaster()
    //else if (synth_type == "Sampler") var synth = new Tone.PluckSynth().toMaster()
    //create a synth for each track

    synths.push(synth)
    console.log(synth)
    //schedule the events
    track.notes.forEach(note => {
      time_inst_to_play = time_common_track + note.time + 0.5
      time_instants_to_play.push(time_inst_to_play);
      synth.triggerAttackRelease(note.name, note.duration, time_inst_to_play, note.velocity)
    })

  })
}

// Initializes and starts and stops the audio, called from gui.js
function start_aud() {
  Tone.Destination.volume.value = -9; // this value is in dB
  main_bpm = 120;
  main_loop_interval = length*2; // duration of looping

  main_loop = new Tone.Loop(playNotes , main_loop_interval);
  print_loop = new Tone.Loop(() => {
    console.log("Loop")
  } , main_loop_interval);
  Tone.start().then(()=>{
    Tone.Transport.bpm.value = main_bpm;
    Tone.Transport.start();
    main_loop.start();
    print_loop.start();
  });
}

function stop_aud(){
  Tone.Transport.stop();

  for (var i = 0; i < synths.length; i++) {
    synths[i].context._timeouts.cancel(0);
    //console.log('synths')

    //console.log(synths)
    synths[i].dispose();

  }
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
