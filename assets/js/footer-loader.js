/*
  Yacht Upholstery Sardinia - Footer Loader
  File: assets/js/footer-loader.js

  Loads footer content from:
  /assets/data/footer.links.json

  Requires an element in each page:
  <div id="site-footer" data-footer-root></div>
*/

(function () {
  "use strict";

  const FOOTER_CONFIG_PATH = "/assets/data/footer.links.json";
  const root = document.querySelector("[data-footer-root]");

  if (!root) {
    return;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function safeHref(value) {
    const href = String(value || "").trim();

    if (
      href.startsWith("/") ||
      href.startsWith("https://") ||
      href.startsWith("http://") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return href;
    }

    return "/";
  }

  function renderLinks(links) {
    if (!Array.isArray(links)) {
      return "";
    }

    return links
      .map(function (link) {
        const label = escapeHtml(link.label);
        const href = safeHref(link.href);

        return `<a href="${href}">${label}</a>`;
      })
      .join("");
  }

  function renderColumns(columns) {
    if (!Array.isArray(columns)) {
      return "";
    }

    return columns
      .map(function (column) {
        const title = escapeHtml(column.title);

        return `
          <div class="footer-column">
            <h3>${title}</h3>
            ${renderLinks(column.links)}
          </div>
        `;
      })
      .join("");
  }

  function renderFooter(config) {
    const brand = config.brand || {};
    const contacts = config.contacts || {};
    const bottomLinks = Array.isArray(config.bottom_links) ? config.bottom_links : [];

    const phoneHref = safeHref(contacts.phone_href);
    const phoneLabel = escapeHtml(contacts.phone_label);
    const whatsappHref = safeHref(contacts.whatsapp_href);
    const whatsappLabel = escapeHtml(contacts.whatsapp_label);
    const emailHref = safeHref(contacts.email_href);
    const emailLabel = escapeHtml(contacts.email_label);

    const bottom = bottomLinks
      .map(function (link) {
        return `<a href="${safeHref(link.href)}">${escapeHtml(link.label)}</a>`;
      })
      .join(" · ");

    root.innerHTML = `
      <footer class="site-footer" aria-label="Site footer">
        <div class="container footer-inner">
          <div class="footer-brand">
            <p class="footer-title">${escapeHtml(brand.name)}</p>
            <p>${escapeHtml(brand.subtitle)}</p>
            <p>${escapeHtml(brand.description)}</p>
            <p>
              <a class="js-track-phone" href="${phoneHref}" data-event="phone_click" data-label="footer_phone">${phoneLabel}</a><br>
              <a class="js-track-whatsapp" href="${whatsappHref}" data-event="whatsapp_click" data-label="footer_whatsapp">${whatsappLabel}</a><br>
              <a class="js-track-email" href="${emailHref}" data-event="email_click" data-label="footer_email">${emailLabel}</a>
            </p>
          </div>

          ${renderColumns(config.columns)}
        </div>

        <div class="container footer-bottom">
          <span>${escapeHtml(brand.copyright)}</span>
          ${bottom ? `<span class="footer-bottom-links"> · ${bottom}</span>` : ""}
        </div>
      </footer>
    `;

    document.dispatchEvent(new CustomEvent("footer:loaded"));
  }

  function renderFallback() {
    root.innerHTML = `
      <footer class="site-footer" aria-label="Site footer">
        <div class="container footer-inner">
          <div class="footer-brand">
            <p class="footer-title">Yacht Upholstery Sardinia</p>
            <p>by NuvolaCleaning</p>
            <p>Specialist yacht upholstery, carpet and mattress cleaning in Sardinia.</p>
            <p>
              <a class="js-track-phone" href="tel:+393516550908" data-event="phone_click" data-label="footer_phone_fallback">+39 351 655 0908</a><br>
              <a class="js-track-whatsapp" href="https://wa.me/393516550908?text=Hello%2C%20I%20would%20like%20a%20yacht%20interior%20textile%20care%20assessment%20in%20Sardinia." data-event="whatsapp_click" data-label="footer_whatsapp_fallback">WhatsApp assessment</a><br>
              <a class="js-track-email" href="mailto:lanuvolazzurra@gmail.com" data-event="email_click" data-label="footer_email_fallback">lanuvolazzurra@gmail.com</a>
            </p>
          </div>

          <div class="footer-column">
            <h3>Services</h3>
            <a href="/services/yacht-upholstery-cleaning-sardinia.html">Yacht upholstery cleaning</a>
            <a href="/services/yacht-carpet-cleaning-sardinia.html">Yacht carpet cleaning</a>
            <a href="/services/yacht-mattress-cleaning-sardinia.html">Yacht mattress cleaning</a>
          </div>

          <div class="footer-column">
            <h3>Company</h3>
            <a href="/pages/legal/contact.html">Contact</a>
            <a href="/pages/legal/privacy.html">Privacy Policy</a>
            <a href="/pages/legal/cookie-policy.html">Cookie Policy</a>
            <a href="/pages/legal/terms.html">Terms</a>
          </div>
        </div>

        <div class="container footer-bottom">
          <span>© 2026 Yacht Upholstery Sardinia. All rights reserved.</span>
        </div>
      </footer>
    `;

    document.dispatchEvent(new CustomEvent("footer:loaded"));
  }

  fetch(FOOTER_CONFIG_PATH, { cache: "no-cache" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Footer config not found");
      }

      return response.json();
    })
    .then(renderFooter)
    .catch(renderFallback);
})();
