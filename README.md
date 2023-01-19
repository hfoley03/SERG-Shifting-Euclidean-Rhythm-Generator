# SERG: Shifting Euclidean Rhythm Generator

Contributors:
- Juan Sebastian Gonzalez
- Eray
- Harry Foley

**SERG is a music composition tool inspired by Steve Reich's concept of phase shifting rhythms.**

**It uses Godfried Toussaint's Euclidean Rhythms to create unique musical beats that change over time as they shift in and out of phase.**

## Introduction

### What are Phase Shifting Rhythms

Phase Shifting Rhythms is the name we have given to a technique that Steve Reich has used across his discography.

To explain the concept we will take his piece “Clapping Music for Two Performers” as an example:
* The piece starts with both performers clapping a 1 bar rhythm in unison, repeated 12 times.
* On bar 13 the 1st player continues the rhythm as normal. However, the 2nd player claps a rhythm that is the original rhythm circular shifted by one pulse. Again this is repeated for 12 bars.
* This process of circular shifting is repeated until the 2nd player's rhythm has been shifted back to it's original position.

This simple principle is amazing at producing some very unique feeling rhythmic pieces as the two rhythms go in and out of phase. There is a push-pull effect felt as syncopation is intermittently introduced.
It is this concept of shifting a rhythm over time that our project is based on.

### What are Euclidean Rhythms

Euclidean Rhythm was discovered by Godfried Toussaint in 2004. It uses the Euclidean Algorithm to generate musical rhythms. What is most interesting is that the rhythms it produces are traditional rhythms from all over the world, and rhythms that are found in modern electronic dance music. The greatest common divisor of two numbers is used to create the rhythm where the beats are as equidistant as possible.

The two numbers used to produce the rhythm are called onsets and pulses. Onsets the number of hits/beats in the bar. Pulses describes the number beats in the rhythm or the subdivision of the bar the rhythm is in.

For example 3 onsets, 8 pulses in our context creates a 1 bar rhythm of 1/8th notes with 3 hits in the bar. The resulting rhythm would be “10010010”. A 1 representing an onset and a 0 a silence.  When we look at world music we find this to be the Cuban Tresillo.

Below is a diagram taken from Godfried Toussaint's book The Geometry of Musical Rhythm. It gives a visual description of how the Euclidean Rhythm 3 onsets, 8 pulses is formed.

![cubanTressillo](https://github.com/hfoley03/musical-guacamole/blob/Design_2/img/cubantresillo.png?raw=?)

We chose to use Euclidean Rhythms for our base rhythms as they automatically sound “Good”. As Euclidean Rhythms are ones found throughout music both traditional and modern they contain some invariant quality that is highly agreeable to the listener.

### Terminology

- Onset: a hit or played note during a rhythm.

- Pulse: how the one bar rhythm is subdivided. For example 4 pulses divides the bar into quarter notes, 8 pulses divides the bar into eighth notes.

- Phase Shift Amount: by how many pulses will the rhythm be shifted by.

- Phase Shift Period:  after every how many bars will a shift occur.

- Flavour Notes: the notes in a musical scale not including the root note.


### SERG's Design

SERG has two sets of phase shifting rhythms that are played in sync.

- Set 1 consisting of Track 1 and Track 2
- Set 2 consisting of Track 3 and Track 4.

The base rhythm for each set is generated by a euclidean rhythm. The onsets and pulses can be set independantly for each set.

## Technical Description

### Technologies Used

#### Tone.js

> Tone.js is a Web Audio framework for creating interactive music in the browser. The architecture of Tone.js aims to be familiar to both musicians and audio programmers creating web-based audio applications.

Tone.js is being used to create an audio context for the project. It provides the building blocks needed to create an audio application in the browser.

#### Tone.js/midi

> Midi makes it straightforward to read and write MIDI files with Javascript. It uses midi-file for parsing and writing.

Tone.js/midi is a library for creating and interacting with Midi data in javascript. It is used in the project to create a four track MIDI file which is then played back in the browser using Tone.js.

#### p5.js

> p5.js is a JavaScript library for creative coding, with a focus on making coding accessible and inclusive for artists, designers, educators, beginners, and anyone else!

P5.js is being used for creating our GUI and for visualising the MIDI data.


### Project Structure

The project is primarily divided among three javasvript files: gui.js, browserPlay.js and midiGeneration.js

- gui.js is responsible for the frontend of the web application.

- browserPlay.js contains the functionality for in browser playback of the midi data using Tone.js.

- midiGeneration.js contains the functionality for generating the rhythmic and melodic data and parsing this data into a Tone.js midi object.

### Flowchart



### GUI
The Graphic User interface is generated using p5.js. We the p5.js library to visualise our composition on a rhythmic wheel. A rhythmic wheel works similarly to a clock face, with a hand moving clockwise highlighting what is currently playing.

The visualisation of the composition was generated using the following functions

#### Fixed_Circles(track):
This function is responsible for creating the circles that represent the tracks that have no phase shifting, hence they are fixed. It’s only input argument is the track number. It then draws the circle by taking the binary string of the rhythm generated by * euclideanPattern ()*. The function subdivides the circle according to the number of pulses, and then draws the onsets starting with the first onset at 12 o’clock. An example of this is shown below for 4 onsets and 8 pulses.
![FixedCircle()](https://github.com/hfoley03/musical-guacamole/blob/Design_2/img/FixedCircle.png?raw=?)

#### VisualFix(track):
This function has as input the track number, Track 1 or Track 3, to consider the pulses on the specific track and thus draw an arc to highlight the pulse that is playing in the main circle in clockwise direction, as it is shown in the following figure.

![VisualFixedCircle()](https://github.com/hfoley03/musical-guacamole/blob/Design_2/img/VisualFixedCircle.png?raw=?)

#### ShiftingCircle(x, y, onset, pulses, prt, color1, color2)

The purpose of the function is to draw the circles with the shifting pattern, each one corresponding to a Track bar. Its  imputs are x and y (positions where the circle is locating, onsets (obtained from *GetBinaryShiftedOnset()* function, prt a proportion related with the radio of the circle, color1 and color2.

![ShiftingCircle()](https://github.com/hfoley03/musical-guacamole/blob/Design_2/img/ShiftingCircle.png?raw=?)

#### VisualShift(track)

This function controls the rotation of the circle according to the shifting pattern selected by the user, changing its radio proportion each bar.
First, the *GetBinaryShiftedOnset()* function is called, to takes the Tracks 2 or 4, and obtain a binary representation of the onsets of the full track. Then, the binary array is divided into bars to thus be drawn by *ShiftingCircle()* function.

![VisualShift()](https://github.com/hfoley03/musical-guacamole/blob/Design_2/img/VisualShift.png?raw=?)

For the Timing of the visual functions, there are used two different timers, one for *VisualFix()* based on the pulse duration and one for *VisualShift()* according to the duration of each bar. Consequently, there is one timer corresponding to each set.

These function are sincronized with the audio playing that is way there are used two functions *startTimer()* and *stopTimer()*,which modify the auxiliary variables used to change the parameters in the drawing of the visuals.

```
function VisualFixTimingA();     //Set 1
function VisualFixTimingB();     //Set 2
function VisualShiftTimingA();   //Set 1
function VisualShiftTimingB();   //Set 2
```

#### checkErrors()

This function checks if there are any errors are present in any of the input values and creates an appropriate error message accordingly.
It also sets the color of the input box to red if there is an error present. The error message is shown by a windowed alert.

An example of an error would be if the user tries to set 10 onsets and 8 pulses, as the number of onsets must be less than or equal to the number of pulses.

####  toggleTutorial()

This function contains tutorial texts and tells the user what they need to know about the application. This function is called when the tutorial button (marked by "?") is pressed.

![tutorial](?raw=?)

### Browser Play

The purpose of the browserPlay.js file is to manage the playback of the created Midi object. The Midi object has four tracks inside, with their own notes to play. Specifically, those notes have attributes of pitch, note duration, starting time, and velocity. The other necessities to play a note are handled in this JavaScript file, such as selecting an instrument to play the note, adjusting the ADSR of the instruments, adding audio effects, connecting the Audio nodes together, and so on.

#### Functions
#### playNotes()
This function is responsible for scheduling the audio events for all tracks. The function is called repeatedly by the function Tone.Loop to play the Midi notes again if the user doesn’t press the button STOP. Therefore, it plays the same Midi notes that are created by the generateMidi() function by looping the playNote() function. The loop is created by the code:

`let main_loop = new Tone.Loop(playNotes , main_loop_interval);`

The first step is to set Tone.context.latencyHint to the value of 1 second so that when scheduling the events, it takes time to schedule them as precisely as possible at the expense of a small latency. However, we start by playing the notes 2 seconds later to solve all latency issues. The second step is to record the current time instant with Tone.context.currentTime with 2 seconds delay so that we can start to schedule the audio events exactly after this time instance after the delay. Then, for each track in the object, we check the synth_type selected by the user for the Audio playback (this can be both samples and synths). Then we connect these synths to their corresponding channels. If a synth that is not a sample is selected by the dropdown menus on GUI, then for each note in each track, we schedule the audio events by synth.triggerAttackRelease() function with corresponding time instances, note pitches, durations, and velocities. Here is the code snippet:

```
synth.triggerAttackRelease(note.name, note.duration, time_inst_to_play, note.velocity)
```

If in the dropdown menus, samples are selected by the user instead of synths, then again for each note in all tracks, synth.start() function is used by their corresponding time instances, durations, and velocities. We don’t consider their corresponding pitch value because they are just buffered samples of percussive instruments.

#### start_aud()
This function starts or resumes the Tone.context, and sets the tempo of the Tone.Transport, sets the volume of the destination of the Tone and calculates and sets the duration of the main loop function. Then, it initiates the main_loop with the calculated loop interval. This function is called when the user presses the START button.
#### stop_aud()
This function first stops the Audio. Then, it cleans the synths array to prevent memory leaks and disposes of the scheduled audio events for each track.

#### Connection of the Audio Nodes
We use channel stripping for all four tracks and their corresponding synths. We connect each synth to a limiter to limit their volumes to a specific value so that the sounds do not pop. Then, we connect the limiter to the chorus effect, delays, and reverb. After the effects, we connect to the destination. The connections are shown in the below figure:

![Audio-nodes flowchart](https://github.com/hfoley03/musical-guacamole/blob/main/img/AudioEffectsDiagram.png)

### midiGeneration.js

The generation of the midi object is handled by the javascript file midiGeneration. The process is divided  among several functions, with the function generateMidi handling the overall flow.

#### euclideanPattern(onsets, pulses)

The first step in building the MIDI object for the piece is to create the base Euclidean Rhythm. This is handled by the function euclideanPattern. The function has two input arguments, onsets and pulses. The function returns a string with a binary representation of the Euclidean Rhythm. For example with inputs onsets = 5 and pulses = 8, the function would return
```
“10110110”
```
With a 1 representing an onset and a 0 a pulse without an onset.
The generation of Euclidean Rhythm was designed from the description in Godfried T. Toussaint’s book The Geometry of Musical Rhythm, chapter 19 “Euclidean Rhythms”.
The algorithm was designed from scratch using the method he described. The figure below is taken from The Geometry of Musical Rhythm and shows a visual representation of the algorithm with 5 onsets and 8 pulses.

#### binaryRhythmToMidi(binaryRhythm, midiObject, pulseInTicks, offset)

This function is responsible for transforming the binary string representation of a Euclidean Rhythm into a Tone.js MIDI object. It’s input arguments are binaryRhythm (the binary string of the Euclidean rhythm), midiObject (an empty Tone.js midi object), pulseInTicks (the number of ticks in one pulse) and offset (used to decide if the function is creating tracks 1 & 2 or tracks 3 & 4). It returns a midi object with one bar of Euclidean rhythm in each of the four tracks.

#### createNote(track_, timeTicks, pulseInTicks_)

Adds a midi note to a tracks at a specific time in ticks. The octave of the note depends on the track number. Input arguments are track_ (the track that the note should be added to), timeTicks (when the note should happen in ticks) and pulseInTicks_ (the duration of a pulse in ticks, used to set the length of the note)

#### pitch()

This function is called by createNote to specify what the note letter value will be.
If the user is working in C major with no colour notes selected the function will always return “C”.
If the user has selected colour notes 3 and 5, and with a colour amount of 30%, the function will have a 70% chance of returning “C” and a 30% chance of returning an “E” or “G” (the 3rd and 5th degree of the C Major Scale). These values will change as expected for example if the user specifies D Minor with colour notes 2,4,7.

#### vel()

This function returns a random velocity value for a midi note. The range that this velocity value can be is controlled by the user. If the user has the range at its minium size the function always returns 1.0, max velocity. If the user has the range at 1/4 the values returned will be between 0.75 – 1.0. At maximum range the values returned will be between 0.1 – 1.0.

#### calcScale(key, intervals)

This function creates a scale given a root note and intervals array. The intervals array describes the pattern of intervals in a scale. For example a major scale is represented by
```
let major = [2,2,1,2,2,2,1]
```
#### userSelectedNotes(userSelected, scaleCalculated)

This function reduces the scale created in calcScale to just the notes that the user desires. For example if the user wants C Major with colour notes 4 & 5, the function returns
```
[“C”, “F”, “G”]
```

#### phaseAndCompose(midiInProgress,phaseShiftAmount, phaseShiftPeriod,length)

This function is responsible for creating the MIDI object containing the full composition of all 4 tracks that will be played back in the browser.

Its input arguments are midiInProgress (a MIDI object with four tracks, with each track containing a one bar Euclidean Rhythm), phaseShiftAmount (by how many pulses should a rhythm be shifted by), phaseShiftPeriod(after how many bars should a shift occur) and length (the overall length of the composition in bars).
The function returns the final MIDI object.

The flow chart in fig. x shows a high level flow of this function.

![Image of phaseAndCompose() flowchart](https://github.com/hfoley03/musical-guacamole/blob/Design_2/img/phaseAndComposeDiagram.png?raw=true)


## Challenges

### Challenge 1

#### How to represent the rhythmic data?

After the original conception of the idea of SERG the first major challenge was finding how best to represent the rhythmic data. We needed a data structure that could hold 4 tracks of musical data containing both rhythmic and melodic components.

At first we considered using simple arrays or strings to hold the data. For example a rhythm can be represented by a binary string, a 1 representing a sounded note and a 0 an unsounded note. Although this method is intuitive it is very limited in its capabilities.

We also considered using a custom data structure. Built for example by nested arrays or dictionaries. This would have been highly customisable and allowed us to include as much data as we wanted but may have become overly complicated and would not be readily useable across existing or future projects.

After some experimentation we found  that Tone.js had a suitable library called MIDI. The library claims to make reading and writing of MIDI files straight forward.
The library creates a MIDI object in the javascript environment that allows access to every element of a MIDI file that a developer could need.
Below shows what this MIDI object looks like. Not shown is the elements of the data structure for Control Changes and Instruments as they are not used in our application.

```{
  // the transport and timing data
  header: {
    name: String,                          // the name of the first empty track
    tempos: TempoEvent[],                  // the tempo, e.g. 120
    timeSignatures: TimeSignatureEvent[],  // the time signature, e.g. [4, 4],
    PPQ: Number                            // the Pulses Per Quarter of the midi file
  },
  duration: Number,                        // the time until the last note finishes
  tracks: [                                // an array of midi tracks
    {
      name: String,                       // the track name if one was given
      channel: Number,                    // channel
      notes: [
        {
          midi: Number,                   // midi number, e.g. 60
          time: Number,                   // time in seconds
          ticks: Number,                  // time in ticks
          name: String,                   // note name, e.g. "C4",
          pitch: String,                  // the pitch class, e.g. "C",
          octave : Number,                // the octave, e.g. 4
          velocity: Number,               // normalized 0-1 velocity
          duration: Number,               // duration in seconds between noteOn and noteOff
        }
      ],
    }
  ]
}
 ```

#### How to create the Euclidian Rhythms?
People have been developing software tools using Euclidian Rhythms since they were discovered in the mid 2000s.
However, as this algorithm would be at the heart of our application it felt wrong to simply copy and paste the code from online. Instead the algorithm was coded from the ground up following the description in Godfried Toussaint’s The Geometry of Musical Rhythm.
This presented a significant technical challenge.

We needed to understand how the algorithm worked across all cases, as it behaves differently when the number of onsets is greater than half of the number of pulses. See the examples below for 5 onsets in 8 pulses vs. 3 onsets in 8 pulses.


![5 onsets 8 pulses](https://github.com/hfoley03/musical-guacamole/blob/main/img/3858.png?raw=?)

We implemented the logic in the above images by using three arrays: joined, unjoined and buffer. The array joined initially holds the onests, represented by 1s and the unjoined holds the unsounded notes (pulses – onsets ). Our algorithm then iteratively completes the steps shown in the above images.

```
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
```

#### How to implement phase shifting?

Implementing the logic for phase shifting the rhythms also presented a challenge. When the project was first conceived we believed it would be very simple, just circular shifting an array of notes. However, as we are working with the Tone.js MIDI object this was not straightforward.

The MIDI object has no concept of what a bar is. All of the notes are simply stored in sequential order with a time value of when they should be played and how long they should last.

We are satisified with the solution that we reached and it can be found as the function phaseAndCompose() in midiGeneration.js

To create a whole composition of phase shifting rhythms we start with one bar of MIDI data in each track. The tracks are built in order, first track 1, then 2, and so on.

- To create the next bar of MIDI data we slice the previous bar from the overall piece. This is important when shifting as we need to shift the previous bar and not the original rhythm

- If we are working with either track 1 or 3, we create notes for the new bar in the same time position as the previous bar + 1 bar in ticks. So if there is an onset on the 2 of the previous bar we will have on onset on the 2 of the next bar.

- If we are working with track 2 or 4 we need to check if phase shifting will occur in the next bar. To do this we check the result of dividing the bar number by the phase shift period.

- If phase shifting does occur in the next bar the new time position of each note will be the same as the last bar + 1 bar + the phase shift amount.

- We then check if all of the new notes are contained within the new bar. For example if a note in the previous bar was on the & of 4 and is now being shifted by 1/8th note it needs to be circular shifted back to 1. To do this we simply subtract 1 bar in ticks from the new position.

- This process is repeated until the number of bars equals the length of the composition set by the user.



![Image of phaseAndCompose() flowchart](https://github.com/hfoley03/musical-guacamole/blob/Design_2/img/phaseAndComposeDiagram.png?raw=true)



#### How to schedule the audio events to exact time instants?

For playing the notes on the exact time instances that are created for is a challenge due to code operation time. For instance, if an event is scheduled for the exact time when the function schedules it is called, then it is possible that the time instance when it is supposed to play has passed. Especially the Synths offered by Tone.js could take some time to create an event with triggerAttackRelease() function.

So the solution was to schedule the event two seconds after the time current time. In that way, if the function is supposed to call too many notes for each track, it has 2 seconds to schedule all the notes.

#### How to loop the playNote() function so that there are little to no glitches and pops?

On memory constrained devices like mobile phones loading many and/or large audio files can cause the browser to crash during the buffer decoding, especially if Tone.MonoSynth is used instead of Tone.Synth. The reason for that is Tone.MonoSynth consists of one oscillator, one filter, and two envelopes, whereas the Tone.Synth consists of one oscillator and an envelope. See the diagrams below for the comparison, the first one is for MonoSynth, and the one below is for Synth.

![MonoSynth](https://github.com/hfoley03/musical-guacamole/blob/main/img/monosynth.jpg?raw=?)
![Synth](https://github.com/hfoley03/musical-guacamole/blob/main/img/synth.jpg?raw=?)

For the solution, we fix the Tone.latencyHint attribute to "playback" so that the browser can take its time to schedule the events. The latency is not an issue in our case because we have already put 2 seconds delay at the first place.


#### How to loop the MIDI function so that the timing is consistent?

The looping of playNote() function could cause looping it too early or too late. Considering even 10-15 ms could change things a lot perceptually, it is important to play the loops in such a way that the timing is correct.

The way we solved the issue was to keep track of the duration of the whole MIDI file and set the loop interval to that value. The value is different for each different tempo and composition length.


#### How to synch the audio and the visuals?

One of the most important parts of the project was synching the exact position of the played onsets both in graphics and audio. The issue at hand was difficult because the draw() function from p5.js in gui.js contained many functions calls with several setInterval() functions. Thus, since it takes code operation time to update the visuals with those intervals, we needed to find a way to start the visuals at the exact time when the audio started to play.

Our solution was to start the visuals a little earlier than the exact time of the first scheduled audio event so that the delay between the audio and the visuals is compensated. The trial and error method and averaging the initial delay are utilized for finding the exact value.


## Future Work

### More Intelligent Melodic Composition

In our application the user has control over the melodic composition of the piece by selecting a key and scale to work in, what notes apart from the root note they would the like included and setting the probability of these other notes occurring. Although we are happy that this allows the user to create a musical piece, we believe we could make this feature far more powerful.

We could implement the rules of melody in our code. For example,  leaps greater than a 4th and should be followed by a change in direction. We believe adding rules such as this could improve the musicality of our application.

### Counterpoint

Building on the previous point, another powerful addition would be to have tracks 2, 3 & 4 follow the rules of counter point against the melody of track 1. Again this could add some real richness to the musicality of our application.

### Computational Efficiency

A problem we encountered towards the end of the project was issues with performance. On new Mac computers our application worked perfectly with no errors. However, on older Windows machines we encountered drops in audio quality and glitching. We believe this was due to our programme doing a lot of processing in real time for both audio, GUI and visualisation of MIDI. Although we worked to make the application as efficient as possible we had to make a compromise by allowing the user to select between the Tone.js instruments Synth and MonoSynth. Synth requires a lot less resources as it only uses an oscillator and an amplitude envelope, versus the MonoSynth which also has a filter and filter envelope in its signal chain.

As part of future work we could possibly improve the efficiency further to allow a user on any device to use the MonoSynth instrument. To achieve a higher level of efficiency we believe we would have to redesign much of the GUI and audio playback code from the ground up. Unfortunately this was not possible due to time constraints, with the issue only appearing in the final stages of the project.




