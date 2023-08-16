// popup.js

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
            const timeSpent = spentTodayData[today][domain].totalTime;
            if(domain.startsWith("www")){
                dailyStatsElement.innerHTML += `<p>${domain}: ${timeSpent} ms</p>`;
            }

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

