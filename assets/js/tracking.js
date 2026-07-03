/*
  Yacht Upholstery Sardinia - Tracking
  File: assets/js/tracking.js

  Performance-first setup:
  - Consent Mode defaults are read from tracking.config.json.
  - With the current config, analytics and advertising storage are granted by default.
  - Google tags load when enabled and an ID is present.
  - Meta Pixel loads when enabled, a pixel ID is present and advertising consent is granted by config/default.
  - WhatsApp, phone, email and form events are bound automatically.
*/

(function () {
  "use strict";

  const CONFIG_PATH = "/assets/data/tracking.config.json";
  const CONSENT_STORAGE_KEY = "yacht_upholstery_sardinia_cookie_consent_v1";

  let trackingConfig = null;
  let isReady = false;
  let metaInitialized = false;

  function log() {
    if (!trackingConfig || !trackingConfig.debug) {
      return;
    }

    console.log.apply(console, ["[tracking]"].concat(Array.prototype.slice.call(arguments)));
  }

  function readStoredConsent() {
    try {
      const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);

      if (!raw) {
        return null;
      }

      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function getConsentDefault(config, key) {
    if (!config || !config.consent || !config.consent.enabled) {
      return "granted";
    }

    return config.consent[key] || "granted";
  }

  function hasAnalyticsConsent(config) {
    const storedConsent = readStoredConsent();
    const configDefault = getConsentDefault(config || trackingConfig, "default_analytics_storage");

    if (configDefault === "granted") {
      return true;
    }

    return Boolean(storedConsent && storedConsent.analytics === true);
  }

  function hasAdvertisingConsent(config) {
    const storedConsent = readStoredConsent();
    const adStorageDefault = getConsentDefault(config || trackingConfig, "default_ad_storage");
    const adUserDataDefault = getConsentDefault(config || trackingConfig, "default_ad_user_data");
    const adPersonalizationDefault = getConsentDefault(config || trackingConfig, "default_ad_personalization");

    if (
      adStorageDefault === "granted" &&
      adUserDataDefault === "granted" &&
      adPersonalizationDefault === "granted"
    ) {
      return true;
    }

    return Boolean(storedConsent && storedConsent.advertising === true);
  }

  function loadScript(src, id) {
    return new Promise(function (resolve, reject) {
      if (id && document.getElementById(id)) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.async = true;
      script.src = src;

      if (id) {
        script.id = id;
      }

      script.onload = resolve;
      script.onerror = reject;

      document.head.appendChild(script);
    });
  }

  function initDataLayer() {
    window.dataLayer = window.dataLayer || [];

    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
  }

  function applyConsentDefaults(config) {
    if (!config.consent || !config.consent.enabled) {
      return;
    }

    initDataLayer();

    window.gtag("consent", "default", {
      analytics_storage: getConsentDefault(config, "default_analytics_storage"),
      ad_storage: getConsentDefault(config, "default_ad_storage"),
      ad_user_data: getConsentDefault(config, "default_ad_user_data"),
      ad_personalization: getConsentDefault(config, "default_ad_personalization")
    });
  }

  function initGA4(config) {
    if (!config.ga4 || !config.ga4.enabled || !config.ga4.measurement_id) {
      return Promise.resolve();
    }

    initDataLayer();

    const measurementId = config.ga4.measurement_id;
    const src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);

    return loadScript(src, "ga4-gtag")
      .then(function () {
        window.gtag("js", new Date());
        window.gtag("config", measurementId, {
          send_page_view: true
        });

        log("GA4 initialized", measurementId, "analytics consent:", hasAnalyticsConsent(config));
      })
      .catch(function () {
        log("GA4 failed to load");
      });
  }

  function initGoogleAds(config) {
    if (!config.google_ads || !config.google_ads.enabled || !config.google_ads.conversion_id) {
      return Promise.resolve();
    }

    initDataLayer();

    const conversionId = config.google_ads.conversion_id;
    const src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(conversionId);

    return loadScript(src, "google-ads-gtag")
      .then(function () {
        window.gtag("js", new Date());
        window.gtag("config", conversionId);

        log("Google Ads initialized", conversionId, "advertising consent:", hasAdvertisingConsent(config));
      })
      .catch(function () {
        log("Google Ads failed to load");
      });
  }

  function initMetaPixel(config) {
    if (
      metaInitialized ||
      !config.meta_pixel ||
      !config.meta_pixel.enabled ||
      !config.meta_pixel.pixel_id ||
      !hasAdvertisingConsent(config)
    ) {
      return;
    }

    if (window.fbq) {
      metaInitialized = true;
      return;
    }

    window.fbq = function () {
      window.fbq.callMethod
        ? window.fbq.callMethod.apply(window.fbq, arguments)
        : window.fbq.queue.push(arguments);
    };

    if (!window._fbq) {
      window._fbq = window.fbq;
    }

    window.fbq.push = window.fbq;
    window.fbq.loaded = true;
    window.fbq.version = "2.0";
    window.fbq.queue = [];

    loadScript("https://connect.facebook.net/en_US/fbevents.js", "meta-pixel")
      .then(function () {
        window.fbq("init", config.meta_pixel.pixel_id);
        window.fbq("track", "PageView");
        metaInitialized = true;

        log("Meta Pixel initialized", config.meta_pixel.pixel_id);
      })
      .catch(function () {
        log("Meta Pixel failed to load");
      });
  }

  function getEventConfig(eventName) {
    if (!trackingConfig || !trackingConfig.events || !trackingConfig.events[eventName]) {
      return null;
    }

    const eventConfig = trackingConfig.events[eventName];

    if (eventConfig.enabled === false) {
      return null;
    }

    return eventConfig;
  }

  function sendGA4Event(eventName, label) {
    if (!trackingConfig.ga4 || !trackingConfig.ga4.enabled || !window.gtag) {
      return;
    }

    const eventConfig = getEventConfig(eventName);

    if (!eventConfig) {
      return;
    }

    window.gtag("event", eventConfig.action || eventName, {
      event_category: eventConfig.category || "lead",
      event_label: label || eventName
    });
  }

  function sendGoogleAdsConversion(eventName) {
    if (
      !trackingConfig.google_ads ||
      !trackingConfig.google_ads.enabled ||
      !window.gtag ||
      !trackingConfig.google_ads.conversions ||
      !trackingConfig.google_ads.conversions[eventName]
    ) {
      return;
    }

    const conversion = trackingConfig.google_ads.conversions[eventName];

    if (!conversion.send_to) {
      return;
    }

    window.gtag("event", "conversion", {
      send_to: conversion.send_to,
      value: conversion.value || 1.0,
      currency: conversion.currency || "EUR"
    });
  }

  function sendMetaEvent(eventName) {
    if (
      !trackingConfig.meta_pixel ||
      !trackingConfig.meta_pixel.enabled ||
      !trackingConfig.meta_pixel.events ||
      !trackingConfig.meta_pixel.events[eventName] ||
      !window.fbq ||
      !hasAdvertisingConsent(trackingConfig)
    ) {
      return;
    }

    window.fbq("track", trackingConfig.meta_pixel.events[eventName]);
  }

  function trackEvent(eventName, label) {
    if (!isReady || !trackingConfig) {
      return;
    }

    const eventConfig = getEventConfig(eventName);

    if (!eventConfig) {
      return;
    }

    log("event", eventName, label, {
      analyticsConsent: hasAnalyticsConsent(trackingConfig),
      advertisingConsent: hasAdvertisingConsent(trackingConfig)
    });

    sendGA4Event(eventName, label);
    sendGoogleAdsConversion(eventName);
    sendMetaEvent(eventName);
  }

  function getEventFromElement(element) {
    if (!element) {
      return null;
    }

    if (element.dataset && element.dataset.event) {
      return element.dataset.event;
    }

    if (element.classList.contains("js-track-whatsapp")) {
      return "whatsapp_click";
    }

    if (element.classList.contains("js-track-phone")) {
      return "phone_click";
    }

    if (element.classList.contains("js-track-email")) {
      return "email_click";
    }

    const href = element.getAttribute("href") || "";

    if (href.indexOf("wa.me/") !== -1 || href.indexOf("api.whatsapp.com") !== -1) {
      return "whatsapp_click";
    }

    if (href.startsWith("tel:")) {
      return "phone_click";
    }

    if (href.startsWith("mailto:")) {
      return "email_click";
    }

    return null;
  }

  function bindClickTracking(scope) {
    const root = scope || document;
    const links = root.querySelectorAll("a[href]");

    links.forEach(function (link) {
      if (link.dataset.trackingBound === "true") {
        return;
      }

      const eventName = getEventFromElement(link);

      if (!eventName) {
        return;
      }

      link.dataset.trackingBound = "true";

      link.addEventListener("click", function () {
        const label = link.dataset.label || link.textContent.trim() || eventName;
        trackEvent(eventName, label);
      });
    });
  }

  function bindFormTracking(scope) {
    const root = scope || document;
    const forms = root.querySelectorAll("form");

    forms.forEach(function (form) {
      if (form.dataset.trackingBound === "true") {
        return;
      }

      form.dataset.trackingBound = "true";

      form.addEventListener("submit", function () {
        const label = form.dataset.label || form.getAttribute("name") || "form_submit";
        trackEvent("form_submit", label);
      });
    });
  }

  function bindAllTracking(scope) {
    bindClickTracking(scope);
    bindFormTracking(scope);
  }

  function exposeManualTracking() {
    window.YachtTracking = {
      track: trackEvent,
      bind: bindAllTracking
    };
  }

  function init(config) {
    trackingConfig = config || {};
    applyConsentDefaults(trackingConfig);

    Promise.all([
      initGA4(trackingConfig),
      initGoogleAds(trackingConfig)
    ]).finally(function () {
      initMetaPixel(trackingConfig);

      isReady = true;
      exposeManualTracking();
      bindAllTracking(document);

      log("tracking ready");
    });
  }

  fetch(CONFIG_PATH, { cache: "no-cache" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Tracking config not found");
      }

      return response.json();
    })
    .then(init)
    .catch(function () {
      trackingConfig = { debug: false, events: {} };
      isReady = false;
    });

  document.addEventListener("footer:loaded", function () {
    bindAllTracking(document);
  });

  window.addEventListener("cookie-consent:updated", function () {
    if (trackingConfig) {
      initMetaPixel(trackingConfig);
    }
  });
})();
