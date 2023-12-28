// import { sort } from 'fast-sort';
let isExpanded = false;


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



//sorting algo for checking all domains

// Function to sort spentToday by total time spent on each domain
function sortSpentTodayByTime(spentToday) {
    const today = new Date().toLocaleDateString();
    if (!spentToday[today]) return {};

    var entries = Object.entries(spentToday[today]);

    // Sum the time spent on each domain and sort based on the total time
    entries.sort((a, b) => {
        return b[1].totalTime - a[1].totalTime// Sort in descending order of total time
    });

    return entries;
}


// Function to update the popup UI with the spentToday data

async function updatePopupUI() {
    try {
        const spentTodayData = await getSpentTodayData() //await getSpentTodayData(); // grabs time values of specific day in an object
        
        const sortedSpentToday = sortSpentTodayByTime(spentTodayData); //put through sort
        // Get current date and display it in the dailyStats element
        const dailyStatsElement = document.getElementById('domainList');
        const todayHeading = document.getElementById('heading');
        const currentDate = new Date().toLocaleDateString();
        todayHeading.innerHTML = `<p>Today's Date: ${currentDate}</p>`;

        // Retrieve and display daily statistics
        const today = new Date().toLocaleDateString();
        
        if (sortedSpentToday) {
            for (const [domain, timeObject] of sortedSpentToday) {
                const timeSpent = msToTime(timeObject.totalTime);// changes into readable time
                if(timeSpent == "0.0 Sec"){
                    continue;
                }
                dailyStatsElement.innerHTML += `<p>${domain}: ${timeSpent}</p>`;
            }
        } else {
            dailyStatsElement.innerHTML += `<p>No data available for today.</p>`;
        }

        
        //adding toggle button
        const toggleButton = document.getElementById('toggleButton');
        domainList.parentNode.insertBefore(toggleButton, domainList.nextSibling);
        // Example: Display a simple message in the monthlyComparison element

        const monthlyComparisonElement = document.getElementById('monthlyComparison');
        monthlyComparisonElement.innerHTML = '<p>Monthly comparison data will be displayed here.</p>';
    } catch (error) {
        console.error('Error retrieving spentToday data:', error);
    }
}



function toggleList() {
    const domainList = document.getElementById('domainList');
    const toggleButton = document.getElementById('toggleButton');

    if (!isExpanded) {
        // Expand the list (show all domains)
        domainList.style.maxHeight = 'none'; // Remove the maximum height to show all
        toggleButton.textContent = 'Show Less';
        isExpanded = true;
    } else {
        // Collapse the list (show only some domains)
        domainList.style.maxHeight = '200px'; // Set a maximum height to show limited domains
        toggleButton.textContent = 'Show More';
        isExpanded = false;
    }
}


function main(){ 

    // Call the updatePopupUI function to display the data when the popup is opened
    document.addEventListener('DOMContentLoaded', () => {
        updatePopupUI();
    });

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
}

main();