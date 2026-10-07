function encodeForm(form) {
  return new URLSearchParams(new FormData(form)).toString();
}

async function submitNetlifyForm(form) {
  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encodeForm(form)
  });
  if (!response.ok) throw new Error("Form submission failed.");
}


function setRequestProgress(step, statusText) {
  const fill = document.getElementById("progressFill");
  const status = document.getElementById("progressStatus");
  const card = document.getElementById("requestProgressCard");
  const steps = document.querySelectorAll(".progress-step");
  if (!steps.length) return;

  steps.forEach((el, index) => {
    const number = index + 1;
    el.classList.toggle("complete", number < step);
    el.classList.toggle("active", number === step);
  });

  if (fill) {
    if (step <= 1) fill.style.height = "0%";
    else if (step === 2) fill.style.height = "50%";
    else fill.style.height = "100%";
  }

  if (status && statusText) status.textContent = statusText;

  if (card) {
    card.classList.remove("animate");
    void card.offsetWidth;
    card.classList.add("animate");
    setTimeout(() => card.classList.remove("animate"), 600);
  }
}

function startRequestProgress() {
  setRequestProgress(1, "Starting");
  setTimeout(() => setRequestProgress(2, "Getting details"), 520);
  setTimeout(() => setRequestProgress(1, "Ready to send"), 1150);
}

function completeRequestProgress() {
  setRequestProgress(2, "Request received");
  setTimeout(() => setRequestProgress(3, "Done"), 550);
}

function wireForm(formId, successId, sendingText, sentText) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const success = document.getElementById(successId);
    const originalText = button.textContent;
    try {
      button.disabled = true;
      button.textContent = sendingText;
      if (success) success.hidden = true;
      await submitNetlifyForm(form);
      if (formId === "requestForm") completeRequestProgress();
      form.reset();
      button.textContent = sentText;
      if (success) success.hidden = false;
      setTimeout(() => { button.textContent = originalText; button.disabled = false; }, 1800);
    } catch (error) {
      button.disabled = false;
      button.textContent = originalText;
      alert("Something went wrong. Please try again.");
      console.error(error);
    }
  });
}

wireForm("requestForm", "formSuccess", "Sending…", "Sent");
wireForm("helperForm", "helperSuccess", "Submitting…", "Submitted");

function goToRequest(prefill = "") {
  startRequestProgress();
  const requestSection = document.getElementById("request");
  const taskField = document.getElementById("task");
  if (prefill && taskField) {
    if (prefill === "Cleaning") taskField.value = "I need help with cleaning.";
    else if (prefill === "Yard Work") taskField.value = "I need help with yard work.";
    else if (prefill === "Organizing") taskField.value = "I need help with organizing.";
    else taskField.value = prefill;
  }
  if (requestSection) {
    requestSection.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => { if (taskField) taskField.focus(); }, 500);
  }
}

document.querySelectorAll(".service-choice").forEach(card => {
  card.addEventListener("click", () => goToRequest(card.dataset.service || ""));
});

const heroContinue = document.getElementById("heroContinue");
const heroTask = document.getElementById("heroTask");
if (heroContinue && heroTask) {
  heroContinue.addEventListener("click", () => goToRequest(heroTask.value.trim()));
  heroTask.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      goToRequest(heroTask.value.trim());
    }
  });
}
