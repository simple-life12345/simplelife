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
