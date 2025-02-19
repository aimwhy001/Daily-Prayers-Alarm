// Adhan sound
const adhanSound = new Audio('adhan.mp3');  // Path to your Adhan mp3 file

document.getElementById('locationForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const location = document.getElementById('location').value;
    const country = document.getElementById('country').value;
    const state = document.getElementById('state').value;

    // Fetch prayer times from the Aladhan API
    const prayerTimes = await getPrayerTimes(location, country, state);

    if (prayerTimes) {
        // Display prayer times if successfully fetched
        displayPrayerTimes(prayerTimes);
        // Set alarms for each prayer time
        setPrayerAlarms(prayerTimes);
    } else {
        // Handle failure (show error message)
        alert('No internet connection. Please check your connection and try again.');
    }
});

async function getPrayerTimes(location, country, state) {
    try {
        const response = await fetch(`http://api.aladhan.com/v1/timingsByCity?city=${location}&country=${country}&state=${state}&method=2`);
        
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

// Display prayer times on the page
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

// Set alarms for each prayer time
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
                playAdhan(); // Play the Adhan sound when it's time for the prayer
            }, delay);
        }
    });
}

// Function to play the Adhan
function playAdhan() {
    adhanSound.play();
}