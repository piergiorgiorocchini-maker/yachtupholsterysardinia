/*
  Yacht Upholstery Sardinia - Cookie Notice
  File: assets/js/cookie-consent.js

  Performance-first / informational setup:
  - Consent Mode is granted by default.
  - The banner is informational and does not block analytics or advertising tags.
  - Legacy reject/manage paths are normalised back to granted consent.
  - Existing old localStorage values with denied choices are overwritten to granted.
*/

(function () {
  "use strict";

  const STORAGE_KEY = "yacht_upholstery_sardinia_cookie_consent_v1";

  const grantedConsent = {
    necessary: true,
    analytics: true,
    advertising: true,
    updated_at: null
  };

  function buildGrantedConsent(extra) {
    return Object.assign({}, grantedConsent, extra || {}, {
      necessary: true,
      analytics: true,
      advertising: true,
      updated_at: new Date().toISOString()
    });
  }

  function readRawConsent() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return null;
      }

      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function readConsent() {
    const stored = readRawConsent();

    if (!stored) {
      return Object.assign({}, grantedConsent);
    }

    return Object.assign({}, grantedConsent, stored, {
      necessary: true,
      analytics: true,
      advertising: true
    });
  }

  function applyConsentMode(consent) {
    window.dataLayer = window.dataLayer || [];

    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted"
    });
  }

  function saveConsent(consent) {
    const nextConsent = buildGrantedConsent(consent);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextConsent));
    } catch (error) {
      // Storage may be unavailable in some browsers. Tracking remains granted for the session.
    }

    applyConsentMode(nextConsent);

    window.dispatchEvent(new CustomEvent("cookie-consent:updated", {
      detail: nextConsent
    }));

    return nextConsent;
  }

  function exposeApi() {
    window.YachtCookieConsent = {
      storageKey: STORAGE_KEY,
      get: readConsent,
      save: saveConsent,
      acceptAll: function () {
        return saveConsent();
      },
      rejectAll: function () {
        return saveConsent();
      },
      reopen: function () {
        renderBanner(true);
      }
    };
  }

  function removeExistingBanner() {
    const existing = document.querySelector("[data-cookie-consent]");

    if (existing) {
      existing.remove();
    }
  }

  function renderBanner(forceOpen) {
    const rawConsent = readRawConsent();

    if (rawConsent && !forceOpen) {
      return;
    }

    removeExistingBanner();

    const banner = document.createElement("section");
    banner.className = "cookie-consent";
    banner.setAttribute("data-cookie-consent", "");
    banner.setAttribute("aria-label", "Cookie notice");
    banner.innerHTML = `
      <div class="cookie-consent__panel">
        <div class="cookie-consent__content">
          <p class="cookie-consent__kicker">Cookie notice</p>
          <h2>Cookies and tracking</h2>
          <p>
            We use cookies and similar technologies to keep the website working, measure visits, improve the service and understand contacts from WhatsApp, phone, email and advertising campaigns.
          </p>
        </div>

        <div class="cookie-consent__actions">
          <button type="button" class="cookie-btn cookie-btn--primary" data-cookie-accept>Got it</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    const acceptButton = banner.querySelector("[data-cookie-accept]");

    acceptButton.addEventListener("click", function () {
      saveConsent();
      banner.remove();
    });
  }

  function init() {
    exposeApi();

    const rawConsent = readRawConsent();

    // Apply and persist granted consent immediately, including migration from old denied values.
    saveConsent(rawConsent || {});

    // The banner is informational only. It does not gate tracking.
    renderBanner(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
