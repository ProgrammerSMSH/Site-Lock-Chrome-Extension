(async () => {
  const PIN_KEY = "sitePin";

  const getPin = async () => {
    const result = await chrome.storage.local.get(PIN_KEY);
    return result[PIN_KEY];
  };

  const setPin = async (pin) => {
    await chrome.storage.local.set({ [PIN_KEY]: pin });
  };

  const createUI = () => {
    const blur = document.createElement("div");
    blur.style.position = "fixed";
    blur.style.top = 0;
    blur.style.left = 0;
    blur.style.width = "100%";
    blur.style.height = "100%";
    blur.style.backdropFilter = "blur(25px)";
    blur.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    blur.style.zIndex = "99998";
    document.body.appendChild(blur);

    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.background = "#fff";
    modal.style.padding = "30px";
    modal.style.borderRadius = "16px";
    modal.style.boxShadow = "0 0 20px rgba(0,0,0,0.3)";
    modal.style.textAlign = "center";
    modal.style.zIndex = "99999";
    modal.innerHTML = `
      <h2 style="margin-bottom:15px;">🔐 Enter PIN</h2>
      <input id="pinInput" type="password" maxlength="4" placeholder="4-digit PIN" style="font-size:18px;padding:10px;width:160px;border-radius:8px;margin-bottom:10px;text-align:center;" />
      <br/>
      <button id="unlockBtn" style="background-color:#007bff;color:white;padding:10px 25px;border:none;border-radius:8px;font-size:16px;cursor:pointer;">Unlock</button>
      <p id="errorMsg" style="color:red;margin-top:10px;font-size:14px;"></p>
    `;
    document.body.appendChild(modal);

    document.getElementById("unlockBtn").addEventListener("click", async () => {
      const inputPin = document.getElementById("pinInput").value;
      const storedPin = await getPin();
      if (inputPin === storedPin) {
        blur.remove();
        modal.remove();
      } else {
        const err = document.getElementById("errorMsg");
        err.textContent = "❌ Wrong PIN. Tab will close...";
        // Auto close after 3 seconds
        setTimeout(() => {
          window.close();
        }, 3000);
      }
    });
  };

  const savedPin = await getPin();

  if (!savedPin) {
    const newPin = prompt("🛠 Set 4-digit PIN:");
    if (newPin && newPin.length === 4) {
      await setPin(newPin);
      alert("✅ PIN saved.");
    } else {
      alert("❌ Invalid PIN. Not saved.");
    }
    return;
  }

  createUI();
})();
