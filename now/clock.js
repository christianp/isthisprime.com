const worker = new Worker("./clockworker.js", {type: 'module'});

const YSCALE = 30; // number of seconds to scroll the height of the screen 

function unix_time() {
    return Math.floor((new Date()-0)/1000);
}

window.worker = worker;

worker.onmessage = (e) => {
    add_prime_time(e.data);
}

function add_prime_time(t) {
    const li = document.createElement('li');
    const time = document.createElement('time');
    document.getElementById('future-times').append(li);
    li.append(time);
    fill_time_element(time, t);
    function update() {
        const n = new Date();
        const dt = t - n/1000
        const y = dt/YSCALE;
        time.classList.toggle('offscreen', y>0.5);
        time.style['top'] = `calc(${(y+0.5)*100}vh - 1em)`;
        time.style['opacity'] = Math.max(0.2, Math.min(1, dt/2));
        if(y > -1) {
            requestAnimationFrame(update);
        } else {
            li.parentElement.removeChild(li);
        }
    }
    update();

    setTimeout(() => {
        document.getElementById('past-times').append(li);
        celebrate();
    }, t*1000 - new Date());
}

function celebrate() {
    document.getElementById('now').animate(
        { transform: [ 'rotate(0deg)', 'rotate(5deg)', 'rotate(-5deg)', 'rotate(0deg)' ]},
        { duration: 200, iterations: 4 }
    );
    document.body.animate(
        {backgroundColor: '#aaaa39'.split(' ')},
        { duration: 1000, iterations: 2, direction: 'alternate' }
    );
}

function fill_time_element(time_element, t) {
    const d = new Date(t*1000);
    time_element.textContent = `${t} (${d.toLocaleTimeString()})`;
    time_element.setAttribute('datetime', d.toISOString());
}

function update_now() {
    fill_time_element(document.getElementById('now'), unix_time());
}

setInterval(update_now,100)
