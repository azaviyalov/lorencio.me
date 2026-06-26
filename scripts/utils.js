import Handlebars from "handlebars";

const { escapeExpression, SafeString } = Handlebars;

export const registerHelpers = () => {
  Handlebars.registerHelper({
    link: (url, text) =>
      url
        ? new SafeString(`<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`)
        : text,

    contactValue: (url) => {
      if (!url) return "";
      if (url.startsWith("mailto:")) return url.replace(/^mailto:/, "");

      try {
        const { host, pathname } = new URL(url);
        return `${host}${pathname}`.replace(/\/$/, "");
      } catch {
        return url;
      }
    },

    additionalItem: (text) => {
      const [label, ...rest] = String(text ?? "").split(":");
      const content = rest.join(":").trim();
      const value = content || label;

      return new SafeString(
        (content
          ? `<span class="resume__additional-label">${escapeExpression(label.trim())}</span>`
          : "") +
          `<span class="resume__additional-value">${escapeExpression(value)}</span>`
      );
    },
  });
};

const isPlainObject = (value) =>
  Object.prototype.toString.call(value) === "[object Object]";

const mergeDeep = (base, override) => {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override ?? base;
  }

  return Object.fromEntries(
    [...new Set([...Object.keys(base), ...Object.keys(override)])].map((key) => [
      key,
      mergeDeep(base[key], override[key]),
    ])
  );
};

const omitKeys = (value, keys) => {
  if (!isPlainObject(value) || !keys.length) return value;

  return Object.fromEntries(
    Object.entries(value).filter(([key]) => !keys.includes(key))
  );
};

export const formatPeriod = (period, labels = {}) => {
  if (!isPlainObject(period)) return period;

  const end = period.end ?? labels.present ?? "present";
  return [period.start, end].filter(Boolean).join("–");
};

export const mergeTranslations = (items = [], translations = {}, lockedKeys = []) =>
  items.map((item) =>
    mergeDeep(item, omitKeys(translations?.[item.id] ?? {}, lockedKeys))
  );
