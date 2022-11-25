
function euclidianPattern(onsets, pulses) {
  var U = new Array(pulses - onsets).fill([0]);
  var A = new Array(onsets).fill([1]);
  var B = [];

  while (U.length > 1) {
    var ca = A.length;
    var uc = U.length;
    var i = 0;

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
  return (A.join() + U[0].toString()).replaceAll(',', '');
}

console.log(euclidianPattern(3, 8))


function info(){
  console.log('////////')
  console.log(B);
  console.log(A);
  console.log(U);
}
