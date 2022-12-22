const synths = []

Tone.Destination.volume.value = -9; // this value is in dB

let main_bpm = 120;
let main_loop_interval = 8;
let ready = false;


document.getElementById("play-button").addEventListener("click", function() {
    console.log("pressed")
    if (!ready) {
        initializeAudio();
        ready = true;
    } else {
        // click again to start/stop...
        if (Tone.Transport.state === "paused") Tone.Transport.start();
        else if (Tone.Transport.state === "started") Tone.Transport.stop();

    }
});

let main_loop = new Tone.Loop(playNotes , main_loop_interval);
let print_loop = new Tone.Loop(() => {
    console.log("Loop")
} , main_loop_interval);

// creating the beat
//    1  e  +  a  2  e  +  a  3  e  +  a  4  e  +  a 1 E + A
//    *                 *                 *               Pulses
//    0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16  Tatum
//    1     2     3     4     5      6     7     8    1   Metronomo

const sixteenthNote = 0.125; //one 1/16th note = 0.125 seconds
var midi = new Midi() // creating midi file from scratch
const track = midi.addTrack()
const track1 = midi.addTrack()


for(let i=0; i<4; i++) {
    console.log((0 + (i * 16)))
    track.addNote({
        name: 'C3',
        time: (0 + (i * 16)) * sixteenthNote, // we can multiply the value of a 1/16th note in seconds by its position in the beat
        duration: sixteenthNote //seconds
    })
        .addNote({
            name: 'C4',
            time: (6 + (i * 16)) * sixteenthNote,
            duration: sixteenthNote
        })

        .addNote({
            name: 'C4',
            time: (12 + (i * 16)) * sixteenthNote,
            duration: sixteenthNote
        })



    track1.addNote({
        name: 'G3',
        time: ((0 + (i * 16)) * sixteenthNote), // we can multiply the value of a 1/16th note in seconds by its position in the beat
        duration: sixteenthNote //seconds
    })
        .addNote({
            name: 'G4',
            time: ((4 + (i * 16)) * sixteenthNote),
            duration: sixteenthNote
        })

        .addNote({
            name: 'G4',
            time: ((8 + (i * 16)) * sixteenthNote),
            duration: sixteenthNote
        })

        .addNote({
            name: 'G4',
            time: ((12 + (i * 16)) * sixteenthNote),
            duration: sixteenthNote
        })
}

function initializeAudio() {
  Tone.start().then(()=>{
    Tone.Transport.bpm.value = main_bpm;
    Tone.Transport.start();
    main_loop.start();
    print_loop.start();
  });
}



function playNotes() {
    midi.tracks.forEach(track => {
        //create a synth for each track
        const synth = new Tone.PolySynth(Tone.Synth, {
            envelope: {
                attack: 0.02,
                decay: 0.1,
                sustain: 0.3,
                release: 1
            }
        }).toMaster()

        synths.push(synth)
        //schedule the events

        track.notes.forEach(note => {
            synth.triggerAttackRelease(note.name, note.duration, note.time + Tone.now() + 0.5, note.velocity)
        })

    })
}






