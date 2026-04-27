const input = document.getElementById('timeInput');
const result = document.getElementById('result');
const historyList = document.getElementById('historyList');

let history = JSON.parse(localStorage.getItem('history')) || [];

input.addEventListener('input', () => {
    const value = normalize(input.value);

    if (value === "" || value.endsWith(".")) {
        if (value ==="") result.textContent = "計算結果";
        return;
    }

    const minutes = calculateMinutes(value);
    result.textContent = formatMinutes(minutes);
    animateResult();
});

function normalize(text) {
    return text
    .replaceAll("．", ".")
    .replaceAll("：", ":")
    .replaceAll("＋", "+")
    .replaceAll("１", "1")
    .replaceAll("２", "2")
    .replaceAll("３", "3")
    .replaceAll("４", "4")
    .replaceAll("５", "5")
    .replaceAll("６", "6")
    .replaceAll("７", "7")
    .replaceAll("８", "8")
    .replaceAll("９", "9")
    .replaceAll("０", "0");
}

function calculateMinutes(text) {
    const parts = normalize(text).split('+');
    let total = 0;

    for (const part of parts) {
        total += parseTime(part.trim());
    }

    return total;
}

function parseTime(text) {
    const value = normalize(text);

    if (value.includes('.')) {
        const [h, m] = value.split('.');
        return Number(h) * 60 + Number(m);
    }

    if (value.includes(':')) {
        const [h, m] = value.split(':');
        return Number(h) * 60 + Number(m);
    }

    if (value.includes("時間")||value.includes("分")) {
        let total = 0;
        const hourMatch = value.match(/(\d+)時間/);
        const minuteMatch = value.match(/(\d+)分/);

        if (hourMatch) total += Number(hourMatch[1]) * 60;
        if (minuteMatch) total += Number(minuteMatch[1]);
        return total;
    }

    return Number(value) || 0;
}

function formatMinutes(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}時間${m}分`;
}

function addHistory(min) {
    const current = calculateMinutes(input.value);
    input.value = String(current + min);
    result.textContent = formatMinutes(current + min);
}

function addMinutes(min) {
    const current = calculateMinutes(input.value);
    input.value = String(current + min);
    result.textContent = formatMinutes(current + min);
}

function saveHistory() {
    const value = input.value.trim();
    if (value === "") return;

    history = history.filter(item => item !== value);
    history.unshift(value);
    history = history.slice(0, 5);

    localStorage.setItem('history', JSON.stringify(history));
    renderHistory();
}

function showMessage(text) {
    message.textContent = text;

    setTimeout(() => {
        message.textContent = "";
    }, 2000);
}

function animateResult() {
    result.style.transform = "scale(1.08)";
    result.style.opacity = "0.6";

    setTimeout(() => {
        result.style.transform = "scale(1)";
        result.style.opacity = "1";
    }, 150);
}


function clearHistory() {
  const ok = confirm("履歴をすべて削除しますか？");

  if (!ok) return;

  history = [];
  localStorage.removeItem("history");
  renderHistory();
  showMessage("履歴をすべて削除しました");
}

function renderHistory() {
  historyList.innerHTML = "";

  history.forEach(item => {
    const row = document.createElement("div");
    row.className = "history-row";

    const button = document.createElement("button");
    button.textContent = item;
    button.className = "history-item";
    button.onclick = () => {
      input.value = item;
      const minutes = calculateMinutes(item);
      result.textContent = formatMinutes(minutes);
    };

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "削除";
    deleteButton.className = "delete-button";
    deleteButton.onclick = () => {
      const ok = confirm(`「${item}」を削除しますか？`);
      if (!ok) return;

      history = history.filter(historyItem => historyItem !== item);
      localStorage.setItem("history", JSON.stringify(history));
      renderHistory();
      showMessage("履歴を1件削除しました");
    };

    row.appendChild(button);
    row.appendChild(deleteButton);
    historyList.appendChild(row);
  });
}

renderHistory();