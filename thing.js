var seen = {};

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
    if(n.length<=10) {
        n = parseInt(n);
        if(n<2) {
            return "not prime";
        }
        return miller(n);
    }

    console.log("probabilistic");

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
        if ((res.toString()).indexOf('i')>0) {
            return res;
        }
        if (res===false) {
            return 'composite';
        }
    }
    return 'probable prime';
}

var $ = function(s){return document.querySelector(s)};

function update(n) {
	document.body.className = '';
    $('#n').innerHTML = n;
	var tens = n.length-(n.length%10);
	if(n.length>30) {
		tens = 30;
	}
	document.body.classList.add('len-'+tens);

	function calculate() {
		var message = n in seen ? seen[n] : describe_primality(n);
		seen[n] = message;
		document.body.classList.remove('loading');
		document.body.classList.add(message);

		$('#prev-n').innerHTML = BigInteger.parse(n).subtract(1).toString();
		$('#next-n').innerHTML = BigInteger.parse(n).add(1).toString();

		if(window.history) {
			window.history.replaceState(null,n,n);
		}
	}

	if(n.length>6) {
    	document.body.classList.add('loading');
		setTimeout(calculate,0);
	} else {
		calculate();
	}
}

function describe_primality(n) {
    if(!n.match(/\d+/)) {
        return "Not a number";
    }

    switch(is_prime(n,50)) {
        case 'composite':
        case 'not prime':
            return 'not-prime';
        case 'prime':
            return 'prime';
        case 'probable prime':
            return 'probably-prime';
    }
}

$('#prev').addEventListener('click',function() {
    var n =$('#prev-n').innerHTML;
    update(n);
});
$('#next').addEventListener('click',function() {
    var n =$('#next-n').innerHTML;
    update(n);
});

var n = window.location.pathname.slice(1) || '2';
update(n);
