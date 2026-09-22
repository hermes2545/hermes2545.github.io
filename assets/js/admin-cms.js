(() => {
  const config = window.KNOWLEDGE_SHELF_CMS_CONFIG || {};
  let idToken = "";

  function setText(id, text) {
    const node = document.getElementById(id);
    if (node) node.textContent = text;
  }

  function decodeJwtPayload(token) {
    const payload = token.split(".")[1] || "";
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(Array.prototype.map.call(atob(normalized), c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join("")));
  }

  window.handleGoogleCredential = (response) => {
    try {
      const claims = decodeJwtPayload(response.credential);
      if (config.allowedEmail && (claims.email || "").toLowerCase() !== (config.allowedEmail || "").toLowerCase()) {
        setText("auth-status", "บัญชีนี้ไม่มีสิทธิ์ใช้งาน CMS นี้");
        return;
      }
      idToken = response.credential;
      setText("auth-status", `เข้าสู่ระบบแล้ว: ${claims.email}`);
      const panel = document.getElementById("cms-panel");
      if (panel) panel.hidden = false;
    } catch (error) {
      setText("auth-status", `อ่าน Google credential ไม่สำเร็จ: ${error.message}`);
    }
  };

  function readAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",", 2)[1] || "");
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-collection]");
    if (!button) return;
    document.querySelectorAll("[data-collection]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    setText("cms-status", button.dataset.collection === "reading" ? "Reading upload พร้อมใช้งาน" : "Collection นี้ใช้ระบบ auth/publish เดียวกัน และจะเปิดฟอร์มเฉพาะ metadata ในรอบต่อไป");
  });

  document.addEventListener("submit", async (event) => {
    if (event.target.id !== "reading-form") return;
    event.preventDefault();
    if (!idToken) {
      setText("cms-status", "กรุณา Sign in with Google ก่อน");
      return;
    }
    const form = new FormData(event.target);
    const htmlFile = form.get("html");
    const coverFile = form.get("cover");
    const payload = {
      html_base64: await readAsBase64(htmlFile),
      cover_base64: await readAsBase64(coverFile),
      metadata: {
        id: form.get("id"),
        title: form.get("title"),
        short_title: form.get("short_title"),
        category: form.get("category"),
        summary: form.get("summary"),
        accent: form.get("accent"),
        published_at: form.get("published_at")
      }
    };
    setText("cms-status", "กำลังส่งไป backend...");
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/reading/publish`, {
        method: "POST",
        headers: { "content-type": "application/json", "authorization": `Bearer ${idToken}` },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setText("cms-status", JSON.stringify(data, null, 2));
    } catch (error) {
      setText("cms-status", `เชื่อมต่อ backend ไม่สำเร็จ: ${error.message}`);
    }
  });
})();
