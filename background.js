// Initialize an empty object to hold tab time data
let tabTimeData = {};

// Listen for when a navigation is completed in a tab
chrome.webNavigation.onCompleted.addListener(details => {
    const { url } = details;
    const today = new Date().toLocaleDateString();
    const currentTime = new Date().getTime();
    try {
        const urlObject = new URL(url);
        if (urlObject != "" || !urlObject.includes("google")) {
            const domain = urlObject.hostname;

            if (!tabTimeData[today]) {
                tabTimeData[today] = {};
            }

            if (!tabTimeData[today][domain]) {
                tabTimeData[today][domain] = {
                    startTime: currentTime,
                    endTime: null,
                    timeSpent: 0

                };
            }
            else {
                tabTimeData[today][domain].startTime = currentTime;
            }
        }
    }
    catch (error) {
        console.log('Error Parsing URL:', error);

    }
});

// Listen for when a tab is updated (e.g., when a page is refreshed)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        const { url } = tab;
        const today = new Date().toLocaleDateString();
        try {
            const urlObject = new URL(url);
            const domain = urlObject.hostname;

            if (changeInfo.status === 'complete' && tabTimeData[today][domain] && tabTimeData[today]) {
                tabTimeData[today][domain].endTime = new Date().getTime();
                const timeSpent = tabTimeData[today][domain].endTime - tabTimeData[today][domain].startTime;
                tabTimeData[today].timeSpent += timeSpent;
                // Save tabTimeData to storage
                chrome.storage.local.set({ tabTimeData });
            }
        }
        catch (error) {
            console.log('Error Parsing URL:', error);
        }
    }
});


