// EmailJS settings - copy these from the EmailJS dashboard
const EMAILJS_PUBLIC_KEY = "S9-Mz6gd2c0aOV7lY";   // Account > General
const EMAILJS_SERVICE_ID = "EmailJsGmailService";   // Email Services
const EMAILJS_TEMPLATE_ID = "template_kav73zi"; // Email Templates

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

const form = document.getElementById("request-form");
const submitButton = document.getElementById("request-submit");
const statusBox = document.getElementById("request-status");
const successBox = document.getElementById("request-success");
const pages = form.querySelectorAll(".request-page");
const stepIndicators = document.querySelectorAll("[data-step-indicator]");
const contactMethod = document.getElementById("contact_method");
const phone = document.getElementById("owner_phone");
const socialGroup = document.getElementById("social_handle_group");
const socialHandle = document.getElementById("social_handle");
const startDate = document.getElementById("start_date");
const endDate = document.getElementById("end_date");

// Ask for a phone number or username depending on how they want to be contacted
function updateContactFields() {
    const method = contactMethod.value;
    const needsSocial = method === "Instagram" || method === "Facebook Messenger";

    socialGroup.classList.toggle("d-none", !needsSocial);
    socialHandle.required = needsSocial;
    phone.required = method === "WhatsApp" || method === "Phone call / text";
}

contactMethod.addEventListener("change", updateContactFields);
updateContactFields();

// Don't allow dates in the past, or an end date before the start date
const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
startDate.min = today.toISOString().split("T")[0];
endDate.min = startDate.min;

startDate.addEventListener("change", () => {
    endDate.min = startDate.value || startDate.min;
    if (endDate.value && endDate.value < endDate.min) endDate.value = "";
});

// Two-step navigation
function showStep(step) {
    pages.forEach((page) => page.classList.toggle("d-none", page.dataset.step !== String(step)));
    stepIndicators.forEach((indicator) => {
        const n = Number(indicator.dataset.stepIndicator);
        indicator.classList.toggle("active", n === step);
        indicator.classList.toggle("done", n < step);
    });
    document.getElementById("request").scrollIntoView({ behavior: "smooth" });
}

// Highlights missing fields on the current page; returns true if it's complete
function validatePage(page) {
    const fields = [...page.querySelectorAll("input, select, textarea")];
    const valid = fields.every((field) => field.checkValidity());

    page.classList.toggle("was-validated", !valid);
    if (!valid) fields.find((field) => !field.checkValidity()).focus();
    return valid;
}

form.querySelector("[data-next]").addEventListener("click", () => {
    if (validatePage(pages[0])) showStep(2);
});

form.querySelector("[data-back]").addEventListener("click", () => showStep(1));

function showStatus(type, message) {
    statusBox.className = `alert alert-${type} mt-4`;
    statusBox.textContent = message;
}

function resetForm() {
    form.reset();
    pages.forEach((page) => page.classList.remove("was-validated"));
    statusBox.className = "alert d-none mt-4";
    updateContactFields();
}

function showSuccess() {
    resetForm();
    form.classList.add("d-none");
    document.querySelector(".request-steps").classList.add("d-none");
    successBox.classList.remove("d-none");
    document.getElementById("request").scrollIntoView({ behavior: "smooth" });
}

document.getElementById("request-again").addEventListener("click", () => {
    successBox.classList.add("d-none");
    form.classList.remove("d-none");
    document.querySelector(".request-steps").classList.remove("d-none");
    showStep(1);
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validatePage(pages[1])) return;

    // Bots fill the hidden field; pretend it worked and send nothing
    if (form.website.value) {
        showSuccess();
        return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

    try {
        await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
        showSuccess();
    } catch (error) {
        console.error("EmailJS error:", error);
        showStatus("danger", "Sorry, something went wrong. Please try again or contact me on WhatsApp.");
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fa-solid fa-paper-plane me-2"></i>Send Request';
    }
});
