// Initialize an empty object to hold tab time data
let tabTimeData = {};
let mother = {'cow' : 'why is it not working'};

// Listen for when a navigation is completed in a tab
chrome.webNavigation.onCompleted.addListener(details => {
  const { tabId, url } = details;
  const currentTime = new Date().getTime();

  if (!tabTimeData[tabId]) {
    tabTimeData[tabId] = {
      url,
      startTime: currentTime,
      endTime: null
    };
  }
});

// Listen for when a tab is updated (e.g., when a page is refreshed)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tabTimeData[tabId]) {
    tabTimeData[tabId].endTime = new Date().getTime();
    const timeSpent = tabTimeData[tabId].endTime - tabTimeData[tabId].startTime;

    // Save tabTimeData to storage
    chrome.storage.local.set({ tabTimeData });
  }
});

chrome.storage.local.set({mother});

