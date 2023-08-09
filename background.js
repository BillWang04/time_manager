let data = {};

chrome.webNavigation.onCompleted.addListener(details => {
    const { tabId, url } = details;
    const currentTime = new Date().getTime();

    if (!data[tabId]) {
        data[tabId] = {
            url,
            startTime: currentTime,
            endTime: null
        };
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && data[tabId]) {
        data[tabId].endTime = new Date().getTime();
        const timeSpent = data[tabId].endTime - data[tabId].startTime;

        chrome.storage.local.get('timeData', (result) => {
            const timeData = result.timeData || {};


            const today = new Date().toLocaleDateString();
            //checks if timeData already in storage, if not, create new object
            if (!timeData[today]) {
                timeData = {};
            }
            //checks if there is a time in the timeData, if not, start it at 0
            if(!timeData[today][data[tabID].url]){
                timeData[today][data[tabID].url] = 0;
            }

            //adds time to the data of the url
            timeData[today][data[tabID].url] += timeSpent;

            //updates the time data
            chrome.storage.local.set({timeData})


        });



        // Save timeSpent data to storage (you'll need to implement this)
    }
});
