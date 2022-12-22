//Synths that will play the sound
const synths = []

Tone.Destination.volume.value = -9; // this value is in dB

let main_bpm = 60;
let main_loop_interval = length; // duration of looping
let ready = false; // if ready to play or not


document.getElementById("play-button").addEventListener("click", function() {
  console.log("pressed")
  if (!ready) {
    initializeAudio();
    ready = true;
  } else {
    // click again to play-button...
    if (Tone.Transport.state === "stopped") Tone.Transport.start();
    else if (Tone.Transport.state === "started") {
      Tone.Transport.stop()

      for(var i=0;i<synths.length;i++){
        synths[i].context._timeouts.cancel(0);
        synths[i].dispose();
      }
    }

  }
});


let main_loop = new Tone.Loop(playNotes , main_loop_interval);
let print_loop = new Tone.Loop(() => {
  console.log("Loop")
} , main_loop_interval);


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
  var synth_ct = 0;
  finalMidiObject.tracks.forEach(track => {
    //create a synth for each track

    if(synth_ct % 2 == 0) {
      console.log(synth_ct%2)
      var synth = new Tone.PluckSynth(Tone.Synth, {
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: 1
        }
      }).toMaster()


    }else {
      var synth = new Tone.MembraneSynth(Tone.Synth, {
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: 1
        }
      }).toMaster()
    }
    synth_ct += 1;


    synths.push(synth)
    //schedule the events

    track.notes.forEach(note => {
      synth.triggerAttackRelease(note.name, note.duration, note.time + Tone.now(), note.velocity)
    })

  })
}
