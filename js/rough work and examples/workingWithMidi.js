//import fs from "/fs";
import Midi from "@tonejs/midi";
// Working With the ToneJs Midi Lib
// part 2 is more important/relevant to us
// Read https://github.com/Tonejs for more understanding

///// Part 1 /////
// First reading in a simple midi file called inputExample.mid, which is located in this folder
// The example midi file has 4 notes, one on each quarter note, the 1st is C3 lasting one 1/8th note
// the other three notes are all C4 and each last one 1/16th note
// for formatting please see: https://github.com/Tonejs/Midi#format


const midiData = fs.readFileSync("inputExample.mid")
const inputExample = new Midi.Midi(midiData);
console.log("// Input Example //")
console.log(inputExample)

console.log("accessing just the note data")
console.log(inputExample.tracks[0]);

console.log("ticks are the unit used in midi for time (when something happens) and duration")
console.log("ticks have a fixed quantity but this quantity can be different for different midi file, NEED TO RESEARCH THIS ")
console.log("In this example 24 ticks = 1/16 note, 96 ticks = 1/4 note")
console.log("ticks in 1 bar = 0-383")
console.log("when we call for the duration of a particular note like below, the library translates the duration from ticks to seconds")
console.log(inputExample.tracks[0].notes[0].duration);

///// PART 2 /////
// We are more concerend with creating midi and exporting it
// creating the same midi file from scratch //
var midi = new Midi.Midi()
// add a track, each midi file can have multiple tracks
const track = midi.addTrack()

//adding four notes to a track
track.addNote({
  name : 'C3',
  time : 0,       //seconds
  duration: 0.250 //seconds...... 0.250 seconds = 1/8th note at 120 bpm
})
  .addNote({
    name : 'C4',
    time : 0.5, //seconds...... 0.5 seconds = 1/4th note at 120 bpm, so this note will take place on the 2 if we are counting 1,2,3,4 for our bar
    duration: 0.125 //seconds... 0.125 seconds = 1/16th note at 120 bpm, so this note will last 1/16th note
  })

  .addNote({
    name : 'C4',
    time : 1.0,
    duration: 0.125
  })

  .addNote({
    pitch : 'C',
    octave: 4,
    time : 1.5,
    duration: 0.125
  })


// write the output
fs.writeFileSync("outputExample.mid", new Buffer(midi.toArray()))

console.log(track);
console.log("note that the values for ticks in the midi we generated are much larger, a 1/16th note = 120 ticks")


