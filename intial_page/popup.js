// You can add your JavaScript logic here for tracking and displaying time data



//each time you are a new website, a timer for that website starts. When you move
//away from that website, you stop the timer and start a new timer or resume the timer
//of a previous website

//after the day ends, you take the top 5 websites times and add them in storage
//and by the end of the week,

// Get current date and display it in the dailyStats element
document.addEventListener('DOMContentLoaded', function () {
    const dailyStatsElement = document.getElementById('dailyStats');
    const todayHeading = document.getElementById('heading');
    const currentDate = new Date().toLocaleDateString();
    todayHeading.innerHTML = `<p>Today's Date: ${currentDate}</p>`;

    // Retrieve and display daily statistics
    chrome.storage.local.get('tabTimeData', (result) => {
        const timeData = result.tabTimeData;
        const today = new Date().toLocaleDateString();

        const dailyStatsElement = document.getElementById('dailyStats');
        dailyStatsElement.innerHTML = `<h2>Daily Statistics</h2>`;
        // dailyStatsElements.innerHTML = `<p>${today}</p>`;


        if (timeData) {
            for (const tabID in timeData) {
                const timeSpent = tabID.timeSpent;
                dailyStatsElement.innerHTML += `<p>${tabID.domain}: ${timeSpent} ms</p>`;
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
