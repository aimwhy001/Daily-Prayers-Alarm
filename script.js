const adhanSound = new Audio('adhan.mp3');

document.getElementById('locationForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const location = document.getElementById('location').value;
    const country = document.getElementById('country').value;
    const state = document.getElementById('state').value;

    const prayerTimes = await getPrayerTimes(location, country, state);

    if (prayerTimes) {
        displayPrayerTimes(prayerTimes);
        setPrayerAlarms(prayerTimes);
    } else {
        alert('No internet connection. Please check your connection and try again.');
    }
});

async function getPrayerTimes(location, country, state) {
    try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${location}&country=${country}&state=${state}&method=2`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch prayer times');
        }

        const data = await response.json();

        if (data && data.data && data.data.timings) {
            return data.data.timings;
        } else {
            throw new Error('Prayer times not found in the API response');
        }
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        return null;
    }
}

function displayPrayerTimes(times) {
    const prayerTimesDiv = document.getElementById('prayerTimes');
    prayerTimesDiv.innerHTML = `<h2>Prayer Times</h2><ul>
        <li>Fajr: ${times.Fajr}</li>
        <li>Dhuhr: ${times.Dhuhr}</li>
        <li>Asr: ${times.Asr}</li>
        <li>Maghrib: ${times.Maghrib}</li>
        <li>Isha: ${times.Isha}</li>
    </ul>`;
}

function setPrayerAlarms(times) {
    Object.keys(times).forEach(prayer => {
        const prayerTime = times[prayer];
        const [time, period] = prayerTime.split(' ');
        const [hours, minutes] = time.split(':');
        let alarmTime = new Date();
        alarmTime.setHours(parseInt(hours) + (period === 'PM' ? 12 : 0), parseInt(minutes), 0, 0);

        const now = new Date();
        const delay = alarmTime - now;

        
        if (delay > 0) {
            setTimeout(() => {
                playAdhan();
            }, delay);
        }
    });
}

function playAdhan() {
    adhanSound.play();
}
