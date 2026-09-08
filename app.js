const STORAGE_KEY = 'gnx-agent-intake-v1';

const questions = [
  {
    id: 'mission',
    title: 'Si este agente solo pudiera resolver una cosa, ¿qué tendría que cambiar?',
    hint: 'Empieza por el resultado que quieres provocar, no por la tecnología que imaginas.',
    type: 'text',
    label: 'La intención',
    placeholder: 'Ej. Que el equipo deje de perder horas buscando información...'
  },
  {
    id: 'role',
    title: '¿Qué papel debería jugar en el día a día?',
    hint: 'Elige una primera personalidad operativa. Podrás combinarla más adelante.',
    type: 'choices',
    label: 'El papel',
    choices: ['Analista', 'Copiloto', 'Orquestador', 'Guardián', 'Explorador']
  },
  {
    id: 'context',
    title: 'Cuéntale el contexto que una persona nueva tardaría semanas en entender.',
    hint: 'Clientes, procesos, lenguaje interno, sistemas, tensiones o cualquier detalle que cambie la lectura.',
    type: 'textarea',
    label: 'El contexto',
    placeholder: 'Escribe como se lo contarías a alguien de confianza...'
  },
  {
    id: 'evidence',
    title: '¿Tienes una historia, reunión o intuición que debamos escuchar?',
    hint: 'Sube una nota de voz. No hace falta ordenarla: la señal está también en cómo lo cuentas.',
    type: 'audio',
    label: 'La voz',
    placeholder: 'Puedes continuar sin audio y añadirlo después.'
  },
  {
    id: 'success',
    title: '¿Cómo sabrás, dentro de 30 días, que este agente está funcionando?',
    hint: 'Busca una señal observable: una decisión más rápida, menos retrabajo, una métrica que se mueve.',
    type: 'text',
    label: 'La prueba',
    placeholder: 'Ej. Las propuestas salen en la mitad de tiempo y con menos revisiones.'
  }
];

const state = loadState();
const refs = {
  stepNumber: document.querySelector('#stepNumber'), progressTitle: document.querySelector('#progressTitle'),
  progressPercent: document.querySelector('#progressPercent'), progressBar: document.querySelector('#progressBar'),
  questionType: document.querySelector('#questionType'), questionIndex: document.querySelector('#questionIndex'),
  questionTitle: document.querySelector('#questionTitle'), questionHint: document.querySelector('#questionHint'),
  inputArea: document.querySelector('#inputArea'), nextButton: document.querySelector('#nextButton'),
  skipButton: document.querySelector('#skipButton'), validationMessage: document.querySelector('#validationMessage'),
  dnaList: document.querySelector('#dnaList'), agentName: document.querySelector('#agentName'), savedCount: document.querySelector('#savedCount'),
  resultModal: document.querySelector('#resultModal'), resultSummary: document.querySelector('#resultSummary'),
  closeModal: document.querySelector('#closeModal'), copyButton: document.querySelector('#copyButton'),
  downloadButton: document.querySelector('#downloadButton'), copyFeedback: document.querySelector('#copyFeedback'), resetButton: document.querySelector('#resetButton')
};

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { current: 0, answers: {} }; }
  catch { return { current: 0, answers: {} }; }
}

function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function displayValue(answer) {
  if (!answer) return '';
  if (answer.kind === 'audio') return `Audio adjunto: ${answer.name}`;
  return answer.value || '';
}

function render() {
  const question = questions[state.current];
  const step = state.current + 1;
  const percent = Math.round((step / questions.length) * 100);
  refs.stepNumber.textContent = String(step).padStart(2, '0');
  refs.progressTitle.textContent = question.label;
  refs.progressPercent.textContent = `${percent}%`;
  refs.progressBar.style.width = `${percent}%`;
  refs.questionType.textContent = question.type === 'audio' ? 'NOTA DE VOZ' : question.type === 'choices' ? 'ELIGE UNA O MÁS' : 'TEXTO LIBRE';
  refs.questionIndex.textContent = `Q${step}`;
  refs.questionTitle.textContent = question.title;
  refs.questionHint.textContent = question.hint;
  refs.validationMessage.textContent = '';
  refs.nextButton.innerHTML = state.current === questions.length - 1 ? 'Mintear agente <span>✳</span>' : 'Guardar señal <span>↗</span>';
  refs.skipButton.innerHTML = state.current === questions.length - 1 ? 'Volver atrás <span>←</span>' : 'Saltar por ahora <span>→</span>';
  refs.inputArea.innerHTML = buildInput(question);
  hydrateInput(question);
  renderDna();
}

function buildInput(question) {
  if (question.type === 'choices') {
    return `<div class="chip-grid" role="group" aria-label="${question.title}">${question.choices.map(choice => `<button type="button" class="choice-chip" data-choice="${choice}">${choice}</button>`).join('')}</div>`;
  }
  if (question.type === 'audio') {
    return `<div class="audio-drop" id="audioDrop"><div class="audio-icon">◉</div><div class="audio-copy"><strong>Deja caer un audio aquí</strong><span>MP3, M4A, WAV · máximo 25 MB</span><label class="upload-link" for="audioInput">o elige un archivo</label><input class="file-input" id="audioInput" type="file" accept="audio/*" /><div class="audio-file" id="audioFile"></div></div></div>`;
  }
  const isLong = question.type === 'textarea';
  return isLong ? `<textarea class="answer-input" id="answerInput" rows="4" maxlength="800" placeholder="${question.placeholder}"></textarea>` : `<input class="answer-input" id="answerInput" type="text" maxlength="280" placeholder="${question.placeholder}" autocomplete="off" />`;
}

function hydrateInput(question) {
  const answer = state.answers[question.id];
  if (question.type === 'choices') {
    const selected = answer?.value || [];
    document.querySelectorAll('[data-choice]').forEach(button => {
      button.classList.toggle('selected', selected.includes(button.dataset.choice));
      button.addEventListener('click', () => button.classList.toggle('selected'));
    });
  } else if (question.type === 'audio') {
    const drop = document.querySelector('#audioDrop');
    const input = document.querySelector('#audioInput');
    if (answer?.name) document.querySelector('#audioFile').textContent = `✓ ${answer.name}`;
    input.addEventListener('change', event => handleAudio(event.target.files[0]));
    ['dragenter', 'dragover'].forEach(eventName => drop.addEventListener(eventName, event => { event.preventDefault(); drop.classList.add('dragging'); }));
    ['dragleave', 'drop'].forEach(eventName => drop.addEventListener(eventName, event => { event.preventDefault(); drop.classList.remove('dragging'); }));
    drop.addEventListener('drop', event => handleAudio(event.dataTransfer.files[0]));
  } else {
    const input = document.querySelector('#answerInput');
    if (answer?.value) input.value = answer.value;
    input.focus();
  }
}

function handleAudio(file) {
  if (!file) return;
  if (!file.type.startsWith('audio/')) { refs.validationMessage.textContent = 'Selecciona un archivo de audio.'; return; }
  if (file.size > 25 * 1024 * 1024) { refs.validationMessage.textContent = 'El audio supera el máximo de 25 MB.'; return; }
  state.answers.evidence = { kind: 'audio', name: file.name, size: file.size, type: file.type };
  document.querySelector('#audioFile').textContent = `✓ ${file.name}`;
  refs.validationMessage.textContent = '';
}

function collectAnswer(question) {
  if (question.type === 'choices') return [...document.querySelectorAll('.choice-chip.selected')].map(button => button.dataset.choice);
  if (question.type === 'audio') return state.answers.evidence || null;
  return document.querySelector('#answerInput')?.value.trim() || '';
}

function saveAndMove(skip = false) {
  const question = questions[state.current];
  const value = skip ? null : collectAnswer(question);
  const empty = value === null || value === '' || (Array.isArray(value) && value.length === 0);
  if (!skip && empty) { refs.validationMessage.textContent = 'Dale al agente aunque sea una primera pista, o sáltala por ahora.'; return; }
  if (value !== null) state.answers[question.id] = Array.isArray(value) ? { value } : typeof value === 'object' ? value : { value };
  else delete state.answers[question.id];
  persist();
  if (state.current === questions.length - 1 && !skip) { renderDna(); openResult(); return; }
  state.current = Math.min(questions.length - 1, state.current + (skip ? 1 : 1));
  persist(); render();
}

function renderDna() {
  const items = [
    ['01', 'Intención', displayValue(state.answers.mission)], ['02', 'Papel', displayValue(state.answers.role)],
    ['03', 'Contexto', displayValue(state.answers.context)], ['04', 'Evidencia', displayValue(state.answers.evidence)],
    ['05', 'Prueba de éxito', displayValue(state.answers.success)]
  ];
  refs.dnaList.innerHTML = items.map(([number, label, value]) => `<div class="dna-item ${value ? '' : 'empty'}"><span class="dna-item-number">${number}</span><div><span class="dna-item-label">${label}</span><span class="dna-item-value">${value || 'Esperando una señal...'}</span></div></div>`).join('');
  const mission = displayValue(state.answers.mission);
  refs.agentName.textContent = mission ? `${mission.slice(0, 25)}${mission.length > 25 ? '…' : ''}` : 'Agente sin nombre';
  const count = Object.keys(state.answers).length;
  refs.savedCount.textContent = `${count} ${count === 1 ? 'señal guardada' : 'señales guardadas'}`;
}

function buildPayload() {
  return { agent: { name: displayValue(state.answers.mission) || 'Agente inicial', createdAt: new Date().toISOString(), status: 'draft' }, answers: state.answers };
}

function openResult() {
  const answerEntries = [
    ['Intención', displayValue(state.answers.mission) || 'Por definir'], ['Papel', displayValue(state.answers.role) || 'Por definir'],
    ['Contexto', displayValue(state.answers.context) || 'Por definir'], ['Evidencia', displayValue(state.answers.evidence) || 'Sin audio'],
    ['Prueba de éxito', displayValue(state.answers.success) || 'Por definir']
  ];
  refs.resultSummary.innerHTML = answerEntries.map(([label, value]) => `<div class="summary-item"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`).join('');
  refs.resultModal.classList.add('open'); refs.resultModal.setAttribute('aria-hidden', 'false');
}

function closeResult() { refs.resultModal.classList.remove('open'); refs.resultModal.setAttribute('aria-hidden', 'true'); }

function escapeHtml(value) { const node = document.createElement('div'); node.textContent = value; return node.innerHTML; }

refs.nextButton.addEventListener('click', () => saveAndMove(false));
refs.skipButton.addEventListener('click', () => { if (state.current === questions.length - 1) { state.current = Math.max(0, state.current - 1); persist(); render(); } else saveAndMove(true); });
refs.closeModal.addEventListener('click', closeResult);
refs.resultModal.addEventListener('click', event => { if (event.target === refs.resultModal) closeResult(); });
refs.copyButton.addEventListener('click', async () => {
  const text = JSON.stringify(buildPayload(), null, 2);
  try { await navigator.clipboard.writeText(text); refs.copyFeedback.textContent = 'Ficha copiada al portapapeles.'; }
  catch { refs.copyFeedback.textContent = 'No se pudo copiar; descarga el JSON.'; }
});
refs.downloadButton.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(buildPayload(), null, 2)], { type: 'application/json' });
  const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'gnx-agent-blueprint.json'; link.click(); URL.revokeObjectURL(link.href);
});
refs.resetButton.addEventListener('click', () => {
  if (!confirm('¿Reiniciar esta sesión y borrar las señales guardadas?')) return;
  localStorage.removeItem(STORAGE_KEY); window.location.reload();
});

render();
