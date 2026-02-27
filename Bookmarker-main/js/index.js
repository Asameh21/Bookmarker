const phoneInput = document.getElementById("phoneInput");
const savedList = document.getElementById("savedList");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");

// Load saved data
window.onload = function () {
    reloadList();
};

// Save with button
saveBtn.addEventListener("click", saveEntry);

// Save with Enter
phoneInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        saveEntry();
    }
});

function saveEntry() {
    const phoneNumber = phoneInput.value.trim();
    if (phoneNumber === "") return;

    const now = new Date();
    const timeOnly = formatTime(now);

    const entry = {
        number: phoneNumber,
        time: timeOnly,
        timestamp: now.getTime()
    };

    const saved = getSaved();
    saved.push(entry);
    localStorage.setItem("phoneBookmarks", JSON.stringify(saved));

    phoneInput.value = "";
    reloadList();
}

// Clear all
clearBtn.addEventListener("click", function () {
    localStorage.removeItem("phoneBookmarks");
    savedList.innerHTML = "";
});

function getSaved() {
    return JSON.parse(localStorage.getItem("phoneBookmarks")) || [];
}

// Reload UI
function reloadList() {
    savedList.innerHTML = "";
    const saved = getSaved();
    saved.forEach((item, index) => addToList(item, index));
}

// Add item
function addToList(entry, index) {
    const li = document.createElement("li");

    li.innerHTML = `
        <span contenteditable="true" class="editable number">${entry.number}</span>
        -
        <span contenteditable="true" class="editable time">${entry.time}</span>
        <button class="deleteBtn">X</button>
    `;

    // Delete
    li.querySelector(".deleteBtn").addEventListener("click", function () {
        const saved = getSaved();
        saved.splice(index, 1);
        localStorage.setItem("phoneBookmarks", JSON.stringify(saved));
        reloadList();
    });

    // Edit phone number
    li.querySelector(".number").addEventListener("blur", function () {
        const saved = getSaved();
        saved[index].number = this.innerText.trim();
        localStorage.setItem("phoneBookmarks", JSON.stringify(saved));
    });

    // Edit time
    li.querySelector(".time").addEventListener("blur", function () {
        const newTimeText = this.innerText.trim();

        const parsedTime = parseTimeToTodayTimestamp(newTimeText);
        if (!parsedTime) {
            alert("Invalid time format. Use HH:MM");
            reloadList();
            return;
        }

        const saved = getSaved();
        saved[index].time = formatTime(new Date(parsedTime));
        saved[index].timestamp = parsedTime;
        localStorage.setItem("phoneBookmarks", JSON.stringify(saved));

        reloadList();
    });

    savedList.appendChild(li);

    checkTime(entry, li);
}

// Format time HH:MM
function formatTime(dateObj) {
    return dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}

// Convert HH:MM to today timestamp
function parseTimeToTodayTimestamp(timeStr) {
    const parts = timeStr.split(":");
    if (parts.length !== 2) return null;

    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);

    if (isNaN(hours) || isNaN(minutes)) return null;

    const now = new Date();
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);
    now.setMilliseconds(0);

    return now.getTime();
}

// 15 minute check
function checkTime(entry, li) {
    const now = Date.now();
    const diffMinutes = (now - entry.timestamp) / 60000;

    if (diffMinutes >= 15) {
        li.classList.add("followup-alert");
        speakAlert();
    }
}

// Auto check every minute
setInterval(() => {
    reloadList();
}, 60000);

// Voice
function speakAlert() {
    const speech = new SpeechSynthesisUtterance("There is a follow up now");
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
}