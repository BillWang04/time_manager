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











// // // Initialize an empty object to hold tab time data
// let tabTimeData = {};
// //Intialize current Domain
// let currentDomain = null;


// function sendUrlMessage(message, url) {
//     // Send message to popup script
//     chrome.runtime.sendMessage({ action: message, domain: new URL(url).hostname });
// }










// // chrome.webNavigation.onCommitted.addListener(details => {

// //     const { url } = details;
// //     const today = new Date().toLocaleDateString();
// //     try {
// //         if (currentDomain != null) {
// //             if (tabTimeData[today][currentDomain] && tabTimeData[today]) {
// //                 tabTimeData[today][currentDomain].endTime = new Date().getTime();
// //                 const timeSpent = tabTimeData[today][currentDomain].endTime - tabTimeData[today][currentDomain].startTime;
// //                 tabTimeData[today].timeSpent += timeSpent;
// //                 // Save tabTimeData to storage
// //                 chrome.storage.local.set({ tabTimeData });
// //             }
// //         }
// //     }
// //     catch (error) {
// //         console.log('Error Parsing URL:', error);
// //     }


// // });




// // // Listen for when a navigation is completed in a tab, it will start a timer
// chrome.webNavigation.onDOMContentLoaded.addListener(details => {
//     const { tabID, url } = details;
//     const today = new Date().toLocaleDateString();
//     const currentTime = new Date().getTime()
//     try {
//         const urlObject = new URL(url);
//         const domain = urlObject.hostname;

//         if (domain !== currentDomain && currentDomain !==null){
//             if (tabTimeData[today][currentDomain] && tabTimeData[today]) {
//                 tabTimeData[today][currentDomain].endTime = new Date().getTime();
//                 const timeSpent = tabTimeData[today][currentDomain].endTime - tabTimeData[today][currentDomain].startTime;
//                 tabTimeData[today].timeSpent += timeSpent;
//                 // Save tabTimeData to storage
//                 chrome.storage.local.set({ tabTimeData });
//             }
                        
//         }


//         //sending message to pop.js
//         // sendUrlMessage('domainChanged', url);
//         currentDomain = domain;

//         //starting timer in tabTimeData Object in domain
//         if (url && url.startsWith('http')) {

//             if (!tabTimeData[today]) {
//                 tabTimeData[today] = {};
//             }

//             if (!tabTimeData[today][domain]) {
//                 tabTimeData[today][domain] = {
//                     tabIDs: [tabID],
//                     startTime: currentTime,
//                     endTime: null,
//                     timeSpent: 0

//                 };
//             }
//             else {
//                 tabTimeData[today][domain].startTime = currentTime;
//             }
//         }
//         }
//     catch (error) {
//         console.log('Error Parsing URL:', error);

//     }
// });




// // // background.js

// // let tabUrlMap = {}; // Store tab URLs

// // // Listen for tab activation changes
// // chrome.tabs.onActivated.addListener(activeInfo => {
// //     const tabId = activeInfo.tabId;

// //     if (tabUrlMap[tabId]) {
// //         sendUrlMessage(tabId, tabUrlMap[tabId]);
// //     }
// // });

// // // Listen for when a navigation is committed in a tab
// // chrome.webNavigation.onCommitted.addListener(details => {
// //     const { tabId, url } = details;

// //     if (url && url.startsWith('http')) { // Filter out invalid URLs
// //         tabUrlMap[tabId] = url;

// //         if (chrome.tabs && chrome.tabs.query) {
// //             chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
// //                 if (tabs && tabs[0] && tabs[0].id === tabId) {
// //                     sendUrlMessage(tabId, url);
// //                 }
// //             });
// //         }
// //     }
// // });




// // // Listen for when a tab is updated (e.g., when a page is refreshed)
// // chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
// //         const { url } = tab;
// //         const today = new Date().toLocaleDateString();
// //         try {
// //             // 
// //             if (changeInfo.status === 'complete' && tabTimeData[today][currentDomain] && tabTimeData[today]) {

// //                 tabTimeData[today][currentDomain].endTime = new Date().getTime();
// //                 const timeSpent = tabTimeData[today][currentDomain].endTime - tabTimeData[today][currentDomain].startTime;
// //                 tabTimeData[today].timeSpent += timeSpent;
// //                 // Save tabTimeData to storage
// //                 chrome.storage.local.set({ tabTimeData });
// //             }
// //         }
// //         catch (error) {
// //             console.log('Error Parsing URL:', error);
// //         }
// // });