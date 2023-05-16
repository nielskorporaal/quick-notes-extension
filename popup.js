document.addEventListener("DOMContentLoaded", function () {
  var noteInput = document.getElementById("noteInput");
  var saveButton = document.getElementById("saveButton");
  var lineNumbers = document.querySelector(".line-numbers");
  var lineNumbersContainer = document.querySelector(".line-numbers-container");
  var toastContainer = document.getElementById("toastContainer");

  const CHARACTER_LIMIT = 75;
  const TOAST_TIMEOUT = 3000;

  document.documentElement.style.setProperty('--character-limit', CHARACTER_LIMIT+"ch");

  function updateLineNumbers() {
    var content = noteInput.value;
    var lineCount = 1;
    var characterCount = 0;
    var lineNumbersContent = lineCount+"\n";
  
    for (var i = 0; i < content.length; i++) {
      if (content[i] === "\n" || characterCount === CHARACTER_LIMIT) {
        lineCount++;
        characterCount = 0;
        lineNumbersContent += lineCount + "\n";
      }
      characterCount++;
    }
  
    lineNumbers.textContent = lineNumbersContent;
  }

  noteInput.addEventListener("input", function () {
    updateLineNumbers();
  });

  noteInput.addEventListener("scroll", function () {
    lineNumbersContainer.scrollTop = noteInput.scrollTop;
  });

  chrome.storage.local.get("note", function (data) {
    if (data.note) {
      noteInput.value = data.note;
      updateLineNumbers();
    }
  });

  noteInput.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      saveNote();
    }
  });

  function saveNote() {
    var note = noteInput.value;
    chrome.storage.local.set({ note: note }, function () {
      showToast("Content saved!");
    });
  }

  saveButton.addEventListener("click", function () {
    saveNote();
  });

  function showToast(message) {
    toastContainer.textContent = message;
    toastContainer.style.opacity = 1;

    setTimeout(function () {
      toastContainer.style.opacity = 0;
    }, TOAST_TIMEOUT);
  }
});
