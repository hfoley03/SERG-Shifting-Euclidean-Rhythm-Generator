let onsetsA;                             // Numbe of onesets for tracks 1 & 2
let pulsesA;                             // How many steps, 4,8,16,32
let onsetsB;                             // Numbe of onesets for tracks 1 & 2
let pulsesB;                             // How many steps, 4,8,16,32
let tempo_bpm = 100;
let trackNamesTemp = ['track1', "track2", "track3", "track4"]
let phaseShiftAmount = 1;                // By how many pulses is each shift
let phaseShiftPeriod = 1;                // After how many bars does a shift occur
let length = 1;                          // Length of total piece
let scale_;                              // Used to add 4th and 5th note of C (see function pitch())
let midiInProgress;
// set 1
let track1;                              // track 1, no shifting, base rhythm
let track2;                              // track 2, shifting occurs
// set 2
let track3;                              // track 2, no shifting, base rhythm
let track4;                              // track 4, shifting occurs

let oneBarInTicks;                       //length of a bar in ticks, normally 1920
let pulseInTicksA;                       //length of one pulse in ticks for tracks 1 & 2 ,normally for a 1/16th note = 120
let pulseInTicksB;                       //length of one pulse in ticks for tracks 3 & 4

// Create binary euclidean rhythm
let binaryRhythmA;
let binaryRhythmB;

// Convert into Midi object
let midiObject;

// Creates full composition, with phase shifts
let finalMidiObject;

let velAmount = 0.5 // Pushed from GUI Slider range [0.05 - 0.45]
let userSelected = [true,false,false,false,false,false,false] // Pushed from GUI, series of tick boxes
let colorAmt = 0.5
let keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ]
let major = [2,2,1,2,2,2,1];
let minor = [2,1,2,2,1,2,2];
let melodicMinor = [2,1,2,2,2,2,1];
let scaleType = {"Major": major, "Minor": minor, "Melodic Minor": melodicMinor}

generateMidi(onsetsA = 4, pulsesA = 8, onsetsB = 3, pulsesB = 8, tempo_bpm = 100, "Major" , "C");

function generateMidi(onsetsA, pulsesA, onsetsB, pulsesB, tempo_bpm, scaleTypeName, rootNote_){
  // Variables that could change by user
  console.log("Generate Midi")
  let scaleCalculated = calcScale(rootNote_, scaleType[scaleTypeName])
  console.log("calc scale: " + scaleCalculated)
  console.log("root: " + rootNote_)
  scale_ = userSelectedNotes(userSelected, scaleCalculated)
  console.log("user's scale: " + scale_)
  midiInProgress = new Midi();
  midiInProgress.name = "My Bloody Nightmare"

  // Set 1
  track1 = midiInProgress.addTrack()      // track/player 1, no shifting, base rhythm
  track1.name = "track1"
  track2 = midiInProgress.addTrack()      // track/player 2, shifting occurs
  track2.name = "track2"

  // Set 2
  track3 = midiInProgress.addTrack()      // track/player 1, no shifting, base rhythm
  track3.name = "track3"
  track4 = midiInProgress.addTrack()      // track/player 2, shifting occurs
  track4.name = "track4"

  oneBarInTicks = midiInProgress.header.ppq*4 //length of a bar in ticks, normally 1920
  pulseInTicksA = (oneBarInTicks)/pulsesA     //length of one pulse in ticks,normally for a 1/16th note = 120
  pulseInTicksB = (oneBarInTicks)/pulsesB

  // Create binary euclidean rhythm
  binaryRhythmA = euclidianPattern(onsetsA, pulsesA)
  //  console.log('BR a onsets pulses', onsetsA, pulsesA)

  binaryRhythmB = euclidianPattern(onsetsB, pulsesB)
  //  console.log('BR b onsets pulses ', onsetsB, pulsesB)

  // Convert into Midi object
  midiObject = binaryRhythmToMidi(binaryRhythmA, midiInProgress, pulseInTicksA, 0)
  midiObject = binaryRhythmToMidi(binaryRhythmB, midiObject, pulseInTicksB, 2)

  // Creates full composition, with phase shifts
  finalMidiObject = phaseAndCompose(midiObject, phaseShiftAmount, phaseShiftPeriod, length)

  finalMidiObject.header.setTempo(tempo_bpm)
  console.log("Midi Header Tempo Set:")
  console.log(finalMidiObject.header.tempos)

  //download('mymidi.mid', (midiInProgress.toArray()))
  //var blob = new Blob(midiInProgress.toArray());
    //saveAs(blob, "miditest3.mid")
  //var file = new File(midiInProgress.toArray(), "world.mid", {type: "text/plain;charset=utf-8"});
  //saveAs(file);

  return;
}


/////////////////////
/// FUNCTIONS :) ////
/////////////////////

// takes onsets (hits) pulses (tatum/steps)
// returns a string version of the rhythm eg 10010010
function euclidianPattern(onsets, pulses) {
  let unjoined = new Array(pulses - onsets).fill([0]);
  let joined = new Array(onsets).fill([1]);
  let buffer = [];

  while (unjoined.length > 1) {
    let joinedLength = joined.length;
    let unjoinedLength = unjoined.length;
    let i = 0;
    while ((joinedLength > 0) && (unjoinedLength > 0)) {
      buffer[i] = joined[i].concat(unjoined[i]);
      joinedLength = joinedLength - 1;
      unjoinedLength = unjoinedLength - 1;
      i = i + 1;
    }
    unjoined = unjoined.slice(i);
    if (unjoinedLength < joinedLength) {
      unjoined = joined.slice(i, joined.length);
    }
    joined = buffer;
    buffer = [];
  }
  let output = joined.join().replaceAll(',', '');
  if (unjoined[0]) {
    output = (joined.join() + unjoined[0].toString()).replaceAll(',', '');
  }
  console.log("Binary Rhythm: " + output)
  return output
}


// function takes a string in the format 10101010 and creates a midi object of that rhythm
// will only work as expected for onsets 2,4,8,16
function binaryRhythmToMidi(binaryRhythm, midiInProgress, pulseInTicks, offSet=0){
  let tracka = midiInProgress.tracks[0 + offSet]
  let trackb = midiInProgress.tracks[1 + offSet]
  for ( let i = 0; i < binaryRhythm.length; i++)
  {
    if (binaryRhythm[i]==1){
      createNote(tracka, (i * pulseInTicks), pulseInTicks)
      createNote(trackb, (i * pulseInTicks), pulseInTicks)
      //console.log("notes added to tracks: " + tracka.name + "  & " +trackb.name )
    }
  }
  //console.log(midiInProgress.tracks[0].notes)
  return midiInProgress
}

// function takes a midi object containing two tracks with each track of length 1 bar
// creates full "composition" by extending these tracks, track 1 with no shifting (base rhythm), track 2 with shifting
function phaseAndCompose(midiInProgress,phaseShiftAmount, phaseShiftPeriod,length){
//  console.log("Phase and Compose")
  let newTicks;
  let track1_ = midiInProgress.tracks[0]
  let track2_ = midiInProgress.tracks[1]
  let track3_ = midiInProgress.tracks[2]
  let track4_ = midiInProgress.tracks[3]
  var players = [track1_, track2_, track3_,track4_]

  for(var t in players) {
    var trackSpecificPulseInTicks = players[t].notes[0].durationTicks
    var trackSpecificOnsets = players[t].notes.length
    var trackSpecificPulses = oneBarInTicks/trackSpecificPulseInTicks

    //    console.log("player " + players[t].name + " onsets: " + trackSpecificOnsets + " pulses: " + trackSpecificPulses +" values of pulse: " + trackSpecificPulseInTicks)

    for (let barNumber = 0; barNumber < length; barNumber++) {   // For each bar in the total length of composition
      //console.log("bar no.: " + barNumber)
      if (barNumber > 0) { // Make next bar
        //Create an array of the ticks of the previous bar
        //REFACTOR?
        var previousBar = players[t].notes.slice(((barNumber - 1) * trackSpecificOnsets), ((barNumber - 1) * trackSpecificOnsets) + (trackSpecificOnsets))
        //console.log(previousBar)
        const previousBarTicks = Array()
        for (let x = 0; x < previousBar.length; x++) {
          previousBarTicks.push(previousBar[x].ticks)
        }
        //console.log(previousBarTicks)
        if ( (barNumber % phaseShiftPeriod == 0) && (players[t].name == ("track2") || players[t].name == ("track4")) ) { // Shift notes in next bar
          for (let noteIndex = 0; noteIndex < previousBarTicks.length; noteIndex++) {
            newTicks = previousBarTicks[noteIndex] + oneBarInTicks + phaseShiftAmount * trackSpecificPulseInTicks
            //console.log("new ticks: " + newTicks + " limit " + (oneBarInTicks + oneBarInTicks * barNumber))
            if (newTicks >= (oneBarInTicks + oneBarInTicks * barNumber)) { // New position of onset is beyond the limits of this bar
              newTicks = newTicks - oneBarInTicks            // Circshift
            }
            createNote(players[t], newTicks, trackSpecificPulseInTicks)
          }
        } else { //no shift, just copy previous bar
          for (let noteIndex = 0; noteIndex < previousBarTicks.length; noteIndex++) {
            newTicks = previousBar[noteIndex].ticks + oneBarInTicks
            createNote(players[t], newTicks, trackSpecificPulseInTicks)
          }
        }
      }
    }
  }
  return midiInProgress
}

function pitch(){
  if (Math.random() > colorAmt){
    return get_random(scale_)
  }
  else {
    return scale_[0]  }
}

function get_random (list) {
  return list[Math.floor((Math.random()*list.length))];
}

function createNote(track_, timeTicks, pulseInTicks_){
  track_.addNote({
    pitch: pitch(),
    octave: trackNamesTemp.indexOf(track_.name) + 2,
    ticks: timeTicks,
    durationTicks: pulseInTicks_,
    velocity: vel()
  })
}

function vel(){
  let vel_ = getRandomArbitrary(velAmount, 1);
  if (vel_ < 0.1){ // needed as a velocity of zero means no note
    vel_ = vel_ + 0.1
  }
  console.log(vel_)
  return vel_
}

function calcScale(key,intervals){
  let scale = []
  let index = keys.indexOf(key);
  for (let i=0; i < intervals.length; i++) {
    scale[i] = keys[index % 12];
    index += intervals[i];
  }
  return scale
}

function userSelectedNotes(userSelected, scaleCalculated){
  let flavourNotes = []
  for (let i=0; i < userSelected.length; i++) {
    if(userSelected[i]==true) {
      flavourNotes.push(scaleCalculated[i])
    }
  }
  return flavourNotes;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

