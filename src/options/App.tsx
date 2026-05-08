import { FormEvent, startTransition, useEffect, useState } from "react";
import { getHostnameDedupKey } from "../lib/hostname";
import { getMessages, LANGUAGES } from "../lib/i18n";
import { normalizeHostname } from "../lib/normalize";
import { loadSettings, saveSettings } from "../lib/storage";
import { DEFAULT_SETTINGS, type BlockedSite, type ExtensionSettings, type Language } from "../lib/types";

function createSite(hostname: string): BlockedSite {
  return {
    id: crypto.randomUUID(),
    hostname,
    enabled: true,
    createdAt: Date.now()
  };
}

export function App() {
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeCount = settings.blockedSites.filter((site) => site.enabled).length;
  const messages = getMessages(settings.language);

  useEffect(() => {
    let mounted = true;

    void loadSettings()
      .then((nextSettings) => {
        if (!mounted) {
          return;
        }

        startTransition(() => {
          setSettings(nextSettings);
          setLoading(false);
        });
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        setError(getMessages(DEFAULT_SETTINGS.language).loadError);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function persist(nextSettings: ExtensionSettings) {
    setSaving(true);
    setError(null);

    try {
      const saved = await saveSettings(nextSettings);
      startTransition(() => {
        setSettings(saved);
      });
    } catch {
      setError(messages.saveError);
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const hostname = normalizeHostname(draft);

    if (!hostname) {
      setError(messages.invalidDomainError);
      return;
    }

    const candidateKey = getHostnameDedupKey(hostname);

    if (
      settings.blockedSites.some((site) => getHostnameDedupKey(site.hostname) === candidateKey)
    ) {
      setError(messages.duplicateDomainError);
      return;
    }

    await persist({
      ...settings,
      blockedSites: [createSite(hostname), ...settings.blockedSites]
    });
    setDraft("");
  }

  async function handleToggle(id: string) {
    await persist({
      ...settings,
      blockedSites: settings.blockedSites.map((site) =>
        site.id === id ? { ...site, enabled: !site.enabled } : site
      )
    });
  }

  async function handleDelete(id: string) {
    await persist({
      ...settings,
      blockedSites: settings.blockedSites.filter((site) => site.id !== id)
    });
  }

  async function handleLanguageChange(language: Language) {
    await persist({
      ...settings,
      language
    });
  }

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-topline">
          <p className="eyebrow">{messages.productName}</p>
          <label className="language-field">
            <span>{messages.languageLabel}</span>
            <select
              value={settings.language}
              onChange={(event) => void handleLanguageChange(event.target.value as Language)}
              disabled={saving}
            >
              {LANGUAGES.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <h1>{messages.heroTitle}</h1>
        <p className="hero-copy">{messages.heroCopy}</p>

        <form className="site-form" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="site-input">
            {messages.siteFieldLabel}
          </label>
          <div className="field-row">
            <input
              id="site-input"
              className="site-input"
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={messages.sitePlaceholder}
              autoComplete="off"
              spellCheck={false}
            />
            <button className="primary-button" type="submit" disabled={saving}>
              {messages.addButton}
            </button>
          </div>
        </form>

        <div className="status-row">
          <div>
            <span className="status-value">{activeCount}</span>
            <span className="status-label">{messages.activeBlocksLabel}</span>
          </div>
          <div>
            <span className="status-value">{settings.blockedSites.length}</span>
            <span className="status-label">{messages.sitesInListLabel}</span>
          </div>
        </div>

        {error ? <p className="feedback error">{error}</p> : null}
        {saving ? <p className="feedback">{messages.savingStatus}</p> : null}
        {loading ? <p className="feedback">{messages.loadingStatus}</p> : null}
      </section>

      <section className="list-card">
        <div className="list-header">
          <div>
            <p className="eyebrow">{messages.listEyebrow}</p>
            <h2>{messages.currentRulesTitle}</h2>
          </div>
          <p className="list-caption">{messages.listCaption}</p>
        </div>

        {settings.blockedSites.length === 0 ? (
          <div className="empty-state">
            <p>{messages.emptyTitle}</p>
            <p>{messages.emptyCopy}</p>
          </div>
        ) : (
          <ul className="site-list">
            {settings.blockedSites.map((site) => (
              <li key={site.id} className="site-row">
                <div>
                  <p className="site-hostname">{site.hostname}</p>
                  <p className="site-meta">
                    {site.enabled ? messages.enabledStatus : messages.disabledStatus}
                  </p>
                </div>

                <div className="site-actions">
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => void handleToggle(site.id)}
                    disabled={saving}
                  >
                    {site.enabled ? messages.disableButton : messages.enableButton}
                  </button>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => void handleDelete(site.id)}
                    disabled={saving}
                  >
                    {messages.deleteButton}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
