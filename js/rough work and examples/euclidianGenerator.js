import Midi from "@tonejs/midi";
import fs from 'fs';

// taking a string in the format 10101010 and create a midi object of that rhythm
// will only work as expected for onsets 2,4,8,16

let pulses = 6
let onsets = 3
let midiInProgress = new Midi.Midi()
let track1 = midiInProgress.addTrack()
let ppq = midiInProgress.header.ppq
let pulseInTicks = (ppq*4)/pulses;
let ts = {
  ticks: 0,
  timeSignature: [3,4]
}


let binaryRhythm = euclidianPattern(onsets, pulses)
console.log("Binary Rhthtm: " + binaryRhythm)
console.log("Binary Rhthtm: " + binaryRhythm.length)

for ( let i = 0; i < binaryRhythm.length; i++)
{
  if (binaryRhythm[i]==1){
    track1.addNote({
      name: 'C3',
      ticks: i * pulseInTicks,
      durationTicks: pulseInTicks
    })
  }
}
fs.writeFileSync("temp.mid", new Buffer(midiInProgress.toArray()))





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
  return output
}


