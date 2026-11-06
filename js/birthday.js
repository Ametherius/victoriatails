// Temporary birthday takeover. It stops showing on its own at the time below,
// and the normal hero is left in index.html underneath.
(function () {
    // Midnight at the end of Nov 6, 2026, Victoria time.
    const ENDS_AT = new Date("2026-11-07T00:00:00-08:00").getTime();
    const hero = document.querySelector(".hero-section");

    if (!hero || Date.now() >= ENDS_AT) return;

    const heading = ["Happy", "Birthday,", "Kaori!"];
    let letterIndex = 0;
    const headingHtml = heading.map((word) => {
        const letters = Array.from(word)
            .map((letter) => `<span class="bday-letter" style="--i:${letterIndex++}">${letter}</span>`)
            .join("");
        const nameClass = word === "Kaori!" ? " bday-word--name" : "";
        return `<span class="bday-word${nameClass}" aria-hidden="true">${letters}</span>`;
    }).join(" ");

    const takeover = document.createElement("section");
    takeover.className = "bday-takeover";
    takeover.innerHTML = `
        <div class="container bday-grid">
            <div class="bday-copy">
                <p class="bday-stamp">Notice: this website has been seized by the dogs</p>
                <h1 class="bday-title" aria-label="${heading.join(" ")}">${headingHtml}</h1>
                <p class="bday-line">Normal service resumes once we've had cake.</p>
                <p class="bday-signed">Signed, Draco, Ringo &amp; Bonzo</p>
                <a href="./appointment" class="btn btn-primary btn-lg px-5 py-3">Book Now</a>
            </div>
            <button type="button" class="bday-polaroid" aria-label="Celebrate with more confetti">
                <img src="./img/birthday-dogs.webp" width="1086" height="1448"
                    alt="Three dogs in Halloween bandanas on a couch, under a Happy Birthday Kaori sign">
                <span class="bday-caption">The Management</span>
            </button>
        </div>`;

    const heroWrapper = hero.parentElement;
    heroWrapper.hidden = true;
    heroWrapper.before(takeover);

    // Confetti is a bonus: if it can't load, the page still works.
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js";
    script.onload = () => {
        const paw = confetti.shapeFromPath({
            path: "M50 45c14 0 26 14 26 27 0 11-11 14-26 14s-26-3-26-14c0-13 12-27 26-27z" +
                "M20 30a9 11 0 1 0 .01 0zM40 10a9 12 0 1 0 .01 0zM60 10a9 12 0 1 0 .01 0zM80 30a9 11 0 1 0 .01 0z"
        });
        const celebrate = () => {
            const shared = { disableForReducedMotion: true, zIndex: 1040 };
            confetti({ ...shared, particleCount: 110, spread: 100, origin: { x: 0.5, y: 0.35 } });
            confetti({ ...shared, particleCount: 25, spread: 120, scalar: 3, shapes: [paw], colors: ["#ffffff", "#f0c808"], origin: { x: 0.5, y: 0.35 } });
        };
        setTimeout(celebrate, 1800);
        takeover.querySelector(".bday-polaroid").addEventListener("click", celebrate);
    };
    document.head.append(script);
})();
