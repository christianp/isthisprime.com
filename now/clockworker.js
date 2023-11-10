import {is_prime} from '../prime.mjs';

function unix_time() {
    return Math.floor((new Date()-0)/1000);
}

let t = unix_time()-1;

function next_prime(n) {
    while(!is_prime(n).match('prime')) {
        n += 1;
    }
    return n;
}


setInterval(() => {
    const now = unix_time();
    if(now > t - 300) {
        t = next_prime(t+1);
        postMessage(t);
    }
}, 100);
