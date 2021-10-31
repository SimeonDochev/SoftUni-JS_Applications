async function getInfo() {
    const stopId = document.getElementById('stopId').value;
    const stopNameField = document.getElementById('stopName');
    const busList = document.getElementById('buses');
    const checkBtn = document.getElementById('submit');
    const url = `http://localhost:3030/jsonstore/bus/businfo/${stopId}`;

    try {
        stopNameField.textContent = 'Loading...';
        busList.replaceChildren();
        checkBtn.disabled = true;

        const res = await fetch(url);
        if (res.ok == false || res.status != 200) {
            throw new Error('Stop ID Not Found');
        }
        const data = await res.json();
        stopNameField.textContent = data.name;
        Object.entries(data.buses).forEach(bus => {
            let newLi = document.createElement('li');
            newLi.textContent = `Bus ${bus[0]} arrives in ${bus[1]} minutes`;
            busList.appendChild(newLi);
        })
    } catch(error) {
        stopNameField.textContent = 'Error';
        checkBtn.disabled = false;
    }
    checkBtn.disabled = false;
}