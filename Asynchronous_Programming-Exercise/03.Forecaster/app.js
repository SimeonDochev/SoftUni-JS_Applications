function attachEvents() {
    const submitBtn = document.getElementById('submit');
    const locationField = document.getElementById('location');
    const forecastDiv = document.getElementById('forecast');
    const currentDiv = document.getElementById('current');
    const upcomingDiv = document.getElementById('upcoming');

    submitBtn.addEventListener('click', getWeather);

    const symbols = {
        'Sunny': '&#x2600',
        'Partly sunny': '&#x26C5',
        'Overcast': '&#x2601',
        'Rain': '&#x2614',
        'Degrees': '&#176'
    };

    async function getWeather() {
        forecastDiv.style.display = '';
        currentDiv.innerHTML = '<div class="label">Current conditions</div>';
        upcomingDiv.innerHTML = '<div class="label">Three-day forecast</div>';
        document.querySelector('#current div').textContent = 'Loading...';

        upcomingDiv.style.display = 'none';

        const code = await getLocationCode();
        if (code == undefined) return;

        const [currentData, upcomingForecast] = await Promise.all([
            getCurrentForecast(code),
            getUpcomingForecast(code)
        ]);

        upcomingDiv.style.display = '';
        document.querySelector('#current div').textContent = 'Current conditions';

        currentDiv.innerHTML += `
        <div class="forecasts">
        <span class"condition symbol">${symbols[currentData.forecast.condition]}</span>
        <span class"condition">
        <span class"forecast-data">${currentData.name}</span>
        <span class"forecast-data">${currentData.forecast.low}${symbols['Degrees']}/${currentData.forecast.high}${symbols['Degrees']}</span>
        <span class"forecast-data">${currentData.forecast.condition}</span>
        </span>
        </div>`;

        upcomingDiv.innerHTML += '<div class"forecast-info">';

        for (let currentDay of upcomingForecast) {
            upcomingDiv.innerHTML += `
            <span class"upcoming">
            <span class"symbol">${symbols[currentDay.condition]}</span>
            <span class"forecast-data">${currentDay.low}${symbols['Degrees']}/${currentDay.high}${symbols['Degrees']}</span>
            <span class"forecast-data">${currentDay.condition}</span>
            </span>
            </div>`;
        }
    }

    async function getLocationCode() {
        const url = 'http://localhost:3030/jsonstore/forecaster/locations';

        try {
            const res = await fetch(url);
            if (res.status != 200) {
                throw new Error('Location not found');
            }
            const data = await res.json();
            const location = data.find(l => l.name == locationField.value);
            return location.code;
        } catch (error) {
            document.querySelector('#current div').textContent = 'Error';
        }
    }

    async function getCurrentForecast(code) {
        const url = `http://localhost:3030/jsonstore/forecaster/today/${code}`;

        try {
            const res = await fetch(url);
            if (res.status != 200) {
                throw new Error('Location code not found');
            }
            const data = await res.json();
            return data;
        } catch (error) {
            document.querySelector('#current div').textContent = 'Error';
        }
    }

    async function getUpcomingForecast(code) {
        const url = `http://localhost:3030/jsonstore/forecaster/upcoming/${code}`;

        try {
            const res = await fetch(url);
            if (res.status != 200) {
                throw new Error('Location code not found');
            }
            const data = await res.json();
            return data.forecast;
        } catch (error) {
            document.querySelector('#current div').textContent = 'Error';
        }
    }
}

attachEvents();