import copy from 'dev/util/copy';

exports.intersection = function(array1, array2) {
  let sa1 = copy.deepcopy(array1).sort();
  let sa2 = copy.deepcopy(array2).sort();
  let ret = [];
  let i = 0;
  let j = 0;
  while (1) {
    while (i < sa1.length && j < sa2.length && sa1[i] < sa2[j])
        i++;
    while (i < sa1.length && j < sa2.length && sa1[i] > sa2[j])
        j++;
    if (i >= sa1.length || j >= sa2.length)
        break;
    if (sa1[i] == sa2[j]) {
        ret.push(sa1[i]);
        i++;
        j++;
    }
  }

  return ret;
  
}

