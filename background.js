chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blockedStrings: [] }, () => {
      updateRules();
    });
  });
  
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes.blockedStrings) {
      updateRules();
    }
  });
  
  chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    chrome.storage.sync.get("blockedStrings", (data) => {
      const blockedStrings = data.blockedStrings || [];
      for (const str of blockedStrings) {
        if (details.url.includes(str)) {
          console.log(`Blocked URL: ${details.url}, Blocked String: ${str}`);
          break;
        }
      }
    });
  }, { url: [{ urlMatches: '<all_urls>' }] });
  
  function updateRules() {
    chrome.storage.sync.get("blockedStrings", (data) => {
      const blockedStrings = data.blockedStrings || [];
      const rules = blockedStrings.map((str, index) => ({
        id: index + 1,
        priority: 1,
        action: { type: "block" },
        condition: { urlFilter: str }
      }));
  
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rules.map((rule) => rule.id),
        addRules: rules
      }, () => {
        console.log('Rules updated:', rules);
      });
    });
  }
  