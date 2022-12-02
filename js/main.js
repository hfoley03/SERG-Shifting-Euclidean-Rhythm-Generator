import Midi from "@tonejs/midi";
import fs from 'fs';

let onsets = 3                              // How many hits
let pulses = 8                              // How many steps, 4,8 or 16
let phaseShiftAmount = 1;                   // How many pulses is each shift
let phaseShiftPeriod = 1;                   // After how many bars does a shift occur
let length = 16;                            // Length of total piece
let numberOfTracks = 2;                     // Number of tracks/players
let mode = 1;                               // Play mode (not used)
let scale = ['F', 'G']                      // Used to add 4th and 5th note of C (see function pitch())
let midiInProgress = new Midi.Midi()        // Midi object
midiInProgress.name = "My Bloody Nightmare"
let track1 = midiInProgress.addTrack()      // track/player 1, no shifting, base rhythm
track1.name = "track1"
let track2 = midiInProgress.addTrack()      // track/player 2, shifting occurs
track2.name = "track2"
let oneBarInTicks =midiInProgress.header.ppq*4 //length of a bar in ticks, normally 1920
let pulseInTicks = (oneBarInTicks)/pulses;     //length of one pulse in ticks,normally for a 1/16th note = 120

// Create binary euclidean rhythm
let binaryRhythm = euclidianPattern(onsets, pulses)
// Convert into Midi object
let midiObject = binaryRhythmToMidi(binaryRhythm, midiInProgress, pulseInTicks)
// Creates full composition, with phase shifts
let finalMidiObject = phaseAndCompose(midiObject, onsets, pulses, pulseInTicks,  phaseShiftAmount, phaseShiftPeriod, length, numberOfTracks, mode)
// Write midi object to a midi file
fs.writeFileSync("temp4.mid", new Buffer(finalMidiObject.toArray()))




/////////////////////
/// FUNCTIONS :) ////
/////////////////////

// takes onsets (hits) pulses (tatum/steps)
// returns a string version of the rhythm eg 10010010
function euclidianPattern(onsets, pulses) {
  let U = new Array(pulses - onsets).fill([0]);
  let A = new Array(onsets).fill([1]);
  let B = [];

  while (U.length > 1) {
    let ca = A.length;
    let uc = U.length;
    let i = 0;
    while ((ca > 0) && (uc > 0)) {
      B[i] = A[i].concat(U[i]);
      ca = ca - 1;
      uc = uc - 1;
      i = i + 1;
    }
    U = U.slice(i);
    if (uc < ca) {
      U = A.slice(i, A.length);
    }
    A = B;
    B = [];
  }
  let output = A.join().replaceAll(',', '');
  if (U[0]) {
    output = (A.join() + U[0].toString()).replaceAll(',', '');
  }
  console.log("Binary Rhthtm: " + output)
  //console.log("Binary Rhthtm: " + output.length)
  return output
}


// function takes a string in the format 10101010 and creates a midi object of that rhythm
// will only work as expected for onsets 2,4,8,16
function binaryRhythmToMidi(binaryRhythm, midiInProgress, pulseInTicks){
  let track1 = midiInProgress.tracks[0]
  let track2 = midiInProgress.tracks[1]
  for ( let i = 0; i < binaryRhythm.length; i++)
  {
    if (binaryRhythm[i]==1){
      createNote(track1, (i * pulseInTicks))
      createNote(track2, (i * pulseInTicks))
    }
  }
  //console.log(midiInProgress.tracks[0].notes)
  return midiInProgress
}

// function takes a midi object containing two tracks with each track of length 1 bar
// creates full "composition" by extending these tracks, track 1 with no shifting (base rhythm), track 2 with shifting
function phaseAndCompose(midiInProgress, onsets, pulses, pulseInTicks,phaseShiftAmount, phaseShiftPeriod,length, numberOfTracks, mode){
  console.log("Phase and Compose")
  let track1_ = midiInProgress.tracks[0]
  let track2_ = midiInProgress.tracks[1]
  var players = [track1_, track2_]
  for(var t in players){
    console.log(players[t])
  }
  for(var t in players) {
    for (let barNumber = 0; barNumber < length; barNumber++) {   // For each bar in the total length of composition
      console.log("bar no.: " + barNumber)
      if (barNumber > 0) { // Make next bar

        //Create an array of the ticks of the previous bar
        //REFACTOR?
        var previousBar = players[t].notes.slice(((barNumber - 1) * onsets), ((barNumber - 1) * onsets) + (onsets))
        const previousBarTicks = Array()
        for (let x = 0; x < previousBar.length; x++) {
          previousBarTicks.push(previousBar[x].ticks)
        }
        console.log(previousBarTicks)
        if ((barNumber % phaseShiftPeriod == 0) && (players[t].name == "track2")) { // Shift notes in next bar
          for (let noteIndex = 0; noteIndex < previousBarTicks.length; noteIndex++) {
            var newTicks = previousBarTicks[noteIndex] + oneBarInTicks + phaseShiftAmount * pulseInTicks
            console.log("new ticks: " + newTicks + " limit " + (oneBarInTicks + oneBarInTicks * barNumber))
            if (newTicks >= (oneBarInTicks + oneBarInTicks * barNumber)) { // New position of onset is beyond the limits of this bar
              newTicks = newTicks - oneBarInTicks            // Circshift
            }
            createNote(players[t], newTicks)
          }
        } else { //no shift, just copy previous bar
          for (let noteIndex = 0; noteIndex < previousBarTicks.length; noteIndex++) {
            var newTicks = previousBar[noteIndex].ticks + oneBarInTicks
            createNote(players[t], newTicks)
          }
        }
      }
    }
  }

  return midiInProgress
}



function pitch(){
  if (Math.random() > 0.7){
    return get_random(scale)
  }
  else {return 'C'}

}

function get_random (list) {
  return list[Math.floor((Math.random()*list.length))];
}


function createNote(track_, timeTicks){
  track_.addNote({
    pitch: pitch(),
    octave: 4,
    ticks: timeTicks,
    durationTicks: pulseInTicks,
    velocity: Math.random()
  })
}
