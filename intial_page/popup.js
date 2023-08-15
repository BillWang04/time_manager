// Get current date and display it in the dailyStats element
document.addEventListener('DOMContentLoaded', function () {
    const dailyStatsElement = document.getElementById('dailyStats');
    const todayHeading = document.getElementById('heading');
    const currentDate = new Date().toLocaleDateString();
    todayHeading.innerHTML = `<p>Today's Date: ${currentDate}</p>`;

    // Retrieve and display daily statistics
    chrome.storage.local.get('spentToday', (result) => {
        const timeData = result.spentToday;
        const today = new Date().toLocaleDateString();

        const dailyStatsElement = document.getElementById('dailyStats');
        dailyStatsElement.innerHTML = `<h2>Daily Statistics</h2>`;
        // dailyStatsElements.innerHTML = `<p>${today}</p>`;


        if (timeData[today]) {
            for (let domain in timeData[today]) {
                const timeSpent = timeData[today][domain].totalTime;
                dailyStatsElement.innerHTML += `<p>${domain}: ${timeSpent} ms</p>`;
            }
        } else {
            dailyStatsElement.innerHTML += `<p>No data available for today.</p>`;
        }
    });

//  

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const domainChangedDiv = document.getElementById('domain-changed');
    if (message.action === 'domainChanged') {
        domainChangedDiv.innerHTML = `TimerStarted: ${message.domain}`;
    }
    
    if (message.action === 'timerEnd'){
        domainChangedDiv.innerHTmL = `TimerStarted: ${message.domain}`;
    }
});


    // chrome.storage.local.get('mother', (result) => {
    //     const mother = result.mother;
    //     dailyStatsElement.innerHTML += `<p>google.com: ${mother['google.com']}</p>`;
    // });


    // Retrieve and display monthly comparison
    // You'll need to implement the logic for comparing with previous months



    // Example: Display a simple message in the monthlyComparison element
    const monthlyComparisonElement = document.getElementById('monthlyComparison');
    monthlyComparisonElement.innerHTML = '<p>Monthly comparison data will be displayed here.</p>';
});
