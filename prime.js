function modpow(a,b,n) {
    if(b==0) {
        return 1;
    }
    var t = 1;

    while(b>0) {
        if(b%2) {
            if(t*a>Number.MAX_SAFE_INTEGER) {
                t = BigInteger(t).multiply(a).remainder(n);
            } else {
                t = (t*a)%n;
            }
            b -= 1;
        }
        if(a*a>Number.MAX_SAFE_INTEGER) {
            a = BigInteger(a).square().remainder(n);
        } else {
            a = (a*a)%n;
        }
        b = b/2;
    }
    return t;
}

function miller(n) {
    var s = 0;
    var d = n-1;
    while(d%2==0) {
        s += 1;
        d /= 2;
    }
    var ln = Math.log(n);
    var end = Math.min(n-1,Math.floor(2*ln*ln));
    for(var a=2;a<=end;a++) {
        if(modpow(a,d,n)!=1) {
            var broke = false;
            for(var r=0;r<=s-1;r++) {
                if(modpow(a,Math.pow(2,r)*d,n)==n-1) {
                    broke = true;
                    break;
                }
            }
            if(!broke) {
                return "composite";
            }
        }
    }
    return "prime";
}

// adapted from http://www.javascripter.net/math/primes/millerrabinprimalitytest.htm

function miller_rabin(n,a) {
    // miller_rabin(n,a) performs one round of the Miller-Rabin test
    // n is a positive integer to be tested (can be a number or a string)
    // a is the base for the Miller-Rabin test
    //
    // returns:
    //  `false` if provably composite
    //  `true` if probable prime

    var s = (n.toString()).replace(/\s/g,'');
    var len = s.length;
    var f = parseFloat(s);
    var lastDigit = parseInt(s[len-1],10);

    var res;
    var len = s.length;
    var mr_base = BigInteger.parse(a.toString());
    var mr_cand = BigInteger.parse(s);
    var mr_temp = mr_cand.subtract(1)

    var one  = BigInteger(1);
    var zero = BigInteger(0);

    res = mrr3 (mr_base, mr_temp, mr_cand);
    return res.compare(1)==0;

    function mrr3(a, i, n) { 
        if (i.isZero()) {
            return one;
        }

        var j = i.divide(2);
        var x = mrr3(a, j, n);
        if (x.isZero()) {
            return zero;
        }

        var y = x.square().remainder(n);

        if (y.compare(one)==0 && x.compare(one)!=0 && x.compare(n.subtract(1))!=0 ) {
            return zero; 
        }

        if (i.remainder(2)==1) {
            y = y.multiply(a).remainder(n);
        }
        return y;
    }
}

var smallPrimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113];

function is_prime(n) {
	n = n.toString();
    if(n.length<=10) {
        n = parseInt(n);
        if(n<2) {
            return "not prime";
        }
        return miller(n);
    }

    n = BigInteger.parse(n);

    if(n.isEven()) {
        return "composite";
    }

    var res;
    var a; 
    var s = (n.toString()).replace(/\s/g,''); 
    var rounds = smallPrimes.length;
    for (var k=0;k<rounds;k++) {
        a = smallPrimes[k];
        if (s == a.toString()) {
            return 'prime';
        }
        res = miller_rabin(s,a);
        if (res===false) {
            return 'composite';
        }
    }
    return 'probable prime';
}

function factorise(n) {
    var factors = [];
    var i = 2;
    while(n>1) {
        var p = 0;
        while(n%i==0) {
            p += 1;
            n /= i;
        }
        if(p) {
            factors.push([i,p]);
        } else {
            i += 1;
        }
    }
    return factors;
}
