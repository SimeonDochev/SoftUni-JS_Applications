function solve() {
    const departBtn = document.getElementById('depart');
    const arriveBtn = document.getElementById('arrive');
    const infoDiv = document.getElementById('info');

    let currentStopId = 'depot';
    let stopName = '';

    async function depart() {
        departBtn.disabled = true;
        const url = `http://localhost:3030/jsonstore/bus/schedule/${currentStopId}`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        infoDiv.textContent = `Next Stop ${data.name}`;
        currentStopId = data.next;
        stopName = data.name;
        arriveBtn.disabled = false;
    }

    function arrive() {
        departBtn.disabled = false;
        arriveBtn.disabled = true;

        infoDiv.textContent = `Arriving at ${stopName}`;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();