//const Midi = require('@tonejs/midi');
//const fs = require("fs");
//const Tone = require("tone");
import Midi from "@tonejs/midi";
import fs from 'fs';
const sixteenthNote = 0.125; //one 1/16th note = 0.125 seconds

// creating midi file from scratch //
var midi = new Midi.Midi()

// add a track, each midi file can have multiple tracks
const track = midi.addTrack()

// creating the beat
//    1  e  +  a  2  e  +  a  3  e  +  a  4  e  +  a
//    *                 *                 *
//    0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15

//adding  notes to a track
/*
track.addNote({
  name : 'C3',
  time : (0*sixteenthNote), // we can multiply the value of a 1/16th note in seconds by its position in the beat
  duration: sixteenthNote //seconds
})
  .addNote({
    name : 'C4',
    time : (6*sixteenthNote),
    duration: sixteenthNote
  })

  .addNote({
    name : 'C4',
    time : (12*sixteenthNote),
    duration: sixteenthNote
  })*/


for(let i=0; i<4; i++) {
  //console.log((0 + (i * 16)))
  track.addNote({
    name: 'C3',
    time: (0 + (i * 16)) * sixteenthNote, // we can multiply the value of a 1/16th note in seconds by its position in the beat
    duration: sixteenthNote //seconds
  })
    .addNote({
      name: 'C4',
      time: (4 + (i * 16)) * sixteenthNote,
      duration: sixteenthNote
    })

    .addNote({
      name: 'C4',
      time: (8 + (i * 16)) * sixteenthNote,
      duration: sixteenthNote
    })
}

console.log(track.notes);
console.log("note that the values for ticks in the midi we generated are much larger, a 1/16th note = 120 ticks")
//fs.writeFileSync("rhythm1.mid", new Buffer(midi.toArray()))

console.log("//////////////////");
console.log(track.notes[1].bars);
console.log(track.notes[1].time);
//console.log(track.notes[4].bars);


//console.log(track.notes[1].time);//
track.notes[1].time = 1.0;

console.log(track.notes[1].bars);
console.log(track.notes[1].time);
