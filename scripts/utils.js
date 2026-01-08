import Handlebars from "handlebars";
import { differenceInYears } from "date-fns";

export function registerHelpers() {
  Handlebars.registerHelper("link", (url, text) =>
    url
      ? new Handlebars.SafeString(
          `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
        )
      : text
  );

  Handlebars.registerHelper("eq", (a, b) => a === b);

  Handlebars.registerHelper(
    "json",
    (obj) =>
      new Handlebars.SafeString(JSON.stringify(obj).replace(/"/g, "&quot;"))
  );
}

export function computeAge(birthdate) {
  return differenceInYears(new Date(), new Date(birthdate));
}

export function formatAge(age, lang, label, translations) {
  const pr = new Intl.PluralRules(lang);
  const category = pr.select(age);
  const ageUnit =
    translations?.labels?.["age-unit"] ?? translations?.labels?.ageUnit;
  const unit = ageUnit?.[category] ?? ageUnit?.other ?? "";
  const formatted = unit ? `${age} ${unit}` : String(age);
  return label ? `${label}: ${formatted}` : formatted;
}

export function mergeTranslations(items = [], translations = {}, nestedKey) {
  return items.map((item) => {
    const itemTranslation = translations?.[item.id] ?? {};
    const merged = { ...item, ...itemTranslation };

    if (nestedKey) {
      const baseNested = Array.isArray(item[nestedKey]) ? item[nestedKey] : [];
      const nestedTranslations = itemTranslation[nestedKey] ?? {};

      merged[nestedKey] = baseNested.map((nested) => ({
        ...nested,
        ...(nestedTranslations[nested.id] ?? {}),
      }));
    }

    return merged;
  });
}
