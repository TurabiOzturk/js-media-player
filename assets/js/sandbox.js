import * as variables from "./selectors";

let volume_slider = document.querySelector(".volume_slider");

volume_slider.addEventListener("change", () => {
  console.log(volume_slider.value);
});
