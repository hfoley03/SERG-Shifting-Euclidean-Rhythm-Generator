//Synths that will play the sound
let synths = []
let main_loop_interval = 2;// duration of looping
let main_loop = new Tone.Loop(playNotes , main_loop_interval);

let pause_flag = false;

let time_instants_to_play = [];

let synth_counter = 0;

var bufferkick = new Tone.Buffer("https://audio.jukehost.co.uk/mazfEsXSvszmtRHKw3p3jRZtWyTsVt9H")
var buffersnare = new Tone.Buffer("https://audio.jukehost.co.uk/0v0XCCA6hcBRKPxqXZ5Xr0hOZ5AcvxcF")
var bufferhihat = new Tone.Buffer("https://audio.jukehost.co.uk/Z3t7DblT22VAC0dDnHGq4gEBEczuFf1m")

var playNotesCount = 0;

let volume1 = -6;
let volume2 = -6;
let volume3 = -6;
let volume4 = -6;

let reverbWet = 0.3;
let delay1Wet = 0.0;
let delay2Wet = 0.0;

const reverb = new Tone.Reverb({
  decay : 3 ,
  preDelay : 0.08,
  wet: reverbWet
}).toDestination();

const feedbackDelay2 = new Tone.PingPongDelay({
  delayTime : "4n",
  feedback : 0.2,
  wet: delay2Wet
}).connect(reverb);

const feedbackDelay1 = new Tone.FeedbackDelay({
  delayTime : "8n" ,
  feedback : 0.2,
  wet: delay1Wet
}).connect(feedbackDelay2);

let chorus = new Tone.Chorus({
  frequency : 100.5 ,
  delayTime : 0.5,
  depth : 0.1 ,
  spread : 90}).connect(feedbackDelay1);

let limiter = new Tone.Limiter(-2).connect(chorus);
let channel1 = new Tone.Channel(volume1, 0.5).connect(limiter);
let channel2 = new Tone.Channel(volume2, -0.5).connect(limiter);
let channel3 = new Tone.Channel(volume3, 0.75).connect(limiter);
let channel4 = new Tone.Channel(volume4, -0.75).connect(limiter);

channel1.name = "Channel 1"
channel2.name = "Channel 2"
channel3.name = "Channel 3"
channel4.name = "Channel 4"

let channelStrip = [channel1, channel2, channel3, channel4];

//Functions for playing on the browser

//This function creates the synths and sends them to the master
function playNotes() {

  if (playNotesCount==0){
    time_common_track  = Tone.context.currentTime + 2;
    playNotesCount += 1;
  }
  else {
    last_track_note_duration = finalMidiObject.tracks[0].notes[0].duration;
    time_common_track = time_common_track + last_track_note_duration * pulsesA * length;
  }
  console.log(time_common_track)

  finalMidiObject.tracks.forEach((track, index) => {

    console.log(channelStrip[index]);
    synth_type = SynthTypes[index];

    if (synth_type == "MonoSynth") {
      var synth = new Tone.MonoSynth().connect(channelStrip[index]);
      synth.envelope.attack = 0.001
      synth.envelope.attackCurve = 'step'
      synth.envelope.decay = 0.1
      synth.envelope.release = 0.02
      synth.envelope.sustain  = 0.1
      synth.filterEnvelope.attack = 0.001
      synth.filterEnvelope.attackCurve = 'step'
      synth.filterEnvelope.decay = 0.5
      synth.filterEnvelope.release = 0.5
      synth.filterEnvelope.sustain  = 0.5
    }
    else if (synth_type == "Kick") {
      var synth = new Tone.Player(bufferkick).connect(channelStrip[index]);
    }
    else if (synth_type == "Snare") {
      var synth = new Tone.Player(buffersnare).connect(channelStrip[index]);
    }
    else if (synth_type == "Hihat") {
      var synth = new Tone.Player(bufferhihat).connect(channelStrip[index]);
    }

    //create a synth for each track
    console.log(synth)
    synths.push(synth)
    //console.log(synths)
    synth_counter = synth_counter + 1
    //console.log("synth counter: " + synth_counter)
    //schedule the events
    if (synth_type == "MonoSynth"){
      track.notes.forEach(note => {
        time_inst_to_play = time_common_track + note.time + 0.0001
        time_instants_to_play.push(time_inst_to_play);
        synth.triggerAttackRelease(note.name, note.duration, time_inst_to_play, note.velocity)
        //console.log(time_inst_to_play);
      })
    }else{
      Tone.loaded().then(() => {
        track.notes.forEach(note => {
          time_inst_to_play = time_common_track + note.time + 0.0001
          time_instants_to_play.push(time_inst_to_play);
          synth.start( time_inst_to_play, 0, note.duration, note.velocity)
        })
      });
    }
    //for(let i = 0; i<time_instants_to_play.length-1;i++){console.log(time_instants_to_play[i+1]-time_instants_to_play[i])}
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

  });
}

function stop_aud(){
  playNotesCount= 0;
  Tone.Transport.stop();
  console.log("stopAud")
  stopTimer()
  for (var i = 0; i < synths.length; i++) {
    synths[i].context._timeouts.cancel(0);
    synths[i].dispose();
  }
  synths = []
  state = false;
}
