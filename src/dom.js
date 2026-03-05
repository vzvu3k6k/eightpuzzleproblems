function appendChild(parent, child) {
  if (child === null || child === undefined || child === false) return;

  if (Array.isArray(child)) {
    for (const nested of child) appendChild(parent, nested);
    return;
  }

  if (typeof Node !== "undefined" && child instanceof Node) {
    parent.appendChild(child);
    return;
  }

  if (typeof child === "string" || typeof child === "number") {
    parent.appendChild(document.createTextNode(String(child)));
    return;
  }

  throw new TypeError(`Unsupported child type: ${typeof child}`);
}

function applyProps(el, props) {
  if (!props) return;

  const { style, dataset, attrs, on, html, ...rest } = props;

  if (style) Object.assign(el.style, style);

  if (dataset) {
    for (const [key, value] of Object.entries(dataset)) {
      if (value === null || value === undefined) continue;
      el.dataset[key] = String(value);
    }
  }

  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      if (value === null || value === undefined) continue;
      el.setAttribute(key, String(value));
    }
  }

  if (on) {
    for (const [eventName, handler] of Object.entries(on)) {
      if (typeof handler !== "function") continue;
      el.addEventListener(eventName, handler);
    }
  }

  if (html !== undefined) el.innerHTML = String(html);

  // Convenience: allow passing DOM properties like `disabled`, `type`, etc.
  for (const [key, value] of Object.entries(rest)) {
    if (value === undefined) continue;
    // eslint-disable-next-line no-param-reassign
    el[key] = value;
  }
}

export function h(tag, props, ...children) {
  const el = document.createElement(tag);
  applyProps(el, props);
  for (const child of children) appendChild(el, child);
  return el;
}

