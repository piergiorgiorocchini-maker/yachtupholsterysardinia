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

  function injectJoyEditorialImage() {
    if (window.location.pathname !== "/services/superyacht-carpet-upholstery-cleaning-sardinia.html") {
      return;
    }

    if (document.getElementById("superyacht-joy-editorial")) {
      return;
    }

    const whyUsHeading = document.getElementById("why-us");

    if (!whyUsHeading || !whyUsHeading.parentNode) {
      return;
    }

    const contextParagraph = document.createElement("p");
    contextParagraph.textContent = "Porto Cervo and the Costa Smeralda welcome some of the world’s most sophisticated yachts and superyachts. Interiors of this level require specialist care for fitted carpets, salon upholstery, loose cushions, upholstered panels and cabin mattresses. Each intervention must be planned around the yacht’s materials, access conditions, crew schedule and required turnaround time.";

    const figure = document.createElement("figure");
    figure.id = "superyacht-joy-editorial";
    figure.className = "editorial-figure";

    const image = document.createElement("img");
    image.src = "https://impresapuliziecagliari.wordpress.com/wp-content/uploads/2026/07/superyacht-joy.png?w=1600";
    image.srcset = "https://impresapuliziecagliari.wordpress.com/wp-content/uploads/2026/07/superyacht-joy.png?w=800 800w, https://impresapuliziecagliari.wordpress.com/wp-content/uploads/2026/07/superyacht-joy.png?w=1200 1200w, https://impresapuliziecagliari.wordpress.com/wp-content/uploads/2026/07/superyacht-joy.png?w=1600 1600w";
    image.sizes = "(max-width: 900px) calc(100vw - 40px), 760px";
    image.width = 1600;
    image.height = 900;
    image.loading = "lazy";
    image.decoding = "async";
    image.alt = "Superyacht JOY moored in a Sardinian marina";
    image.title = "Superyacht JOY in Sardinia";

    const caption = document.createElement("figcaption");
    caption.textContent = "Superyacht JOY moored in Sardinia, where premium yacht interiors require specialist carpet, upholstery and mattress care.";

    figure.appendChild(image);
    figure.appendChild(caption);

    whyUsHeading.parentNode.insertBefore(contextParagraph, whyUsHeading);
    whyUsHeading.parentNode.insertBefore(figure, whyUsHeading);

    const imageSchema = document.createElement("script");
    imageSchema.type = "application/ld+json";
    imageSchema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ImageObject",
      "@id": "https://yachtupholsterysardinia.com/services/superyacht-carpet-upholstery-cleaning-sardinia.html#superyacht-joy-image",
      "contentUrl": "https://impresapuliziecagliari.wordpress.com/wp-content/uploads/2026/07/superyacht-joy.png?w=1600",
      "name": "Superyacht JOY in Sardinia",
      "caption": "Superyacht JOY moored in a Sardinian marina.",
      "description": "Editorial image of Superyacht JOY in Sardinia, illustrating the presentation standards associated with premium yacht and superyacht interiors.",
      "contentLocation": {
        "@type": "Place",
        "name": "Sardinia, Italy"
      }
    });
    document.head.appendChild(imageSchema);
  }

  function refineItalianYachtPillar() {
    const paths = [
      "/pulizia-moquette-tappezzeria-yacht-sardegna.html",
      "/pulizia-moquette-tappezzeria-yacht-sardegna/"
    ];

    if (!paths.includes(window.location.pathname)) {
      return;
    }

    const style = document.createElement("style");
    style.id = "italian-pillar-live-refine";
    style.textContent = `
      .it-page .review-wrap {
        max-width: 680px;
        margin: 2.4rem auto;
      }

      .it-page .review-card {
        text-align: center;
        padding: clamp(1.7rem, 4vw, 2.5rem);
      }

      .it-page .review-avatar {
        display: grid;
        width: 64px;
        height: 64px;
        margin: 0 auto 0.85rem;
        place-items: center;
        overflow: hidden;
        color: #ffffff;
        background: #12314d;
        border: 3px solid #d9b66a;
        border-radius: 50%;
      }

      .it-page .review-avatar svg {
        width: 42px;
        height: 42px;
        opacity: 0.92;
      }

      .it-page .review-stars {
        margin-bottom: 0.9rem;
      }

      .it-page .review-quote {
        max-width: 560px;
        margin: 0 auto;
        font-size: clamp(1.08rem, 2vw, 1.28rem);
        line-height: 1.6;
      }

      .it-page .review-attribution {
        margin-top: 1.15rem;
        text-align: center;
      }

      .it-page .specialist-photo {
        width: 150px !important;
        height: 150px !important;
        aspect-ratio: 1 / 1 !important;
        object-fit: cover !important;
        object-position: center 38% !important;
        border-radius: 50% !important;
      }

      @media (max-width: 700px) {
        .it-page .specialist-photo {
          width: 120px !important;
          height: 120px !important;
        }
      }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('a[href="#specialista-o-generico"]').forEach(function (link) {
      const item = link.closest("li");
      if (item) {
        item.remove();
      }
    });

    const specialistSectionHeading = document.getElementById("specialista-o-generico");
    if (specialistSectionHeading) {
      let node = specialistSectionHeading;
      while (node && !(node.nodeType === 1 && node.id === "moquette-carpet")) {
        const next = node.nextSibling;
        node.remove();
        node = next;
      }
    }

    document.querySelectorAll('a[href="#preventivo"]').forEach(function (link) {
      link.textContent = "Come richiedere una stima";
    });

    const estimateHeading = document.getElementById("preventivo");
    if (estimateHeading) {
      estimateHeading.textContent = "Come richiedere una stima";
    }

    const reviewHeading = document.getElementById("recensione");
    if (reviewHeading) {
      reviewHeading.remove();
    }

    const reviewWrap = document.querySelector(".review-wrap");
    if (reviewWrap) {
      reviewWrap.innerHTML = `
        <div class="review-card">
          <div class="review-avatar" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="24" r="12" fill="currentColor"/>
              <path d="M12 56c2.8-12 10.5-18 20-18s17.2 6 20 18" fill="currentColor"/>
            </svg>
          </div>
          <div class="review-stars" aria-label="5 stelle">★★★★★</div>
          <blockquote class="review-quote">“I cuscini sono venuti benissimo. Passerò i tuoi contatti ad altre imbarcazioni presenti in zona.”</blockquote>
          <div class="review-attribution">Chris <span>Chief Steward</span></div>
        </div>
      `;

      const note = reviewWrap.nextElementSibling;
      if (note && note.classList.contains("micro-note")) {
        note.remove();
      }
    }
  }

  function init() {
    setHeaderDualCtas();
    setHeaderState();
    setCurrentYear();
    refineItalianYachtPillar();
    closeOtherDetails();
    improveAnchorScroll();
    injectJoyEditorialImage();

    window.addEventListener("scroll", setHeaderState, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
