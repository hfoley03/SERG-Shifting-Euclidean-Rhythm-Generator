/*
* Given 1 bar of midi on 1 single track called "track1"
*
* User will have selected that they want between 2 or 4 tracks
*
* Copy tack 1 and make "track2", "track3", "track4" as needed
*
* parameters/variables: phase shift amount
*                       phase shift period
*                       total number of bars
*
* for total numbers of bars have the default be one full cycle, ie the number of bars it takes onset one to be shifted back
* to it's starting postition, think it should = phase shift period * number of pulses / phase shift amount
*
* what behaviour do we want for the track3 and track4???????????
*
* pair mode?
*   tracks 1 and 2 are the same with 2 being shifted
*   tracks 3 and 4 are a different rhythm with 4 being shifted
*
* delayed shift mode?
*   track 1: baseline, never changes
*   track 2: shifted as normal after phase shift period
*   track 3: shifted after track2 is shifted, 1 bar later?
*   track 4: shifted after track3 is shifted, 1 bar later?
*
* another one?
*
*   track 1 = track 3
*   track 2 = track 4
*   track 2/4 are shifted as normal
*   track 1 and 2 played on kick and hihat
*   tack  3 and 4 on piano, root and 5th/7th etc etc
*
*
* */

import Midi from "@tonejs/midi";
import fs from 'fs';

console.log(3%0)
