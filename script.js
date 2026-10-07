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

function setVisualState(state, detailText = "") {
  const visual = document.getElementById("requestVisual");
  const title = document.getElementById("motionTitle");
  const detail = document.getElementById("motionDetail");
  if (!visual) return;

  visual.classList.remove("is-thinking", "is-assembling", "is-complete");

  if (state === "thinking") {
    visual.classList.add("is-thinking");
    if (title) title.textContent = "We’re on it.";
    if (detail) detail.textContent = detailText || "Getting your request ready.";
  } else if (state === "assembling") {
    visual.classList.add("is-assembling");
    if (title) title.textContent = "Putting it together.";
    if (detail) detail.textContent = "Almost there.";
  } else if (state === "complete") {
    visual.classList.add("is-complete");
    if (title) title.textContent = "Request sent.";
    if (detail) detail.textContent = "One less thing to think about.";
  } else {
    if (title) title.textContent = "Ready when you are.";
    if (detail) detail.textContent = "Start with any task.";
  }
}

function goToRequest(prefill = "") {
  const requestSection = document.getElementById("request");
  const taskField = document.getElementById("task");
  if (prefill && taskField) {
    if (prefill === "Cleaning") taskField.value = "I need help with cleaning.";
    else if (prefill === "Yard Work") taskField.value = "I need help with yard work.";
    else if (prefill === "Organizing") taskField.value = "I need help with organizing.";
    else taskField.value = prefill;
  }
  setVisualState("thinking", taskField?.value ? "We’ll take it from here." : "Getting your request ready.");
  requestSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => taskField?.focus(), 500);
}

document.querySelectorAll(".service-choice").forEach(card => {
  card.addEventListener("click", () => goToRequest(card.dataset.service || ""));
});

const heroContinue = document.getElementById("heroContinue");
const heroTask = document.getElementById("heroTask");
if (heroContinue && heroTask) {
  heroContinue.addEventListener("click", () => goToRequest(heroTask.value.trim()));
  heroTask.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      goToRequest(heroTask.value.trim());
    }
  });
}

const taskLive = document.getElementById("task");
if (taskLive) {
  taskLive.addEventListener("input", () => {
    if (taskLive.value.trim()) setVisualState("thinking", "We’ll take it from here.");
    else setVisualState("idle");
  });
}

function wireForm(formId, successId, sendingText, sentText) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const success = document.getElementById(successId);
    const originalText = button.textContent;

    try {
      button.disabled = true;
      button.textContent = sendingText;
      if (success) success.hidden = true;

      if (formId === "requestForm") setVisualState("thinking", "Sending your request.");
      await submitNetlifyForm(form);

      if (formId === "requestForm") {
        setVisualState("assembling");
        setTimeout(() => setVisualState("complete"), 1050);
      }

      form.reset();
      button.textContent = sentText;
      if (success) success.hidden = false;
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1800);
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
setVisualState("idle");