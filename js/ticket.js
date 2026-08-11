/* =====================================================
   محادثة التذكرة — شات المستخدم والدعم
   ===================================================== */
function ticketById() {
  try {
    const id = new URLSearchParams(window.location.search).get("id");
    return getTicket(id) || null;
  } catch (e) { return null; }
}

function msgHTML(m) {
  const who = m.from === "user" ? "user" : "support";
  const name = who === "user" ? t("tkc.you") : t("tkc.support");
  return `
  <div class="msg ${who}">
    <span class="msg-meta">${name} • ${UI.fmtDate(m.date)}</span>
    <div class="bubble">${escStr(m.text)}</div>
    ${m.attach ? `<span class="attach-chip">📎 ${t("tkc.attachNote")} ${escStr(m.attach)}</span>` : ""}
  </div>`;
}

function renderTicket() {
  const root = document.getElementById("ticketRoot");
  if (!root) return;
  const x = ticketById();
  if (!x) {
    root.innerHTML = UI.empty("🎫", t("od.notFound"), t("od.notFoundSub"), "tickets.html", t("tkc.back"));
    return;
  }
  document.title = x.id + " — " + storeName();
  document.getElementById("tkcCrumb").textContent = x.subject;
  const closed = x.status === "closed";
  root.innerHTML = `
  <a class="btn btn-ghost" href="tickets.html" style="margin-bottom:16px">→ <span data-i18n="tkc.back"></span></a>

  <div class="chat-shell">
    <div class="chat-head">
      <span class="ch-avatar">🎧</span>
      <div style="flex:1;min-width:0">
        <b>${escStr(x.subject)} <span style="font-weight:400;color:var(--text-3)" dir="ltr">#${x.id}</span></b>
        <span>${UI.tkBadge(x.status)} ${t("tk.cat." + x.category)} • ${t("tk.priority")}: ${t("tk.priority." + x.priority)}</span>
      </div>
      ${closed
        ? `<button class="btn btn-ghost btn-sm" id="tkReopen" data-i18n="tkc.reopen"></button>`
        : `<button class="btn btn-ghost btn-sm" id="tkClose" data-i18n="tkc.close"></button>`}
    </div>
    <div class="chat-body" id="chatBody">
      ${x.messages.map(msgHTML).join("")}
      <div class="chat-day">📅 ${UI.fmtDate(x.date)}</div>
    </div>
    ${closed ? `<div class="chat-closed-bar" data-i18n="tkc.closed"></div>` : `
    <div class="chat-input">
      <textarea id="chatText" rows="1" placeholder="${escStr(t("tkc.input"))}"></textarea>
      <button class="icon-btn" id="chatSend" aria-label="${escStr(t("tkc.send"))}" title="${escStr(t("tkc.send"))}">${UI_ICONS.send}</button>
    </div>`}
  </div>`;

  const body = document.getElementById("chatBody");
  if (body) body.scrollTop = body.scrollHeight;

  document.getElementById("tkClose")?.addEventListener("click", () => {
    setTicketStatus(x.id, "closed");
    renderTicket();
  });
  document.getElementById("tkReopen")?.addEventListener("click", () => {
    setTicketStatus(x.id, "open");
    renderTicket();
  });
  const send = document.getElementById("chatSend");
  const text = document.getElementById("chatText");
  const doSend = () => {
    const val = text.value.trim();
    if (!val) return;
    addTicketMsg(x.id, { from: "user", text: val, date: new Date().toISOString() });
    if (x.status === "open") setTicketStatus(x.id, "processing");
    renderTicket();
  };
  send?.addEventListener("click", doSend);
  text?.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); doSend(); } });
}

function renderAll() {
  renderTicket();
  renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();
});
