// background.js

let tabTimeData = {}; // Object to hold tab time data
let spentToday = {}; // hold total amount of time today for each domain
const today = new Date().toLocaleDateString();
// Listen for when a navigation is committed in a tab
chrome.webNavigation.onCommitted.addListener(details => {
    const { tabId, url } = details;
    const domain = new URL(url).hostname;

    
    
    // Initialize tabTimeData for the tab if not already present
    if (!tabTimeData[tabId]) {
        tabTimeData[tabId] = {
            currentDomain: domain,
            startTime: new Date().getTime(),
            totalTime: 0
        };
    } else {
        // Calculate and update time spent on the previous domain
        const currentTime = new Date().getTime();
        const previousDomain = tabTimeData[tabId].currentDomain;
        const timeSpent = currentTime - tabTimeData[tabId].startTime;
        tabTimeData[tabId].totalTime += timeSpent;


        if(!spentToday[today]){
            spentToday[today] = {}
        };
        // Update tabTimeData for the new domain and add it too spentToday table
        if(!spentToday[today][previousDomain]){
            spentToday[today][previousDomain]= {
                totalTime: 0
            }
        };

        spentToday[today][previousDomain].totalTime += timeSpent;
        tabTimeData[tabId].currentDomain = domain;
        tabTimeData[tabId].startTime = currentTime;
        //set it to storage
        chrome.storage.local.set({spentToday});
    }
});

// Listen for tab removal to clean up tabTimeData
chrome.tabs.onRemoved.addListener(tabId => {
    delete tabTimeData[tabId];
});








