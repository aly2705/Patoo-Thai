//////////////////////////////////////////////////////////
// ELEMENTS

const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slider__card");
console.log(slides);
const btnLeft = document.querySelector(".slider__btn--to-left");
const btnRight = document.querySelector(".slider__btn--to-right");

const slidePositions = function (slideTo) {
  if (slideTo === 0) {
    slides[0].style.transform = "translate(-50%, 1.5rem)";
    slides[1].style.transform = "translate(calc(50% + 3rem), 0.75rem)";
    slides[2].style.transform = " translate(calc(150% + 6rem), 0)";
    slides[3].style.transform = "translate(calc(250% + 9rem), 0)";
    slides[4].style.transform = "translate(calc(350% + 12rem), 0)";
  }

  if (slideTo === 1) {
    slides[0].style.transform = " translate(calc(-150% - 3rem), 0.75rem)";
    slides[1].style.transform = "translate(-50%, 1.5rem)";
    slides[2].style.transform = "translate(calc(50% + 3rem), 0.75rem)";
    slides[3].style.transform = " translate(calc(150% + 6rem), 0)";
    slides[4].style.transform = "translate(calc(250% + 9rem), 0)";
  }

  if (slideTo === 2) {
    slides[0].style.transform = " translate(calc(-250% - 6rem), 0)";
    slides[1].style.transform = "translate(calc(-150% - 3rem), 0.75rem)";
    slides[2].style.transform = "translate(-50%, 1.5rem)";
    slides[3].style.transform = " translate(calc(50% + 3rem), 0.75rem)";
    slides[4].style.transform = "translate(calc(150% + 6rem), 0)";
  }
  if (slideTo === 3) {
    slides[0].style.transform = "translate(calc(-350% - 9rem), 0)";
    slides[1].style.transform = " translate(calc(-250% - 6rem), 0)";
    slides[2].style.transform = "translate(calc(-150% - 3rem), 0.75rem)";
    slides[3].style.transform = "translate(-50%, 1.5rem)";
    slides[4].style.transform = " translate(calc(50% + 3rem), 0.75rem)";
  }
  if (slideTo === 4) {
    slides[0].style.transform = "translate(calc(-450% - 12rem), 0)";
    slides[1].style.transform = "translate(calc(-350% - 9rem), 0)";
    slides[2].style.transform = " translate(calc(-250% - 6rem), 0)";
    slides[3].style.transform = "translate(calc(-150% - 3rem), 0.75rem)";
    slides[4].style.transform = "translate(-50%, 1.5rem)";
  }
};

const checkForBtnRemoval = function (nextSlideTo) {
  if (nextSlideTo < 0) {
    btnLeft.classList.add("slider__btn--hidden");
  } else if (nextSlideTo > 4) {
    btnRight.classList.add("slider__btn--hidden");
  } else {
    btnLeft.classList.remove("slider__btn--hidden");
    btnRight.classList.remove("slider__btn--hidden");
  }
};

btnLeft.addEventListener("click", function () {
  const slideTo = +this.dataset.slideTo;
  console.log(slideTo);

  slides[slideTo + 1].classList.remove("slider__card--active");
  slides[slideTo].classList.add("slider__card--active");

  slidePositions(slideTo);

  checkForBtnRemoval(slideTo - 1);
  this.dataset.slideTo = slideTo - 1;
  btnRight.dataset.slideTo = slideTo + 1;
});

btnRight.addEventListener("click", function () {
  const slideTo = +this.dataset.slideTo;
  console.log(slideTo);

  slides[slideTo - 1].classList.remove("slider__card--active");
  slides[slideTo].classList.add("slider__card--active");

  slidePositions(slideTo);

  checkForBtnRemoval(slideTo + 1);
  this.dataset.slideTo = slideTo + 1;
  btnLeft.dataset.slideTo = slideTo - 1;
});
