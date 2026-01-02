import { Notyf } from "notyf";
import "notyf/notyf.min.css";

export const toast = new Notyf({
  duration: 2600,
  position: {
    x: "right",
    y: "top",
  },
  ripple: true,
  dismissible: true,
  types: [
    {
      type: "success",
      background: "#f97316", // PetSaviour Orange
      icon: {
        className: "ps-toast-icon",
        tagName: "span",
        text: "🐾",
      },
    },
    {
      type: "error",
      background: "#ef4444",
      icon: {
        className: "ps-toast-icon",
        tagName: "span",
        text: "😿",
      },
    },
  ],
});
