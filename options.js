document.addEventListener('DOMContentLoaded', () => {
    const blockedStringInput = document.getElementById('blockedString');
    const addStringButton = document.getElementById('addString');
    const blockedList = document.getElementById('blockedList');
  
    addStringButton.addEventListener('click', () => {
      const newString = blockedStringInput.value.trim();
      if (newString) {
        chrome.storage.sync.get('blockedStrings', (data) => {
          const blockedStrings = data.blockedStrings || [];
          if (!blockedStrings.includes(newString)) {
            blockedStrings.push(newString);
            chrome.storage.sync.set({ blockedStrings }, () => {
              updateBlockedList(blockedStrings);
              blockedStringInput.value = '';
            });
          }
        });
      }
    });
  
    function updateBlockedList(blockedStrings) {
      blockedList.innerHTML = '';
      blockedStrings.forEach((str) => {
        const li = document.createElement('li');
        li.textContent = str;
        blockedList.appendChild(li);
      });
    }
  
    chrome.storage.sync.get('blockedStrings', (data) => {
      updateBlockedList(data.blockedStrings || []);
    });
  });
  