/* =====================================================
   صفحة تذاكري + إنشاء تذكرة
   ===================================================== */
function ticketCardHTML(x) {
  const last = x.messages[x.messages.length - 1];
  return `
  <a class="ticket-card" href="ticket.html?id=${encodeURIComponent(x.id)}">
    <div class="tc-head">
      <span class="tc-id" dir="ltr">#${x.id}</span>
      ${UI.tkBadge(x.status)}
    </div>
    <div class="tc-sub">${escStr(x.subject)}</div>
    <div class="tc-meta">
      <span class="badge purple">${t("tk.cat." + x.category)}</span>
      ${UI.prioBadge(x.priority)}
      <span>📅 ${UI.fmtDate(x.date)}</span>
      ${last ? `<span>💬 ${t("tkc.you")}: ${escStr(last.text)}</span>` : ""}
    </div>
  </a>`;
}

function renderTickets() {
  const list = document.getElementById("ticketsList");
  if (!list) return;
  const ts = getTickets();
  if (!ts.length) {
    list.innerHTML = UI.empty("🎫", t("tk.empty"), t("tk.emptySub"), "", "");
    return;
  }
  list.innerHTML = ts.map(ticketCardHTML).join("");
  initReveal();
}

function initTicketForm() {
  const btn = document.getElementById("tkNewBtn");
  const form = document.getElementById("tkForm");
  btn?.addEventListener("click", () => {
    form.style.display = form.style.display === "none" ? "" : "none";
    if (form.style.display !== "none") document.getElementById("tkSubject")?.focus();
  });
  document.getElementById("tkSend")?.addEventListener("click", () => {
    const subject = document.getElementById("tkSubject").value.trim();
    const text = document.getElementById("tkMsg").value.trim();
    if (!subject || !text) { showToast(t("product.required"), "err"); return; }
    const id = "TK-" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 90 + 10);
    addTicket({
      id,
      subject,
      category: document.getElementById("tkCat").value,
      priority: document.getElementById("tkPrio").value,
      status: "open",
      date: new Date().toISOString(),
      messages: [{ from: "user", text, date: new Date().toISOString() }],
    });
    showToast(t("tk.send"));
    document.getElementById("tkSubject").value = "";
    document.getElementById("tkMsg").value = "";
    form.style.display = "none";
    renderTickets();
    window.location.href = "ticket.html?id=" + id;
  });
}

function renderAll() {
  renderTickets();
  renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
  initTicketForm();
  renderAll();
});
