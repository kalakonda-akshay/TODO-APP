# Taskpad: To-Do List with LocalStorage

A task manager built with plain HTML, CSS and JavaScript. No build step, no dependencies.

## Features

- Add tasks with the Add button or the Enter key
- Mark tasks complete or active with the checkbox
- Delete tasks with the x button
- Filter by All, Active or Completed
- Clear all completed tasks at once
- Progress bar and live open/done counts
- Tasks persist across page reloads (localStorage)
- Light and dark theme follow your system setting

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure |
| `style.css` | Styles and light/dark theme |
| `script.js` | State, rendering, events and storage |

## How to run

**Option 1: open the file (simplest)**

1. Unzip `todo-app.zip`.
2. Double-click `index.html`. It opens in your default browser.

**Option 2: local server (recommended, closest to a real website)**

Run one of these inside the unzipped `todo-app` folder, then open http://localhost:8000

```
python3 -m http.server 8000
```

or, if you have Node.js:

```
npx serve .
```

**Option 3: VS Code**

Install the "Live Server" extension, right-click `index.html`, choose "Open with Live Server".

Fonts load from Google Fonts, so the first load needs internet. Without it the app falls back to system fonts and works the same.

## Check that persistence works

1. Add a task.
2. Reload the page (F5). The task is still there.
3. In DevTools open Application > Local Storage and look for the key `taskpad.tasks.v1`. It holds your tasks as JSON.
4. To reset the app, delete that key (or run `localStorage.clear()` in the console) and reload.

## How it works

- **State:** one array of task objects `{ id, text, done, created }`. Every change updates the array, saves it, then calls `render()`.
- **DOM manipulation:** `render()` rebuilds the list with `createElement` and `textContent`, so typed text is never treated as HTML.
- **Events:** the form `submit` event handles both the Add button and the Enter key. One `click` listener on the list handles all delete buttons and one `change` listener handles all checkboxes (event delegation).
- **LocalStorage:** `save()` stores `JSON.stringify(tasks)`. On startup `load()` reads it back with `JSON.parse`. Both are wrapped in `try/catch` in case storage is blocked.

## Ideas to extend it

- Edit a task on double-click
- Due dates and sorting
- Drag to reorder
- Export and import tasks as a JSON file
