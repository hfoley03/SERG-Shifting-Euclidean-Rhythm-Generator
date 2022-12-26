//Synths that will play the sound
let synths = []

Tone.Destination.volume.value = -9; // this value is in dB

let main_bpm = 120;
let main_loop_interval = length; // duration of looping
let ready = false; // if ready to play or not

let main_loop = new Tone.Loop(playNotes , main_loop_interval);
let print_loop = new Tone.Loop(() => {
  //console.log("Loop")
} , main_loop_interval);

let pause_flag = false;

//Functions for playing on the browser
//This fnc initializes the Tone Transport and starts the main_loop, added by Eray
function initializeAudio() {
  Tone.start().then(()=>{
    Tone.Transport.bpm.value = main_bpm;
    Tone.Transport.start();
    main_loop.start();
    print_loop.start();
  });
}


//This function creates the synths and sends them to the master, added by Eray
function playNotes() {

  //synths = [];
  time_common_track = Tone.now();
  finalMidiObject.tracks.forEach((track, index) => {

    synth_type = SynthTypes[index];

    if (synth_type == "Membrane") var synth = new Tone.MembraneSynth().toMaster()
    else if (synth_type == "Pluck") var synth = new Tone.PluckSynth().toMaster()
    //create a synth for each track

    synths.push(synth)

    //schedule the events
    track.notes.forEach(note => {
      synth.triggerAttackRelease(note.name, note.duration, time_common_track + note.time + 0.5, note.velocity)
    })

  })
}

// Initializes and starts and stops the audio, called from gui.js
function start_aud() {
  //console.log("pressed")
  if (!ready) {
    initializeAudio();
    ready = true;
  } else {
    // click again to play-button...
    pause_flag = false;
    Tone.Transport.start();
  }
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
