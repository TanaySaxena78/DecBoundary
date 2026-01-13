document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById("openPanelBtn");
    const closeBtn = document.getElementById("closePanelBtn");
    const panel = document.getElementById("confidencePanel");
    const scoreValue = document.getElementById("scoreValue");
    const scoreStatus = document.getElementById("scoreStatus");

    // Signal Data & Config
    const signals = {
        freshness: { points: 30, elementId: 'freshnessDetails' },
        sources: { points: 25, elementId: 'sourcesDetails' },
        permissions: { points: 25, elementId: 'permissionsDetails' },
        reversible: { points: 20, elementId: 'reversibleDetails' }
    };

    // Open/Close Panel
    openBtn.addEventListener("click", () => {
        panel.classList.remove("hidden");
        updateAllState();
    });

    closeBtn.addEventListener("click", () => {
        panel.classList.add("hidden");
    });

    document.addEventListener('click', (event) => {
        if (!panel.contains(event.target) && !openBtn.contains(event.target) && !panel.classList.contains('hidden')) {
            panel.classList.add('hidden');
        }
    });

    // --- Core Logic ---

    function updateAllState() {
        let score = calculateScore();
        updateScoreUI(score);
        updateSignalTexts();
    }

    function calculateScore() {
        let score = 0;
        for (let key in signals) {
            const checkbox = document.getElementById(key);
            if (checkbox && checkbox.checked) {
                score += signals[key].points;
            }
        }
        return score;
    }

    function updateScoreUI(score) {
        // Update number
        scoreValue.textContent = score;

        // Update Color & Status Text
        if (score >= 85) {
            scoreValue.style.color = "#006644"; // Green
            scoreStatus.textContent = "High confidence — safe to proceed";
            scoreStatus.style.color = "#006644";
        } else if (score >= 60) {
            scoreValue.style.color = "#ff8b00"; // Orange
            scoreStatus.textContent = "Moderate confidence — review recommended";
            scoreStatus.style.color = "#bf6900"; // Darker range
        } else {
            scoreValue.style.color = "#de350b"; // Red
            scoreStatus.textContent = "Low confidence — escalation advised";
            scoreStatus.style.color = "#de350b";
        }
    }

    function updateSignalTexts() {
        // Freshness Logic
        const freshnessCb = document.getElementById('freshness');
        const freshnessText = document.getElementById('freshnessDetails');
        if (freshnessText) {
            freshnessText.textContent = freshnessCb.checked
                ? "Based on access logs updated 3 hours ago"
                : "Last update was 9 days ago — may not reflect recent role changes";
        }

        // Sources Logic
        const sourcesCb = document.getElementById('sources');
        const sourcesText = document.getElementById('sourcesDetails');
        if (sourcesText) {
            sourcesText.textContent = sourcesCb.checked
                ? "Corroborated across HRIS, IAM, and audit logs"
                : "Only 1 source available — confidence reduced";
        }

        // Reversible Logic
        const reversibleCb = document.getElementById('reversible');
        const reversibleText = document.getElementById('reversibleDetails');
        if (reversibleText) {
            reversibleText.textContent = reversibleCb.checked
                ? "Access can be restored within 24 hours if needed"
                : "Reversal may require security admin approval";
        }
    }

    // --- Interaction Listeners ---

    // 1. Checkbox Toggles
    const checkboxes = document.querySelectorAll('.signal-header input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.addEventListener("change", (e) => {
            updateAllState();
            e.stopPropagation();
        });
    });

    // 2. Expand Signals
    const signalItems = document.querySelectorAll('.signal-item');
    signalItems.forEach(item => {
        const header = item.querySelector('.signal-header');
        header.addEventListener('click', (e) => {
            if (e.target.type === 'checkbox') return;
            item.classList.toggle('expanded');
        });
    });

    // 3. CTA Buttons
    // Proceed
    const proceedBtn = document.getElementById('proceedBtn');
    if (proceedBtn) {
        proceedBtn.addEventListener('click', () => {
            const container = document.getElementById('proceedContainer');
            container.innerHTML = `
                <div class="success-message">
                    Action queued
                    <span class="success-subtext">Audit log updated · Admin notified</span>
                </div>
            `;
        });
    }

    // Review Sources
    const reviewBtn = document.getElementById('reviewBtn');
    if (reviewBtn) {
        reviewBtn.addEventListener('click', () => {
            const list = document.getElementById('reviewSourcesList');
            if (list.style.display === 'block') {
                list.style.display = 'none';
                reviewBtn.style.background = 'white';
            } else {
                list.style.display = 'block';
                reviewBtn.style.background = '#ebecf0'; // Active state
            }
        });
    }

    // Escalate
    const escalateBtn = document.getElementById('escalateBtn');
    if (escalateBtn) {
        escalateBtn.addEventListener('click', () => {
            const msg = document.getElementById('escalationMsg');
            msg.style.display = 'block';
            // Optional: Hide after few seconds or keep static
        });
    }

    // 4. Explainability
    const explainLink = document.getElementById('explainLink');
    if (explainLink) {
        explainLink.addEventListener('click', (e) => {
            e.preventDefault();
            const text = document.getElementById('explainText');
            if (text.style.display === 'block') {
                text.style.display = 'none';
            } else {
                text.style.display = 'block';
            }
        });
    }

    // Initial Run
    updateAllState();
});
