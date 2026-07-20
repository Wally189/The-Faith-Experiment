(() => {
  const lessonId = document.body.dataset.lessonId || 'lesson-01';
  const storageKey = 'faith-experiment-completed-lessons';
  const lessons = [
    { id:'lesson-01', number:1, title:'The God question', href:'lesson-01.html', available:true },
    { id:'lesson-02', number:2, title:'What revelation is', available:false },
    { id:'lesson-03', number:3, title:'Scripture and Tradition', available:false },
    { id:'lesson-04', number:4, title:'Who is Jesus?', available:false },
    { id:'lesson-05', number:5, title:'Cross and Resurrection', available:false },
    { id:'lesson-06', number:6, title:'Grace and freedom', available:false },
    { id:'lesson-07', number:7, title:'Why matter matters', available:false },
    { id:'lesson-08', number:8, title:'The Eucharistic centre', available:false },
    { id:'lesson-09', number:9, title:'Conscience and virtue', available:false },
    { id:'lesson-10', number:10, title:'Learning to pray', available:false },
    { id:'lesson-11', number:11, title:'The common good', available:false },
    { id:'lesson-12', number:12, title:'The lay apostolate', available:false }
  ];

  const readCompleted = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return new Set(Array.isArray(saved) ? saved : []);
    } catch {
      return new Set();
    }
  };

  const completed = readCompleted();
  const save = () => localStorage.setItem(storageKey, JSON.stringify([...completed]));
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const existingList = sidebar.querySelector('.module-list');
  const selector = document.createElement('details');
  selector.className = 'lesson-selector';
  selector.innerHTML = `
    <summary>Choose a lesson</summary>
    <div class="lesson-selector-list">
      ${lessons.map(lesson => {
        const mark = completed.has(lesson.id) ? '<span class="lesson-status-mark" aria-label="Completed">✓</span>' : '';
        if (lesson.available) {
          return `<a href="${lesson.href}" class="${lesson.id === lessonId ? 'current' : ''}"><span>${lesson.number}. ${lesson.title}</span>${mark}</a>`;
        }
        return `<span class="unavailable"><span>${lesson.number}. ${lesson.title}</span>${mark}</span>`;
      }).join('')}
    </div>`;
  if (existingList) existingList.replaceWith(selector);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'lesson-complete';
  const note = document.createElement('p');
  note.className = 'lesson-complete-note';
  note.textContent = 'Saved on this device, so it remains marked when you return.';
  selector.insertAdjacentElement('afterend', button);
  button.insertAdjacentElement('afterend', note);

  const progressBar = sidebar.querySelector('.progress span');
  const lessonCount = lessons.length;
  const progressText = sidebar.querySelector('.progress + .small');

  function render() {
    const done = completed.has(lessonId);
    button.classList.toggle('done', done);
    button.textContent = done ? 'Lesson completed ✓' : 'Mark lesson complete';
    button.setAttribute('aria-pressed', String(done));

    selector.querySelectorAll('a, .unavailable').forEach((row, index) => {
      let mark = row.querySelector('.lesson-status-mark');
      const isDone = completed.has(lessons[index].id);
      if (isDone && !mark) {
        mark = document.createElement('span');
        mark.className = 'lesson-status-mark';
        mark.setAttribute('aria-label', 'Completed');
        mark.textContent = '✓';
        row.appendChild(mark);
      } else if (!isDone && mark) {
        mark.remove();
      }
    });

    if (progressBar) progressBar.style.width = `${Math.round((completed.size / lessonCount) * 100)}%`;
    if (progressText) progressText.textContent = `Lesson 1 of ${lessonCount} · ${completed.size} completed`;
  }

  button.addEventListener('click', () => {
    completed.has(lessonId) ? completed.delete(lessonId) : completed.add(lessonId);
    save();
    render();
  });

  render();
})();
