/*
  Yacht Upholstery Sardinia - Main JS
  File: assets/js/main.js

  Lightweight UI helpers only.
*/

(function () {
  "use strict";

  const PRIMARY_WHATSAPP_URL = "https://wa.me/393516550908?text=Hello%2C%20I%20would%20like%20a%20personalised%20quote%20for%20yacht%20upholstery%2C%20carpet%20or%20mattress%20cleaning%20in%20Sardinia.%20I%20can%20send%20photos%2C%20location%20and%20timing.";
  const COSTA_SMERALDA_CARPET_WHATSAPP_URL = "https://wa.me/393516550908?text=Hello%2C%20I%20have%20reviewed%20the%20Costa%20Smeralda%20carpet%20care%20guide%20and%20would%20like%20an%20assessment.%20I%20can%20send%20photos%2C%20location%20and%20timing.";
  const PHONE_URL = "tel:+393516550908";

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
    delete link.dataset.trackingBound;

    if (text) {
      link.textContent = text;
    }
  }

  function injectHeaderCtaStyles() {
    if (document.getElementById("header-dual-cta-styles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "header-dual-cta-styles";
    style.textContent = `
      .header-actions {
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.55rem;
        flex: 0 0 auto;
      }

      .header-call-secondary {
        display: inline-flex;
        min-height: 42px;
        align-items: center;
        justify-content: center;
        padding: 0.68rem 0.92rem;
        color: #ffffff;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.28);
        border-radius: 999px;
        font-weight: 750;
        line-height: 1;
        text-decoration: none;
      }

      .header-call-secondary:hover {
        background: rgba(255, 255, 255, 0.13);
        border-color: rgba(255, 255, 255, 0.46);
      }

      .header-cta-mobile-label {
        display: none;
      }

      @media (max-width: 680px) {
        .header-actions {
          gap: 0.35rem;
        }

        .header-cta,
        .header-call-secondary {
          min-height: 40px;
          padding: 0.62rem 0.7rem;
          font-size: 0.78rem;
          white-space: nowrap;
        }

        .header-cta-desktop-label {
          display: none;
        }

        .header-cta-mobile-label {
          display: inline;
        }
      }

      @media (max-width: 460px) {
        .brand-subtitle {
          display: none;
        }

        .brand-name {
          font-size: 0.82rem;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createSecondaryCallLink() {
    const callLink = document.createElement("a");
    callLink.className = "header-call-secondary js-track-phone";
    callLink.href = PHONE_URL;
    callLink.dataset.event = "phone_click";
    callLink.dataset.label = "header_phone_secondary";
    callLink.textContent = "Call";
    return callLink;
  }

  function setHeaderDualCtas() {
    injectHeaderCtaStyles();

    const headerCtas = Array.from(document.querySelectorAll(".header-cta"));

    headerCtas.forEach(function (originalLink) {
      if (originalLink.closest(".header-actions")) {
        return;
      }

      const whatsappLink = originalLink.cloneNode(true);
      originalLink.replaceWith(whatsappLink);

      configureWhatsAppLink(
        whatsappLink,
        PRIMARY_WHATSAPP_URL,
        "header_whatsapp_assessment",
        ""
      );

      whatsappLink.setAttribute("aria-label", "Request a WhatsApp assessment");
      whatsappLink.innerHTML = '<span class="header-cta-desktop-label">WhatsApp Assessment</span><span class="header-cta-mobile-label">WhatsApp</span>';

      const actions = document.createElement("div");
      actions.className = "header-actions";
      whatsappLink.replaceWith(actions);
      actions.appendChild(whatsappLink);
      actions.appendChild(createSecondaryCallLink());
    });

    if (window.location.pathname === "/guides/yacht-carpet-cleaning-costa-smeralda.html") {
      const originalGuideCta = document.querySelector(".hero-actions .btn-primary");

      if (originalGuideCta) {
        const guidePrimaryCta = originalGuideCta.cloneNode(true);
        originalGuideCta.replaceWith(guidePrimaryCta);

        configureWhatsAppLink(
          guidePrimaryCta,
          COSTA_SMERALDA_CARPET_WHATSAPP_URL,
          "costa_smeralda_carpet_guide_hero_whatsapp",
          "Get free WhatsApp assessment"
        );
      }
    }

    if (window.YachtTracking && typeof window.YachtTracking.bind === "function") {
      window.YachtTracking.bind(document);
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
    setHeaderDualCtas();
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
