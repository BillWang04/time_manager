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

// Function to update the popup UI with the spentToday data
async function updatePopupUI() {
    try {
        const spentTodayData = await getSpentTodayData();

        // Get current date and display it in the dailyStats element
        const dailyStatsElement = document.getElementById('domain_values');
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

document.addEventListener('DOMContentLoaded', )