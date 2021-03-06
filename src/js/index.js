import "core-js/stable";
import "regenerator-runtime/runtime";

import "../sass/main.scss";

// DOM Elements
const tooltips = document.querySelectorAll(".tooltips .tooltip");
const section = document.querySelector(".section");
const container = document.querySelector(".container");

function positionToolitp() {
  tooltips.forEach((tooltip) => {
    const pin = tooltip.querySelector(".tooltip__pin");
    const content = tooltip.querySelector(".tooltip__content");
    const arrow = tooltip.querySelector(".tooltip__content__arrow");

    // pin.getBoundingClientRect().left is relative to viewport
    // pin.offsetLeft is relative to it's parent

    const tooltipRightBound =
      container.offsetLeft + pin.offsetLeft + pin.offsetWidth / 2 + content.offsetWidth / 2;
    const sectionRightBound = section.offsetWidth;
    const pinLeftBount = pin.getBoundingClientRect().left;

    // If tooltip content is out of screen to the right side
    if (tooltipRightBound > sectionRightBound) {
      console.log("Right conflict");
      const extraLeft = tooltipRightBound - sectionRightBound;
      content.style.left = `${
        pin.offsetLeft + pin.offsetWidth / 2 - content.offsetWidth / 2 - extraLeft
      }px`;
    }
    // If tooltip content is out of screen to the left side
    else if (pinLeftBount < content.offsetWidth / 2) {
      console.log("Left conflict");
      const extraRight = content.offsetWidth / 2 - pinLeftBount;
      content.style.left = `${pin.offsetLeft - content.offsetWidth / 2 + extraRight}px`;
    }
    // Tooltip content is within the viewport
    else {
      console.log("Tooltip fit screen");
      content.style.left = `${pin.offsetLeft - content.offsetWidth / 2}px`;
    }

    content.style.top = `${pin.offsetTop + 40}px`;
    arrow.style.left = `${pin.offsetLeft - content.offsetLeft + pin.offsetWidth / 2}px`;
  });
}

positionToolitp();
["load", "resize"].forEach((evt) => window.addEventListener(evt, positionToolitp));

// Used to track each tooltip's timeout
const tooltipTimtoutIdMap = {};

// Add listeners to tooltips
tooltips.forEach((tooltip) => {
  const pin = tooltip.querySelector(".tooltip__pin");
  const content = tooltip.querySelector(".tooltip__content");

  // Mouse moves over on pin or tooltip
  [pin, content].forEach((el) =>
    el.addEventListener("mouseover", function (evt) {
      // Gets the tooltip and uses data-tooltip-id as key for tooltipTimtoutIdMap
      const tooltip = evt.target.closest(".tooltip");
      if (!tooltip) return;
      const tooltipId = tooltip.dataset.tooltipId;

      // If this tooltip has a close timeout, clears it
      if (tooltipTimtoutIdMap[tooltipId]) {
        clearTimeout(tooltipTimtoutIdMap[tooltipId]);
        tooltipTimtoutIdMap[tooltipId] = undefined;
      }

      // Open the tooltip
      content.classList.add("tooltip__content--active");
    })
  );

  // Mouse moves out on pin or tooltip
  [pin, content].forEach((el) =>
    el.addEventListener("mouseout", function (evt) {
      // Gets the tooltip and uses data-tooltip-id as key for tooltipTimtoutIdMap
      const tooltip = evt.target.closest(".tooltip");
      if (!tooltip) return;
      const tooltipId = tooltip.dataset.tooltipId;

      // Close tooltip in 1 second
      tooltipTimtoutIdMap[tooltipId] = setTimeout(() => {
        content.classList.remove("tooltip__content--active");
      }, 1000);
    })
  );
});
