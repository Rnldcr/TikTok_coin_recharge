let selectedPackage = null;

// Theme Toggle
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
}

// Package Selection
function selectPackage(coins, price) {
    selectedPackage = { coins, price };
    document.getElementById("rechargeBtn").style.display = "block";
}

// Custom Amount
function openCustom() {
    if (!selectedPackage) {
        alert("Please select a package first.");
        return;
    }
    document.getElementById("customCoins").value = selectedPackage.coins;
    document.getElementById("totalPrice").textContent = selectedPackage.price.toFixed(2);
    document.getElementById("customModal").style.display = "flex";
}

function confirmCustom() {
    const coins = parseInt(document.getElementById("customCoins").value);
    const price = (coins * 0.013).toFixed(2);
    document.getElementById("totalPrice").textContent = price;
    document.getElementById("customModal").style.display = "none";
    selectedPackage = { coins, price: parseFloat(price) };
    startRecharge();
}

// Vibration Feedback
function triggerVibration() {
    if ("vibrate" in navigator) {
        navigator.vibrate([50, 30, 50]);
    }
}

// Confetti Animation
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';

    const confettiCount = 200;
    const confetti = [];

    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            size: Math.random() * 5 + 3,
            color: ['#ff4d75', '#fe2c55', '#ffd700', '#4CAF50'][Math.floor(Math.random() * 4)],
            speed: Math.random() * 3 + 1,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 5
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let stillFalling = false;

        confetti.forEach(item => {
            item.y += item.speed;
            item.rotation += item.rotationSpeed;
            if (item.y < canvas.height) stillFalling = true;

            ctx.save();
            ctx.translate(item.x, item.y);
            ctx.rotate(item.rotation * Math.PI / 180);
            ctx.fillStyle = item.color;
            ctx.fillRect(-item.size / 2, -item.size / 2, item.size, item.size);
            ctx.restore();
        });

        if (stillFalling) {
            requestAnimationFrame(draw);
        } else {
            canvas.style.display = 'none';
        }
    }

    draw();

    // Auto hide after 3 seconds
    setTimeout(() => {
        canvas.style.display = 'none';
    }, 3000);
}

// Share Receipt Feature
function shareReceipt() {
    const username = document.getElementById("username").value || "User";
    const coins = document.getElementById("finalCoins").textContent;
    const receiptText = `🎉 TikTok Coin Recharge Receipt 🎉\n\nUsername: ${username}\nCoins Recharged: ${coins}\nDate: ${new Date().toLocaleDateString()}\n\nThank you for supporting creators! 💖`;

    if (navigator.share) {
        navigator.share({
            title: 'TikTok Coin Receipt',
            text: receiptText,
            url: window.location.href
        }).catch(err => {
            fallbackCopy(receiptText);
        });
    } else {
        fallbackCopy(receiptText);
    }
}

function fallbackCopy(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Receipt copied to clipboard! 📋");
    }).catch(err => {
        alert("Failed to copy. Please select and copy manually.");
        prompt("Copy this receipt:", text);
    });
}

// Recharge Flow
function startRecharge() {
    if (!selectedPackage) {
        alert("Please select a package or enter custom amount.");
        return;
    }

    document.getElementById("processingModal").style.display = "flex";

    setTimeout(() => {
        document.getElementById("processingModal").style.display = "none";
        document.getElementById("successModal").style.display = "flex";
        document.getElementById("finalCoins").textContent = selectedPackage.coins.toLocaleString();

        // Trigger effects
        triggerVibration();
        launchConfetti();
    }, 3000);
}

function closeSuccess() {
    document.getElementById("successModal").style.display = "none";
    selectedPackage = null;
    document.getElementById("rechargeBtn").style.display = "none";
}

// Auto-recharge after 3 seconds
setTimeout(() => {
    const username = document.getElementById("username");
    if (username.value.trim() !== "") {
        startRecharge();
    }
}, 3000);

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
};

// Resize canvas on window resize
window.addEventListener('resize', () => {
    const canvas = document.getElementById('confetti-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
