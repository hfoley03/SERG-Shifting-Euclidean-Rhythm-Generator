//Synths that will play the sound
let synths = []

let main_loop_interval = 2;// duration of looping

let main_loop = new Tone.Loop(playNotes , main_loop_interval);
let print_loop = new Tone.Loop(() => {console.log("loop")});

let pause_flag = false;

let time_instants_to_play = [];

let synth_counter = 0;

// Channel Strip and Effects

let channel1_vol = -4
let channel2_vol = -4
let channel3_vol = -4
let channel4_vol = -4

const reverb = new Tone.Reverb({
  decay : 4 ,
  preDelay : 0.08,
  wet: 0.4
}).toDestination();

const feedbackDelay2 = new Tone.PingPongDelay({
  delayTime : "4n",
  feedback : 0.2,
  wet: 0.0
}).connect(reverb);

const feedbackDelay1 = new Tone.FeedbackDelay({
  delayTime : "8n" ,
  feedback : 0.2,
  wet: 0.0
}).connect(feedbackDelay2);

let chorus = new Tone.Chorus({
  frequency : 100.5 ,
  delayTime : 0.5,
  depth : 0.9 ,
  spread : 90}).connect(feedbackDelay1);
let limiter = new Tone.Limiter(0).connect(chorus);
let channel1 = new Tone.Channel(-1, 0.5).connect(limiter);
let channel2 = new Tone.Channel(-1, -0.5).connect(limiter);
let channel3 = new Tone.Channel(-1, 0.75).connect(limiter);
let channel4 = new Tone.Channel(-1, -0.75).connect(limiter);

channel1.name = "Channel 1"
channel2.name = "Channel 2"
channel3.name = "Channel 3"
channel4.name = "Channel 4"

let channelStrip = [channel1, channel2, channel3, channel4];


//Functions for playing on the browser


//This function creates the synths and sends them to the master
function playNotes() {
  console.log("Notes Loop")
  time_common_track = Tone.context.currentTime + 2;

  finalMidiObject.tracks.forEach((track, index) => {

    //console.log('track name: ' + track.name)
    //console.log('index: ' + index);
    //console.log(channelStrip[index]);
    //console.log(channel1.volume.value)

    synth_type = SynthTypes[index];

    //if (synth_type == "MonoSynth") var synth = new Tone.MonoSynth().connect(channelStrip[index]);


    var synth = new Tone.MonoSynth().connect(channelStrip[index]);

    synths.push(synth)
    console.log(synths)
    synth.envelope.attack = 0.001
    synth.envelope.attackCurve = 'step'
    synth.envelope.decay = 0.1
    synth.envelope.release = 0.02
    synth.envelope.sustain  = 0.1


    //schedule the events
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



