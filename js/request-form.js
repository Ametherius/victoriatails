// EmailJS settings - copy these from the EmailJS dashboard
const EMAILJS_PUBLIC_KEY = "S9-Mz6gd2c0aOV7lY";   // Account > General
const EMAILJS_SERVICE_ID = "EmailJsGmailService";   // Email Services
const EMAILJS_TEMPLATE_ID = "template_kav73zi"; // Email Templates

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

const form = document.getElementById("request-form");
const submitButton = document.getElementById("request-submit");
const statusBox = document.getElementById("request-status");
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

function showStatus(type, message) {
    statusBox.className = `alert alert-${type}`;
    statusBox.textContent = message;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    // Bots fill the hidden field; pretend it worked and send nothing
    if (form.website.value) {
        form.reset();
        showStatus("success", "Thank you! Your request was sent.");
        return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

    try {
        await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
        form.reset();
        form.classList.remove("was-validated");
        updateContactFields();
        showStatus("success", "Thank you! Your request was sent. I'll get back to you soon.");
    } catch (error) {
        console.error("EmailJS error:", error);
        showStatus("danger", "Sorry, something went wrong. Please try again or contact me on WhatsApp.");
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fa-solid fa-paper-plane me-2"></i>Send Request';
    }
});
