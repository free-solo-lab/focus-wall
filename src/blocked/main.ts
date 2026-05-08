import "./styles.css";
import { getMessages } from "../lib/i18n";
import { loadSettings } from "../lib/storage";

function getBlockedDomain(fallbackDomain: string): string {
  const params = new URLSearchParams(window.location.search);
  return params.get("domain") ?? fallbackDomain;
}

async function openOptionsPage(): Promise<void> {
  await chrome.runtime.openOptionsPage();
}

const app = document.getElementById("app");

async function renderBlockedPage(): Promise<void> {
  if (!app) {
    throw new Error("Blocked page root container was not found.");
  }

  const settings = await loadSettings();
  const messages = getMessages(settings.language);
  document.title = messages.blockedPageTitle;

  const shell = document.createElement("main");
  shell.className = "blocked-shell";

  const card = document.createElement("section");
  card.className = "blocked-card";

  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = messages.blockedEyebrow;

  const title = document.createElement("h1");
  title.textContent = getBlockedDomain(messages.blockedFallbackDomain);

  const copy = document.createElement("p");
  copy.className = "copy";
  copy.textContent = messages.blockedCopy;

  const button = document.createElement("button");
  button.className = "open-settings";
  button.type = "button";
  button.textContent = messages.openSettings;
  button.addEventListener("click", () => void openOptionsPage());

  card.append(eyebrow, title, copy, button);
  shell.append(card);
  app.append(shell);
}

void renderBlockedPage();
