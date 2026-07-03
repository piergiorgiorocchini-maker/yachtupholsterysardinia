/*
  Yacht Upholstery Sardinia - Main JS
  File: assets/js/main.js

  Lightweight UI helpers only.
*/

(function () {
  "use strict";

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
