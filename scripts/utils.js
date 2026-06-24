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

export const mergeTranslations = (items = [], translations = {}) =>
  items.map((item) => ({ ...item, ...(translations?.[item.id] ?? {}) }));
