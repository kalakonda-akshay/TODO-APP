(function () {
  var STORAGE_KEY = "taskpad.tasks.v1";
  var tasks = [];
  var filter = "all";
  var storageOk = true;

  var $form = document.getElementById("add-form");
  var $input = document.getElementById("new-task");
  var $host = document.getElementById("list-host");
  var $tally = document.getElementById("tally");
  var $progress = document.getElementById("progress");
  var $clear = document.getElementById("clear-done");
  var $status = document.getElementById("status");
  var $filters = document.querySelector(".filters");

  document.getElementById("today").textContent = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  /* ---------- storage ---------- */
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return null;
      var data = JSON.parse(raw);
      return Array.isArray(data) ? data : null;
    } catch (e) {
      storageOk = false;
      return null;
    }
  }
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      storageOk = false;
    }
  }

  /* ---------- state ---------- */
  function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  function addTask(text) {
    tasks.unshift({ id: newId(), text: text, done: false, created: Date.now() });
    save(); render();
  }
  function toggleTask(id) {
    tasks.forEach(function (t) { if (t.id === id) t.done = !t.done; });
    save(); render();
  }
  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    save(); render();
  }
  function clearCompleted() {
    tasks = tasks.filter(function (t) { return !t.done; });
    save(); render();
  }

  /* ---------- render ---------- */
  function fmtDate(ms) {
    return new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }

  function render() {
    var total = tasks.length;
    var doneCount = tasks.filter(function (t) { return t.done; }).length;
    var left = total - doneCount;

    $tally.innerHTML = "";
    var strong = document.createElement("strong");
    strong.textContent = left;
    $tally.appendChild(strong);
    $tally.appendChild(document.createTextNode(" open · " + doneCount + " done"));
    $progress.style.width = (total ? Math.round((doneCount / total) * 100) : 0) + "%";
    $clear.disabled = doneCount === 0;

    var visible = tasks.filter(function (t) {
      return filter === "all" || (filter === "done" ? t.done : !t.done);
    });

    $host.innerHTML = "";
    if (!visible.length) {
      var empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = total === 0
        ? "No tasks yet. Type one above and press Enter."
        : filter === "done" ? "Nothing completed yet." : "Everything is done. Nice.";
      $host.appendChild(empty);
    } else {
      var ul = document.createElement("ul");
      visible.forEach(function (t) {
        var li = document.createElement("li");
        li.dataset.id = t.id;
        if (t.done) li.className = "done";

        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "check";
        cb.checked = t.done;
        cb.id = "cb-" + t.id;
        cb.setAttribute("aria-label", "Mark complete");

        var label = document.createElement("label");
        label.className = "text";
        label.htmlFor = cb.id;
        label.textContent = t.text;

        var added = document.createElement("span");
        added.className = "added";
        added.textContent = fmtDate(t.created);

        var del = document.createElement("button");
        del.type = "button";
        del.className = "del";
        del.setAttribute("aria-label", "Delete task: " + t.text);
        del.textContent = "×";

        li.appendChild(cb);
        li.appendChild(label);
        li.appendChild(added);
        li.appendChild(del);
        ul.appendChild(li);
      });
      $host.appendChild(ul);
    }

    $status.textContent = storageOk ? "Saved in this browser" : "Storage unavailable: changes won't persist";
  }

  /* ---------- events ---------- */
  // submit fires for the Add button and for the Enter key inside the input
  $form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = $input.value.trim();
    if (!text) { $input.focus(); return; }
    addTask(text);
    $input.value = "";
    $input.focus();
  });

  // one listener for every row: find out what was clicked from event.target
  $host.addEventListener("click", function (e) {
    var li = e.target.closest("li");
    if (!li) return;
    if (e.target.closest(".del")) deleteTask(li.dataset.id);
  });
  $host.addEventListener("change", function (e) {
    var li = e.target.closest("li");
    if (li && e.target.classList.contains("check")) toggleTask(li.dataset.id);
  });

  $filters.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-filter]");
    if (!btn) return;
    filter = btn.dataset.filter;
    $filters.querySelectorAll("button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b === btn));
    });
    render();
  });

  $clear.addEventListener("click", clearCompleted);

  /* ---------- start ---------- */
  var stored = load();
  if (stored === null) {
    // first visit: example tasks so the list isn't empty (delete them freely)
    var now = Date.now();
    tasks = [
      { id: newId(), text: "Add event listeners for click and Enter", done: true, created: now - 86400000 * 2 },
      { id: newId(), text: "Reload this page and check my tasks are still here", done: false, created: now - 86400000 },
      { id: newId(), text: "Delete this example task", done: false, created: now }
    ];
    save();
  } else {
    tasks = stored;
  }
  render();
})();
