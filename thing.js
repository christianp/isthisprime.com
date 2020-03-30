var seen = {};
var current_n;
var screensaver = false;

var $ = function(s){return document.querySelector(s)};

function update() {
	var n = current_n;
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

		if(message!='not-number') {
			$('#prev-n').innerHTML = BigInteger.parse(n).subtract(1).toString();
			$('#next-n').innerHTML = BigInteger.parse(n).add(1).toString();
		}

		if(window.history) {
			window.history.replaceState(null,n,'/'+n+(screensaver ? '?screensaver' : ''));
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
    if(!n.match(/^\d+$/)) {
        return "not-number";
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
function next() {
	try {
		current_n = BigInteger(current_n).add(1).toString();
		update();
	} catch(e) {
	}
}
function prev() {
	try {
		current_n = BigInteger(current_n).subtract(1).toString();
		update();
	} catch(e) {
	}
}

$('#prev').addEventListener('click',prev);
$('#next').addEventListener('click',next);

if(window.location.search.match(/^\?screensaver/)) {
	screensaver = true;
	setInterval(next,5000);
}
var path_n = window.location.pathname.slice(1).replace(/\/$/,'');
current_n = path_n || '2';
update();
