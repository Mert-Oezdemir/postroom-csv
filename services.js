(() => {
  'use strict';
  const serviceStatus = document.querySelector('#service-status');
  const prepare = document.querySelector('#prepare-send');
  const send = document.querySelector('#send-batch');
  const consent = document.querySelector('#send-consent');
  const review = document.querySelector('#send-review');
  const sendStatus = document.querySelector('#send-status');
  let configured = false;
  let batch = null;
  let version = 0;

  async function api(route, payload) {
    const response = await fetch('api/' + route, payload ? {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Project-Request': '1' },
      body: JSON.stringify(payload),
    } : {});
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'The request failed.');
    return result;
  }

  function reset() {
    version++;
    batch = null;
    consent.checked = false;
    send.disabled = true;
    review.replaceChildren();
    sendStatus.textContent = '';
  }
  for (const element of [csv, file, subject, message]) element.addEventListener('input', reset);
  file.addEventListener('change', reset);
  document.querySelector('#sample').addEventListener('click', reset);
  document.querySelector('#validate').addEventListener('click', reset);
  consent.addEventListener('change', () => { send.disabled = !batch || !consent.checked || !configured; });

  prepare.addEventListener('click', async () => {
    reset();
    if (!contacts.length || !subject.value.trim() || !message.value.trim()) {
      sendStatus.textContent = 'Check contacts and fill the subject and message first.';
      return;
    }
    const requestVersion = version;
    prepare.disabled = true;
    try {
      const result = await api('mail/batches', { drafts: contacts.map(makeDraft) });
      if (requestVersion !== version) return;
      batch = result;
      const list = document.createElement('ul');
      for (const delivery of result.deliveries) {
        const item = document.createElement('li');
        item.textContent = delivery.to + ' — ' + delivery.subject + ' (' + delivery.status + ')';
        list.append(item);
      }
      review.replaceChildren(list);
      sendStatus.textContent = 'Review the drafts above and authorize this batch to enable sending.';
    } catch (error) { sendStatus.textContent = error.message; }
    finally { prepare.disabled = !configured; }
  });

  send.addEventListener('click', async () => {
    if (!batch || !consent.checked) return;
    const id = batch.id;
    send.disabled = true;
    prepare.disabled = true;
    sendStatus.textContent = 'Sending. Keep this page open.';
    try {
      const result = await api('mail/batches/' + id + '/send', {});
      const counts = result.deliveries.reduce((counts, delivery) => {
        counts[delivery.status] = (counts[delivery.status] || 0) + 1;
        return counts;
      }, {});
      sendStatus.textContent = Object.entries(counts).map(([status, count]) => count + ' ' + status).join(', ') + '.';
      const list = document.createElement('ul');
      for (const delivery of result.deliveries) {
        const item = document.createElement('li');
        item.textContent = delivery.to + ': ' + delivery.status + (delivery.error ? '. ' + delivery.error : '');
        list.append(item);
      }
      review.replaceChildren(list);
    } catch (error) {
      sendStatus.textContent = error.message + ' Review this same batch again to check delivery states before retrying.';
    } finally {
      consent.checked = false;
      prepare.disabled = !configured;
    }
  });

  if (/^https?:$/.test(location.protocol)) {
    api('status').then(result => {
      configured = result.services.smtp;
      serviceStatus.textContent = configured ? 'SMTP account configured on the local server.'
        : 'Set SMTP_HOST, SMTP_PORT, SMTP_FROM and account credentials in the server .env file, then restart it.';
      prepare.disabled = !configured;
    }).catch(() => { serviceStatus.textContent = 'Use npm start to enable SMTP sending.'; });
  }
})();
