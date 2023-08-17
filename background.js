let tabTimeData = {}; // Object to hold tab time data
let spentToday = {}; // hold total amount of time today for each domain
const today = new Date().toLocaleDateString();

//get the main domain from the url
function getMainDomain(url){
    const parsURL = new URL(url);
    const parts = parsURL.hostname.split(".");
    if (parts.length > 2){
        return parts.slice(1).join('.');
    }
    return parsURL.hostname;
}


// Listen for when a navigation is committed in a tab
chrome.webNavigation.onCommitted.addListener(details => {
    const { tabId, url } = details;
    const domain = getMainDomain(url);
    if(domain === "" || domain === "new-tab-page"){
        console.log("ignored:", details);
        return;
    }

    // Check if tabTimeData already has data for this tabId
    if (!tabTimeData[tabId]) {
        console.log("created new tabID: ", details, "domain: ", domain )
        tabTimeData[tabId] = {
            currentDomain: domain,
            startTime: new Date().getTime(),
        };
    } else {
        // Calculate and update time spent on the previous domain
        const currentTime = new Date().getTime();
        const previousDomain = tabTimeData[tabId].currentDomain;
        const timeSpent = currentTime - tabTimeData[tabId].startTime;

        if (!spentToday[today]) {
            console.log("created spentToday Key: ", today, "---", details );
            spentToday[today] = {};
        }

        // Update spentToday for the previous domain
        if (!spentToday[today][previousDomain]) {
            spentToday[today][previousDomain] = {
                totalTime: 0
            };
            console.log("created new domain key in spentToday: ", previousDomain);
        }
        spentToday[today][previousDomain].totalTime += timeSpent;
        chrome.storage.local.set({spentToday});


        console.log("added time to spentToday: " , previousDomain, "--- ", timeSpent);
        console.log("Total Time ", previousDomain, ":",spentToday[today][previousDomain].totalTime  );

        // Update tabTimeData for the new domain
        tabTimeData[tabId].currentDomain = domain;
        tabTimeData[tabId].startTime = currentTime;

    }
});

// Listen for tab removal to clean up tabTimeData
chrome.tabs.onRemoved.addListener(tabId => {
    // Check if tabId exists in tabTimeData before deleting
    if (tabTimeData[tabId]) {
        const currentTime = new Date().getTime();
        const previousDomain = tabTimeData[tabId].currentDomain;
        const timeSpent = currentTime - tabTimeData[tabId].startTime;

        if (!spentToday[today]) {
            spentToday[today] = {};
        }

        // Update spentToday for the previous domain
        if (!spentToday[today][previousDomain]) {
            spentToday[today][previousDomain] = {
                totalTime: 0
            };
        }
        spentToday[today][previousDomain].totalTime += timeSpent;

        // Delete tabId from tabTimeData
        delete tabTimeData[tabId];

        // Update spentToday in storage
        chrome.storage.local.set({ spentToday });

        console.log("added time to spentToday: " , previousDomain, "--- ", timeSpent);
        console.log("Total Time ", previousDomain, ":",spentToday[today][previousDomain].totalTime  );

        //log the tab removed
        console.log('Tab Removed:', tabId);

    }
});


chrome.tabs.onActivated.addListener(activeInfo =>{
    const tabId = activeInfo.tabId;
    console.log("ACTIVATED TAB MOVEMENT");

    // Get the URL of the activated tab using onUpdated event
    chrome.tabs.onUpdated.addListener(function handleUpdated(tabId, changeInfo, tab) {
        if (tabId === activeInfo.tabId && changeInfo.url) {
            const newUrl = changeInfo.url;
            // Do something with the new URL, such as updating your extension's UI
            const domain = getMainDomain(newURL);
            console.log(domain, "got when moving between tabs")
            
            // Remove the listener to avoid duplicate calls for the same tab
            chrome.tabs.onUpdated.removeListener(handleUpdated);
        }
    });

});




