import { DEFAULT_LANGUAGE, type Language } from "./types";

export const LANGUAGES: Array<{ code: Language; label: string }> = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" }
];

export const translations = {
  en: {
    blockedPageTitle: "Site blocked",
    blockedFallbackDomain: "this site",
    blockedEyebrow: "Access stopped",
    blockedCopy:
      "This domain is currently on your blocklist. If you no longer need this rule, open the extension settings and update the list.",
    openSettings: "Open settings",
    loadError: "Could not load settings.",
    saveError: "Could not save changes.",
    invalidDomainError: "Enter a valid domain or URL.",
    duplicateDomainError:
      "This site is already in the list or already covered by a www/non-www rule.",
    productName: "Focus Wall",
    heroTitle: "Block sites that pull your attention",
    heroCopy:
      "Add a domain or full URL. The extension normalizes the address, stores only the hostname, and automatically covers www/non-www variants plus subdomains.",
    siteFieldLabel: "Site to block",
    sitePlaceholder: "For example, youtube.com or https://news.ycombinator.com",
    addButton: "Add",
    activeBlocksLabel: "active blocks",
    sitesInListLabel: "sites in list",
    savingStatus: "Saving changes...",
    loadingStatus: "Loading current list...",
    languageLabel: "Language",
    listEyebrow: "Site list",
    currentRulesTitle: "Current rules",
    listCaption: "Deleting or toggling a rule applies immediately after saving.",
    emptyTitle: "The list is empty.",
    emptyCopy: "Add the first site above, and Chrome will create blocking rules right away.",
    enabledStatus: "Blocking enabled",
    disabledStatus: "Blocking disabled",
    disableButton: "Disable",
    enableButton: "Enable",
    deleteButton: "Delete"
  },
  ru: {
    blockedPageTitle: "Сайт заблокирован",
    blockedFallbackDomain: "этот сайт",
    blockedEyebrow: "Доступ остановлен",
    blockedCopy:
      "Этот домен сейчас находится в списке блокировки. Если правило больше не нужно, открой настройки расширения и измени список.",
    openSettings: "Открыть настройки",
    loadError: "Не удалось загрузить настройки.",
    saveError: "Не удалось сохранить изменения.",
    invalidDomainError: "Введи корректный домен или URL.",
    duplicateDomainError: "Этот сайт уже есть в списке или уже покрыт правилом без www/www.",
    productName: "Focus Wall",
    heroTitle: "Блокируй сайты, которые тянут внимание",
    heroCopy:
      "Добавь домен или полный URL. Расширение нормализует адрес, сохранит только hostname и автоматически покроет варианты с www и без него, а также поддомены.",
    siteFieldLabel: "Сайт для блокировки",
    sitePlaceholder: "Например, youtube.com или https://news.ycombinator.com",
    addButton: "Добавить",
    activeBlocksLabel: "активных блокировок",
    sitesInListLabel: "сайтов в списке",
    savingStatus: "Сохраняю изменения...",
    loadingStatus: "Загружаю текущий список...",
    languageLabel: "Язык",
    listEyebrow: "Список сайтов",
    currentRulesTitle: "Текущие правила",
    listCaption: "Удаление или переключение срабатывает сразу после сохранения.",
    emptyTitle: "Пока список пуст.",
    emptyCopy: "Добавь первый сайт выше, и Chrome сразу создаст правила блокировки.",
    enabledStatus: "Блокировка включена",
    disabledStatus: "Блокировка отключена",
    disableButton: "Выключить",
    enableButton: "Включить",
    deleteButton: "Удалить"
  }
} satisfies Record<Language, Record<string, string>>;

export type TranslationKey = keyof typeof translations.en;

export function getMessages(language: Language | undefined): Record<TranslationKey, string> {
  return translations[language ?? DEFAULT_LANGUAGE] ?? translations[DEFAULT_LANGUAGE];
}

export function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "ru";
}
