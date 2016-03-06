function randrange(min,max) {
	return Math.floor(Math.random()*(max-min))+min;
}

var superscripts = '⁰¹²³⁴⁵⁶⁷⁸⁹';

function superscript_number(n) {
    var s = '';
    while(n) {
        var d = n%10;
        s = superscripts[d]+s;
        n = (n-d)/10;
    }
    return s;
}

function Game() {
    var g = this;
	this.top = 50;
	this.queue = [];
	this.seen = {};
	this.num_seen = 0;
	this.add_queue();
	this.streak = 0;
    this.time_allowed = 60;
	document.body.className = 'start';
}
Game.prototype = {
    start: function() {
        var g = this;
        this.start_time = new Date();
        this.clock_interval = setInterval(function() {
            g.clock();
        },100)
        this.next_n();
		document.body.classList.remove('start');
		document.body.classList.add('play');
    },
	add_queue: function(n) {
		for(var i=0;i<10;i++) {
			if(this.num_seen==this.top) {
				this.top += 20;
			}
			var n = randrange(1,this.top);
			while(this.seen[n]) {
				n = randrange(1,this.top);
			}
			this.queue.push(2*n+1);
			this.seen[n] = true;
			this.top *= 1.1;
		}
	},
	check: function(answer) {
		var primality = is_prime(this.current_n);
		var prime = primality=='prime';
		if(prime==answer) {
			this.streak += 1;
			this.next_n();
		} else {
			this.end(prime ? 'prime' : 'composite');
		}
	},
	next_n: function() {
		this.current_n = this.queue.splice(0,1)[0];
		if(Math.random()<1/this.queue.length) {
			this.add_queue();
		}

		document.getElementById('n').innerText = this.current_n.toString();
		document.getElementById('score').innerText = this.streak;
	},
    clock: function() {
        var t = ((new Date())-this.start_time)/1000;
        var remaining = this.time_allowed - t;
        if(remaining<0) {
            this.end('time');
        } else {
            var tenths = Math.floor(remaining*10)%10;
            document.getElementById('time').innerText = Math.floor(remaining)+'.'+tenths;
        }
    },
	end: function(reason) {
        clearInterval(this.clock_interval);
		document.body.classList.remove('play');
		document.body.classList.add('end');
		document.getElementById('end-score').innerText = this.streak;
        var message;
        switch(reason) {
            case 'prime':
                message = '<span class="number">'+this.current_n+'</span> is prime';
                break;
            case 'composite':
                var factors = factorise(this.current_n);
                var decomposition = factors.map(function(a) {
                    return a[0]+'<sup>'+(a[1]>1 ? a[1] : '')+'</sup>';
                });
                message = '<span class="number">'+this.current_n+' = '+decomposition.join('×')+'</span>';
                break;
            case 'time':
                message = 'You ran out of time!';
                break;
        }
        document.getElementById('reason').innerHTML = message;
		this.ended = true;
		console.log("Ended",this.streak);
	}
}

var game = new Game();

document.getElementById('start').addEventListener('click',function() {
    game.start();
});
document.getElementById('yes').addEventListener('click',function() {
	game.check(true);
});
document.getElementById('no').addEventListener('click',function() {
	game.check(false);
});
document.getElementById('restart').addEventListener('click',function() {
    game = new Game();
    game.start();
});
