/*
  Yacht Upholstery Sardinia - Main JS
  File: assets/js/main.js

  Lightweight UI helpers only.
*/

(function () {
  "use strict";

  const PRIMARY_WHATSAPP_URL = "https://wa.me/393516550908?text=Hello%2C%20I%20would%20like%20a%20personalised%20quote%20for%20yacht%20upholstery%2C%20carpet%20or%20mattress%20cleaning%20in%20Sardinia.%20I%20can%20send%20photos%2C%20location%20and%20timing.";
  const COSTA_SMERALDA_CARPET_WHATSAPP_URL = "https://wa.me/393516550908?text=Hello%2C%20I%20have%20reviewed%20the%20Costa%20Smeralda%20carpet%20care%20guide%20and%20would%20like%20an%20assessment.%20I%20can%20send%20photos%2C%20location%20and%20timing.";

  function setHeaderState() {
    const header = document.querySelector("[data-header]");

    if (!header) {
      return;
    }

    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  function configureWhatsAppLink(link, url, label, text) {
    if (!link) {
      return;
    }

    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    link.classList.remove("js-track-phone");
    link.classList.add("js-track-whatsapp");
    link.dataset.event = "whatsapp_click";
    link.dataset.label = label;

    if (text) {
      link.textContent = text;
    }
  }

  function setPrimaryWhatsAppCtas() {
    const headerCtas = document.querySelectorAll(".header-cta");

    headerCtas.forEach(function (link) {
      configureWhatsAppLink(
        link,
        PRIMARY_WHATSAPP_URL,
        "header_whatsapp",
        "WhatsApp"
      );
    });

    if (window.location.pathname === "/guides/yacht-carpet-cleaning-costa-smeralda.html") {
      const guidePrimaryCta = document.querySelector(".hero-actions .btn-primary");

      configureWhatsAppLink(
        guidePrimaryCta,
        COSTA_SMERALDA_CARPET_WHATSAPP_URL,
        "costa_smeralda_carpet_guide_hero_whatsapp",
        "Get free WhatsApp assessment"
      );
    }
  }

  function setCurrentYear() {
    const yearNodes = document.querySelectorAll("[data-current-year]");
    const currentYear = new Date().getFullYear();

    yearNodes.forEach(function (node) {
      node.textContent = String(currentYear);
    });
  }

  function closeOtherDetails() {
    const detailsList = document.querySelectorAll("details");

    detailsList.forEach(function (details) {
      details.addEventListener("toggle", function () {
        if (!details.open) {
          return;
        }

        detailsList.forEach(function (otherDetails) {
          if (otherDetails !== details) {
            otherDetails.open = false;
          }
        });
      });
    });
  }

  function improveAnchorScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {
      link.addEventListener("click", function () {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
          return;
        }

        target.setAttribute("tabindex", "-1");

        window.setTimeout(function () {
          target.focus({ preventScroll: true });
        }, 420);
      });
    });
  }

  function init() {
    setPrimaryWhatsAppCtas();
    setHeaderState();
    setCurrentYear();
    closeOtherDetails();
    improveAnchorScroll();

    window.addEventListener("scroll", setHeaderState, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
