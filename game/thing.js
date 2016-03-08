var settings = {
	max: 0,
	time_allowed: 60,
	difficulty: 1
}

if(window.location.search) {
	var bits = window.location.search.slice(1).split('&');
	bits.forEach(function(b) {
		var a = b.split('=');
		var name = a[0];
		var value = a[1];
		switch(name) {
			case 'max':
				var max = parseInt(value);
				settings.max = (max+max%2)/2;
				break;
			case 'difficulty':
				settings.difficulty = parseFloat(value/50)+1;
				break;
			case 'time':
				settings.time_allowed = parseFloat(value);
				break;
		}
	});
}

function setting(name) {
	var container = document.getElementById('setting-'+name);
	var input = container.querySelector('input');
	var decrease = container.querySelector('.decrease');
	var increase = container.querySelector('.increase');
	input.value = settings[name];
	input.addEventListener('change',function() {
		settings[name] = parseFloat(input.value);
	});
	decrease.addEventListener('click',function() {
		settings[name]--
		input.value = settings[name];
	});
	increase.addEventListener('click',function() {
		settings[name]++;
		input.value = settings[name];
	});
}
for(var key in settings) {
	setting(key);
}


function randrange(min,max) {
	return Math.floor(Math.random()*(max-min))+min;
}

function superscript_number(n) {
    var s = '';
    while(n) {
        var d = n%10;
        s = superscripts[d]+s;
        n = (n-d)/10;
    }
    return s;
}

function shuffle(l) {
	for(var i=l.length-1;i>=0;i--) {
		var n = Math.floor(Math.random()*i);
		var t = l[n];
		l[n] = l[i];
		l[i] = t;
	}
	return l;
}

function Game() {
	var g = this;
	this.max = settings.max>0 ? settings.max : Infinity;
    this.time_allowed = settings.time_allowed;
	this.difficulty = 1+settings.difficulty/50;
	this.top = Math.min(40,this.max);
	this.queue = [];
	this.num_generated = 0;
	this.choices = [];
	this.num_seen = 0;
	this.streak = 0;

	this.add_queue();
	document.body.className = 'start';
}
Game.prototype = {
    start: function() {
        var g = this;
		this.started = true;
        this.start_time = new Date();
        this.clock_interval = setInterval(function() {
            g.clock();
        },100)
        this.next_n();
		document.body.className = 'play';
    },
	add_queue: function(n) {
		if(this.num_seen>=this.top) {
			this.top += 20;
			this.max = Infinity;
		}
		while(this.num_generated<this.top) {
			this.num_generated += 1;
			this.queue.push(2*this.num_generated-1);
		}
		this.queue = shuffle(this.queue);
	},
	check: function(answer) {
		var primality = is_prime(this.current_n);
		var prime = primality=='prime';
		if(prime==answer) {
			this.streak += 1;
			this.top *= this.difficulty;
			this.top = Math.min(this.top,this.max);
			this.next_n();
		} else {
			this.end(prime ? 'prime' : 'composite');
		}
	},
	next_n: function() {
		this.add_queue();
		this.num_seen += 1;
		this.current_n = this.queue.splice(0,1)[0];

		document.getElementById('n').innerHTML = this.current_n.toString();
		document.getElementById('score').innerHTML = this.streak;
	},
    clock: function() {
        var t = ((new Date())-this.start_time)/1000;
        var remaining = this.time_allowed - t;
        if(remaining<0) {
            this.end('time');
        } else {
            var tenths = Math.floor(remaining*10)%10;
            document.getElementById('time').innerHTML = Math.floor(remaining)+'.'+tenths;
        }
    },
	end: function(reason) {
        clearInterval(this.clock_interval);
		document.body.className = 'end';
		document.getElementById('end-score').innerHTML = this.streak;
        var message;
        switch(reason) {
            case 'prime':
                message = '<span class="number">'+this.current_n+'</span> is prime.';
                break;
            case 'composite':
				if(this.current_n==1) {
					message = '<span class="number">1</span> is non-prime by definition.';
					break;
				}
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
		document.getElementById('restart').focus();
		this.ended = true;
	}
}

var game = new Game();

document.getElementById('start').addEventListener('click',function() {
    game.start();
});
document.getElementById('settings-start').addEventListener('click',function() {
    game = new Game();
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
document.getElementById('settings').addEventListener('click',function() {
	game.end();
	document.body.className='settings';
});

document.body.addEventListener('keydown',function(e) {
	if(game.ended || !game.started) {
		return;
	}
	switch(e.keyCode) {
		case 89:	// 'y'
		case 37:	// left arrow
			game.check(true);
			break;
		case 78:	// 'n'
		case 39:	// right arrow
			game.check(false);
			break;
	}
});
