const REQUEST_PHONE = "2178199445";

function saveDemoRequest(key, data) {
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  existing.push({...data, createdAt: new Date().toISOString()});
  localStorage.setItem(key, JSON.stringify(existing));
}

function buildSmsUrl(phone, message) {
  const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const separator = isiOS ? "&" : "?";
  return `sms:${phone}${separator}body=${encodeURIComponent(message)}`;
}

const requestForm = document.getElementById("requestForm");
if (requestForm) {
  requestForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      task: document.getElementById("task").value.trim(),
      zip: document.getElementById("zip").value.trim(),
      timing: document.getElementById("timing").value,
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim()
    };

    saveDemoRequest("simpleLifeRequests", data);

    const message =
`New Simple Life request

Name: ${data.name}
Email: ${data.email}
ZIP: ${data.zip}
Timing: ${data.timing}

Task:
${data.task}`;

    document.getElementById("formSuccess").hidden = false;
    window.location.href = buildSmsUrl(REQUEST_PHONE, message);
  });
}

const helperForm = document.getElementById("helperForm");
if (helperForm) {
  helperForm.addEventListener("submit", (e) => {
    e.preventDefault();
    saveDemoRequest("simpleLifeHelpers", {
      name: document.getElementById("helperName").value,
      email: document.getElementById("helperEmail").value,
      zip: document.getElementById("helperZip").value,
      tasks: document.getElementById("helperTasks").value
    });
    document.getElementById("helperSuccess").hidden = false;
    helperForm.reset();
  });
}


function goToRequest(prefill = "") {
  const requestSection = document.getElementById("request");
  const taskField = document.getElementById("task");

  if (prefill && taskField) {
    if (prefill === "Cleaning") {
      taskField.value = "I need help with cleaning.";
    } else if (prefill === "Yard Work") {
      taskField.value = "I need help with yard work.";
    } else if (prefill === "Organizing") {
      taskField.value = "I need help with organizing.";
    } else {
      taskField.value = prefill;
    }
  }

  if (requestSection) {
    requestSection.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      if (taskField) {
        taskField.focus();
        taskField.setSelectionRange(taskField.value.length, taskField.value.length);
      }
    }, 500);
  }
}

document.querySelectorAll(".service-choice").forEach(card => {
  card.addEventListener("click", () => {
    goToRequest(card.dataset.service || "");
  });
});

const heroContinue = document.getElementById("heroContinue");
const heroTask = document.getElementById("heroTask");

if (heroContinue && heroTask) {
  heroContinue.addEventListener("click", () => {
    goToRequest(heroTask.value.trim());
  });

  heroTask.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      goToRequest(heroTask.value.trim());
    }
  });
}
