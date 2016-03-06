function randrange(min,max) {
	return Math.floor(Math.random()*(max-min))+min;
}

function Game() {
	this.top = 50;
	this.queue = [];
	this.seen = {};
	this.num_seen = 0;
	this.add_queue();
	this.streak = 0;
	this.next_n();
	document.body.className = 'play';
}
Game.prototype = {
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
			this.end();
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
	end: function() {
		document.body.classList.remove('play');
		document.body.classList.add('end');
		document.getElementById('end-score').innerText = this.streak;
		this.ended = true;
		console.log("Ended",this.streak);
	}
}

var game = new Game();

document.getElementById('yes').addEventListener('click',function() {
	game.check(true);
});
document.getElementById('no').addEventListener('click',function() {
	game.check(false);
});
