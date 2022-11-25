// Rough Work Do Not Read Boys //



var onsets = 5;
var pulses = 12;

var uncombined = new Array(pulses-onsets).fill([0]);
var combinedA = new Array(onsets).fill([1]);
var combinedB = [];

console.log('///1////')
console.log(combinedB);
console.log(combinedA);
console.log(uncombined);

var ca = combinedA.length; //5
var uc = uncombined.length; //7
var i = 0;

while( ((uc - ca) > 0) && (ca > 0) && (uc > 0) ){
  combinedB[i] = combinedA[i].concat(uncombined[i]);
  //console.log(uc - ca);
  ca = ca - 1;
  uc = uc - 1;
  i = i + 1;
}

uncombined = uncombined.slice(i);
if (i < combinedA.length) {
  uncombined = combinedA.slice(i, combinedA.length)
  combinedB = combinedA.slice(0, i);
}
combinedA = combinedB;
combinedB = [];

console.log('///2////');
console.log(combinedB);
console.log(combinedA);
console.log(uncombined);

var ca = combinedA.length; //5
var uc = uncombined.length; //2
var i = 0;

if (ca > uc) {
  while ((ca > 0) && (uc > 0)) {
    combinedB[i] = combinedA[i].concat(uncombined[i]);
    //combinedB[i] = combinedA[i];
    ca = ca - 1;
    uc = uc - 1;
    i = i + 1;
  }
}



/*
uncombined = uncombined.slice(i);
if (i < combinedA.length) {
  uncombined = combinedA.slice(i, combinedA.length)
  combinedB = combinedA.slice(0, i);
}
combinedA = combinedB;
combinedB = [];
*/
console.log('///3////')
console.log(combinedB);
console.log(combinedA);
console.log(uncombined);
/*
var ca = combinedA.length; //2
var uc = uncombined.length; //3
var i = 0;

if (uc > ca) {
  while ((ca > 0) && (uc > 0)) {
    combinedA[i] = combinedA[i].concat(uncombined[i]);
    //combinedB[i] = combinedA[i];
    ca = ca - 1;
    uc = uc - 1;
    i = i + 1;
  }
}

console.log('///4////')
console.log(combinedB);
console.log(combinedA);
console.log(uncombined);

uncombined = uncombined.slice(i);
console.log(uncombined.length);
//uncombined = combinedA.slice(i, combinedA.length)
//combinedB = combinedA.slice(0, i);
//combinedA = combinedB;
//combinedB = [];

var pattern = combinedA[0].concat(combinedA[1].concat(uncombined[0]))

console.log('///4////')
console.log(combinedB);
console.log(combinedA);
console.log(uncombined);
console.log(pattern);
*/
