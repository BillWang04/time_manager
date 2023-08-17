


//miliseoncd converter
function msToTime(ms) {
    let seconds = (ms / 1000).toFixed(1);
    let minutes = (ms / (1000 * 60)).toFixed(1);
    let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) return seconds + " Sec";
    else if (minutes < 60) return minutes + " Min";
    else if (hours < 24) return hours + " Hrs";
    else return days + " Days"

}


// Function to retrieve spentToday data from storage
function getSpentTodayData() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('spentToday', result => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(result.spentToday || {});
        });
    });
}


//sorting algorithem for top 5, just use insertion

//sorting algo for checking all domains


// Function to update the popup UI with the spentToday data
async function updatePopupUI() {
    try {
        const spentTodayData = await getSpentTodayData();

        // Get current date and display it in the dailyStats element
        const dailyStatsElement = document.getElementById('dailyStats');
        const todayHeading = document.getElementById('heading');
        const currentDate = new Date().toLocaleDateString();
        todayHeading.innerHTML = `<p>Today's Date: ${currentDate}</p>`;

        // Retrieve and display daily statistics
        const today = new Date().toLocaleDateString();

        if (spentTodayData[today]) {
            for (const domain in spentTodayData[today]) {
                const timeSpent = msToTime(spentTodayData[today][domain].totalTime);
                dailyStatsElement.innerHTML += `<p>${domain}: ${timeSpent}</p>`;
            }
        } else {
            dailyStatsElement.innerHTML += `<p>No data available for today.</p>`;
        }

        // Example: Display a simple message in the monthlyComparison element
        const monthlyComparisonElement = document.getElementById('monthlyComparison');
        monthlyComparisonElement.innerHTML = '<p>Monthly comparison data will be displayed here.</p>';
    } catch (error) {
        console.error('Error retrieving spentToday data:', error);
    }
}

// Call the updatePopupUI function to display the data when the popup is opened
document.addEventListener('DOMContentLoaded', updatePopupUI);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const domainChangedDiv = document.getElementById('domain-changed');
    if (message.action === 'domainChanged') {
        domainChangedDiv.innerHTML = `TimerStarted: ${message.domain}`;
    }

    if (message.action === 'timerEnd') {
        domainChangedDiv.innerHTmL = `TimerStarted: ${message.domain}`;
    }
});




// Example: Display a simple message in the monthlyComparison element
const monthlyComparisonElement = document.getElementById('monthlyComparison');
monthlyComparisonElement.innerHTML = '<p>Monthly comparison data will be displayed here.</p>';

