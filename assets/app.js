const rootUrl = new URL("..", document.currentScript.src);

document.querySelectorAll(".site-nav a").forEach((link) => {
  const linkUrl = new URL(link.getAttribute("href"), window.location.href);
  const current = window.location.pathname.replace(/\/index\.html$/, "/");
  if (linkUrl.pathname === current || (linkUrl.pathname !== "/" && current.startsWith(linkUrl.pathname))) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".carousel-slide")];
  const dots = [...carousel.querySelectorAll(".carousel-dot")];
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains("active")));
  let timer;

  const showSlide = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === index;
      slide.classList.toggle("active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
      dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
    });
  };

  const start = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => showSlide(index + 1), 5200);
  };

  previous?.addEventListener("click", () => {
    showSlide(index - 1);
    start();
  });

  next?.addEventListener("click", () => {
    showSlide(index + 1);
    start();
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      showSlide(dotIndex);
      start();
    });
  });

  carousel.addEventListener("mouseenter", () => window.clearInterval(timer));
  carousel.addEventListener("mouseleave", start);
  showSlide(index);
  start();
});

document.querySelectorAll("[data-gallery]").forEach((gallery) => {
  const mainImage = gallery.querySelector("[data-gallery-main]");
  const buttons = [...gallery.querySelectorAll("[data-gallery-thumb]")];

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const image = button.querySelector("img");
      if (!image || !mainImage) {
        return;
      }

      mainImage.src = image.currentSrc || image.src;
      mainImage.alt = image.alt;
      buttons.forEach((thumb) => thumb.setAttribute("aria-current", "false"));
      button.setAttribute("aria-current", "true");
    });
  });
});

const modal = document.querySelector("[data-modal]");
const openButtons = document.querySelectorAll("[data-open-modal]");
const closeButtons = document.querySelectorAll("[data-close-modal]");
let lastFocusedElement;

const openModal = () => {
  if (!modal) {
    return;
  }

  lastFocusedElement = document.activeElement;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector("[data-close-modal]")?.focus();
};

const closeModal = () => {
  if (!modal) {
    return;
  }

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  lastFocusedElement?.focus?.();
};

openButtons.forEach((button) => button.addEventListener("click", openModal));
closeButtons.forEach((button) => button.addEventListener("click", closeModal));

modal?.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("open")) {
    closeModal();
  }
});

document.querySelectorAll("[data-google-form]").forEach((form) => {
  const responseFrame = document.querySelector("[data-response-frame]");
  const status = form.querySelector("[data-form-status]");
  const submitButton = form.querySelector('button[type="submit"]');
  const submitLabel = submitButton?.querySelector("span");
  let submitted = false;

  form.addEventListener("submit", () => {
    submitted = true;
    submitButton?.setAttribute("disabled", "");
    if (submitLabel) {
      submitLabel.textContent = "Sending...";
    }
    if (status) {
      status.textContent = "Sending your entry...";
      status.classList.remove("success");
    }
  });

  responseFrame?.addEventListener("load", () => {
    if (!submitted) {
      return;
    }

    submitted = false;
    form.reset();
    submitButton?.removeAttribute("disabled");
    if (submitLabel) {
      submitLabel.textContent = "Submit another entry";
    }
    if (status) {
      status.textContent = "Your FSC entry was submitted. Thank you!";
      status.classList.add("success");
    }
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(new URL("service-worker.js", rootUrl));
  });
}
