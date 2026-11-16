// @ts-check
import { ALLERGENS, AVAILABILITY, MENU, PHONE } from './data.js';

/** @typedef {import('./data.js').Dish} Dish */
/** @typedef {import('./data.js').Cocktail} Cocktail */
/** @typedef {import('./data.js').Category} Category */
/** @typedef {import('./data.js').AllergenId} AllergenId */

/**
 * Filtros dietarios: cada uno excluye ítems que contengan alguno de sus alérgenos.
 * @type {{ id: string, label: string, excludes?: AllergenId[], requires?: 'vegetarian' }[]}
 */
const FILTERS = [
  { id: 'sin-gluten', label: 'Sin gluten', excludes: ['gluten'] },
  { id: 'sin-mariscos', label: 'Sin mariscos', excludes: ['crustaceos', 'moluscos'] },
  { id: 'sin-pescado', label: 'Sin pescado', excludes: ['pescado'] },
  { id: 'sin-lacteos', label: 'Sin lácteos', excludes: ['lacteos'] },
  { id: 'sin-huevo', label: 'Sin huevo', excludes: ['huevo'] },
  { id: 'vegetariano', label: 'Vegetariano', requires: 'vegetarian' },
];

/**
 * Foto de referencia (Unsplash) para la cabecera de cada categoría.
 * @type {Record<string, string>}
 */
const CATEGORY_PHOTOS = {
  entradas: '1649257171206-37625b1f3b2f',
  ceviches: '1731570225640-7ddad4231679',
  rolls: '1611762687807-7cdd09aef422',
  nigiris: '1712725214706-e564b8dd1bbe',
  calientes: '1626232441076-a2a5ada2256a',
  postres: '1635355347994-b79177b77e5c',
  cocteles: '1632995561510-38616ed64ff6',
};

const state = {
  /** @type {Set<string>} */
  filters: new Set(),
  onlyAvailable: false,
};

/** @param {string} value */
function esc(value) {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/**
 * @template {Element} T
 * @param {string} selector
 * @param {new () => T} type
 * @returns {T}
 */
function $(selector, type) {
  const el = document.querySelector(selector);
  if (!(el instanceof type)) throw new Error(`Falta el elemento ${selector}`);
  return el;
}

/** @param {Dish|Cocktail} item */
function isCocktail(item) {
  return 'profile' in item;
}

/** @param {Dish|Cocktail} item */
function matchesFilters(item) {
  if (state.onlyAvailable && item.availability === 'agotado') return false;
  for (const id of state.filters) {
    const filter = FILTERS.find((f) => f.id === id);
    if (!filter) continue;
    if (filter.excludes?.some((a) => item.allergens.includes(a))) return false;
    if (filter.requires === 'vegetarian' && !(isCocktail(item) || /** @type {Dish} */ (item).vegetarian)) {
      return false;
    }
  }
  return true;
}

/** @param {Dish|Cocktail} item */
function availabilityBadge(item) {
  const { label } = AVAILABILITY[item.availability];
  const note = item.availabilityNote ? `<span class="avail__note">${esc(item.availabilityNote)}</span>` : '';
  return `<p class="avail avail--${item.availability}"><span class="avail__dot" aria-hidden="true"></span><span class="avail__label">${label}</span>${note}</p>`;
}

/** @param {Dish|Cocktail} item */
function allergenBlock(item) {
  const chips = item.allergens.length
    ? item.allergens
        .map((a) => `<li class="allergen" title="${ALLERGENS[a].label}"><abbr aria-hidden="true">${ALLERGENS[a].short}</abbr>${ALLERGENS[a].label}</li>`)
        .join('')
    : '<li class="allergen allergen--none">Sin alérgenos principales declarados</li>';
  const note = item.allergenNote ? `<p class="allergens__note">${esc(item.allergenNote)}</p>` : '';
  return `<div class="allergens"><p class="label">Alérgenos</p><ul class="allergens__list" role="list">${chips}</ul>${note}</div>`;
}

/** @param {string[]} ingredients */
function ingredientList(ingredients) {
  return `<div class="ingredients"><p class="label">Ingredientes</p><p class="ingredients__list">${ingredients.map(esc).join('<span aria-hidden="true"> · </span>')}</p></div>`;
}

/** @param {Dish} dish @param {number} index */
function dishCard(dish, index) {
  const tags = [
    dish.vegetarian ? '<span class="tag tag--veg">Vegetariano</span>' : '',
    dish.spicy ? '<span class="tag tag--spicy">Picante</span>' : '',
  ].join('');
  return `
    <article class="card${dish.availability === 'agotado' ? ' is-out' : ''}" id="item-${dish.id}">
      <header class="card__head">
        <span class="card__num" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
        <div>
          <h3 class="card__title">${esc(dish.name)}${dish.jp ? ` <span class="card__jp" lang="ja">${dish.jp}</span>` : ''}</h3>
          ${tags ? `<div class="tags">${tags}</div>` : ''}
        </div>
      </header>
      <p class="card__desc">${esc(dish.description)}</p>
      ${ingredientList(dish.ingredients)}
      ${allergenBlock(dish)}
      ${availabilityBadge(dish)}
    </article>`;
}

/** @param {string} name @param {number} value */
function meter(name, value) {
  const segments = Array.from({ length: 5 }, (_, i) => `<span class="${i < value ? 'on' : ''}"></span>`).join('');
  return `<div class="meter"><dt>${name}</dt><dd><span class="meter__bar" role="img" aria-label="${name}: ${value} de 5">${segments}</span></dd></div>`;
}

/** @param {Cocktail} drink */
function cocktailCard(drink) {
  return `
    <article class="card card--drink${drink.availability === 'agotado' ? ' is-out' : ''}" id="item-${drink.id}">
      <header class="card__head">
        <div>
          <p class="drink__base">${esc(drink.base)}${drink.alcoholFree ? '' : ' · con alcohol'}</p>
          <h3 class="card__title">${esc(drink.name)}</h3>
        </div>
      </header>
      <p class="card__desc drink__explain">${esc(drink.explanation)}</p>
      <dl class="meters">
        ${meter('Acidez', drink.profile.acidez)}
        ${meter('Dulzor', drink.profile.dulzor)}
        ${meter('Intensidad', drink.profile.intensidad)}
      </dl>
      ${ingredientList(drink.ingredients)}
      ${allergenBlock(drink)}
      ${availabilityBadge(drink)}
    </article>`;
}

/** @param {Category} category */
function renderCategory(category) {
  const visible = category.items.filter(matchesFilters);
  const cards = visible.length
    ? visible
        .map((item, i) =>
          category.kind === 'cocktail' ? cocktailCard(/** @type {Cocktail} */ (item)) : dishCard(/** @type {Dish} */ (item), i),
        )
        .join('')
    : '<p class="empty">Ningún ítem de esta sección calza con los filtros elegidos.</p>';
  const foto = CATEGORY_PHOTOS[category.id];
  return `
    <section class="category category--${category.kind}" id="${category.id}" aria-labelledby="h-${category.id}" data-category>
      ${foto ? `<figure class="category__foto" aria-hidden="true"><img loading="lazy" alt="" src="https://images.unsplash.com/photo-${foto}?w=1400&h=560&q=70&auto=format&fit=crop" /></figure>` : ''}
      <div class="category__head">
        <span class="category__kanji" aria-hidden="true" lang="ja">${category.kanji}</span>
        <div>
          <h2 class="category__title" id="h-${category.id}">${esc(category.label)}</h2>
          <p class="category__intro">${esc(category.intro)}</p>
        </div>
        <span class="category__count">${visible.length}/${category.items.length}</span>
      </div>
      <div class="grid">${cards}</div>
    </section>`;
}

function renderMenu() {
  $('#menu-sections', HTMLElement).innerHTML = MENU.map(renderCategory).join('');
  const total = MENU.reduce((n, c) => n + c.items.length, 0);
  const shown = MENU.reduce((n, c) => n + c.items.filter(matchesFilters).length, 0);
  const active = state.filters.size + (state.onlyAvailable ? 1 : 0);
  $('#filter-status', HTMLElement).textContent = active
    ? `Mostrando ${shown} de ${total} ítems con ${active} filtro${active > 1 ? 's' : ''}.`
    : `${total} ítems en la carta.`;
  $('#filter-reset', HTMLButtonElement).hidden = active === 0;
  observeSections();
}

function renderNav() {
  $('#category-nav', HTMLElement).innerHTML = MENU.map(
    (c) => `<a class="chip" href="#${c.id}" data-nav="${c.id}"><span lang="ja" aria-hidden="true">${c.kanji}</span>${esc(c.label)}</a>`,
  ).join('');
}

function renderFilters() {
  const root = $('#filters', HTMLElement);
  root.innerHTML =
    FILTERS.map(
      (f) => `<button type="button" class="toggle" data-filter="${f.id}" aria-pressed="false">${f.label}</button>`,
    ).join('') + '<button type="button" class="toggle toggle--avail" data-only-available aria-pressed="false">Solo disponibles</button>';

  root.addEventListener('click', (event) => {
    const button = /** @type {HTMLElement} */ (event.target).closest('button');
    if (!button) return;
    if (button.hasAttribute('data-only-available')) {
      state.onlyAvailable = !state.onlyAvailable;
      button.setAttribute('aria-pressed', String(state.onlyAvailable));
    } else {
      const id = button.dataset.filter ?? '';
      if (state.filters.has(id)) state.filters.delete(id);
      else state.filters.add(id);
      button.setAttribute('aria-pressed', String(state.filters.has(id)));
    }
    renderMenu();
  });

  $('#filter-reset', HTMLButtonElement).addEventListener('click', () => {
    state.filters.clear();
    state.onlyAvailable = false;
    root.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    renderMenu();
  });
}

function renderAvailabilitySummary() {
  const items = MENU.flatMap((c) => c.items);
  const count = (/** @type {import('./data.js').Availability} */ a) => items.filter((i) => i.availability === a).length;
  $('#availability-summary', HTMLElement).innerHTML = /** @type {const} */ (['disponible', 'limitado', 'agotado'])
    .map((a) => `<li class="avail avail--${a}"><span class="avail__dot" aria-hidden="true"></span><strong>${count(a)}</strong> ${AVAILABILITY[a].label.toLowerCase()}</li>`)
    .join('');
}

/** @type {IntersectionObserver | null} */
let spy = null;

/** Resalta en la barra la categoría visible mientras se hace scroll. */
function observeSections() {
  spy?.disconnect();
  const links = document.querySelectorAll('[data-nav]');
  spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((link) => {
          const current = link.getAttribute('data-nav') === entry.target.id;
          link.toggleAttribute('aria-current', current);
          if (current) link.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        });
      }
    },
    { rootMargin: '-35% 0px -60% 0px' },
  );
  document.querySelectorAll('[data-category]').forEach((section) => spy?.observe(section));
}

function renderPhone() {
  document.querySelectorAll('[data-phone]').forEach((el) => {
    if (el instanceof HTMLAnchorElement) el.href = PHONE.href;
    const number = el.querySelector('[data-phone-number]');
    const label = el.querySelector('[data-phone-label]');
    if (number) number.textContent = PHONE.display;
    if (label) label.textContent = PHONE.label;
  });
}

/** El formulario NO envía nada: solo valida y muestra una confirmación local. */
function setupContactForm() {
  const form = $('#contact-form', HTMLFormElement);
  const result = $('#contact-result', HTMLElement);
  const again = $('#contact-again', HTMLButtonElement);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('nombre') ?? '').trim();
    const topic = String(data.get('motivo') ?? '');
    $('#contact-result-text', HTMLElement).textContent =
      `Gracias, ${name}. Tu consulta sobre «${topic.toLowerCase()}» quedó lista en esta pantalla, pero no se envió a ningún lugar: este prototipo no tiene un canal conectado.`;
    form.hidden = true;
    result.hidden = false;
    result.focus();
  });

  again.addEventListener('click', () => {
    form.reset();
    result.hidden = true;
    form.hidden = false;
    $('#nombre', HTMLInputElement).focus();
  });
}

/** Endpoint propio para preguntas de la carta. */
const ASSISTANT_ENDPOINT = '/api/claude';

/**
 * Asistente de la carta: envía solo la pregunta al endpoint del prototipo.
 * Se muestra la respuesta con textContent (nunca como HTML).
 */
function setupAssistant() {
  const form = $('#assistant-form', HTMLFormElement);
  const input = $('#assistant-question', HTMLInputElement);
  const button = $('#assistant-ask', HTMLButtonElement);
  const answer = $('#assistant-answer', HTMLElement);
  const badge = $('#assistant-mode', HTMLElement);

  /** @param {string} text @param {boolean} fallback */
  const show = (text, fallback) => {
    answer.textContent = text;
    answer.classList.toggle('is-fallback', fallback);
    answer.hidden = false;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (question.length < 3 || question.length > 280) {
      input.setCustomValidity('Escribe una pregunta de entre 3 y 280 caracteres.');
      input.reportValidity();
      return;
    }
    input.setCustomValidity('');
    button.disabled = true;
    show('Buscando en la carta…', false);
    try {
      const response = await fetch(ASSISTANT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      if (!response.ok || typeof data.answer !== 'string') throw new Error(data.error ?? 'Respuesta inválida');
      badge.textContent = data.mode === 'claude' ? 'Modo demo · Claude' : 'Modo demo · simulado';
      show(data.answer, Boolean(data.fallback));
    } catch {
      show('El asistente no está disponible en esta vista previa. Consulta directamente con el personal del local.', true);
    } finally {
      button.disabled = false;
    }
  });

  input.addEventListener('input', () => input.setCustomValidity(''));
}

renderNav();
renderFilters();
renderMenu();
renderAvailabilitySummary();
renderPhone();
setupContactForm();
setupAssistant();
$('#year', HTMLElement).textContent = String(new Date().getFullYear());
