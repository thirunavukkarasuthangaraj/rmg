/* ===================================================================
   RMG ENTERPRISSES — site interactions
   =================================================================== */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var burger = document.querySelector(".burger");
  var body = document.body;
  var overlay = document.querySelector(".nav-overlay");

  function closeNav() { body.classList.remove("nav-open"); }
  if (burger) {
    burger.addEventListener("click", function () {
      body.classList.toggle("nav-open");
    });
  }
  if (overlay) overlay.addEventListener("click", closeNav);
  document.querySelectorAll(".menu a").forEach(function (a) {
    a.addEventListener("click", closeNav);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  /* ---- Header shadow on scroll ---- */
  var header = document.querySelector("header.site");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 20);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Animated counters ---- */
  var counters = document.querySelectorAll("[data-count]");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1600, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---- Current year in footer ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Contact form (front-end only — opens mail / shows confirmation) ---- */
  var form = document.querySelector("#enquiryForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get("name") || "").toString().trim();
      var phone = (data.get("phone") || "").toString().trim();
      var service = (data.get("service") || "").toString();
      var message = (data.get("message") || "").toString().trim();

      var subject = encodeURIComponent("Enquiry from RMG website — " + (service || "General"));
      var bodyTxt = encodeURIComponent(
        "Name: " + name + "\nPhone: " + phone + "\nService: " + service + "\n\n" + message
      );
      // Open user's mail client addressed to the business
      window.location.href = "mailto:rmgenterprisses@gmail.com?subject=" + subject + "&body=" + bodyTxt;

      var msg = document.querySelector(".form-msg");
      if (msg) {
        msg.classList.add("show", "ok");
        msg.textContent = "Thank you, " + (name || "friend") + "! Your enquiry is ready to send. You can also call us directly for a faster response.";
      }
      form.reset();
    });
  }
})();
