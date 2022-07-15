const slider = document.querySelector(".slider-container"),
  slides = Array.from(document.querySelectorAll(".slide"));

let isDragging = false,
  startPos = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  animationID = 0,
  currentIndex = 0;

// if mouse clicked, or finger pressed
const getPositionX = (event) =>
  event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;

const setSliderPosition = () =>
  (slider.style.transform = `translateX(${currentTranslate}px)`);

const animation = () => {
  setSliderPosition();
  isDragging && requestAnimationFrame(animation);
};

const touchStart = (index) => (event) => {
  isDragging = true;
  currentIndex = index;
  startPos = getPositionX(event);

  animationID = requestAnimationFrame(animation);

  // change pointer
  slider.classList.add("grabbing");
};

const setPositionByIndex = () => {
    currentTranslate = currentIndex * -window.innerWidth
    prevTranslate = currentTranslate
    setSliderPosition()
};

const touchEnd = (event) => {
  isDragging = false;

  cancelAnimationFrame(animationID);

  // change pointer
  slider.classList.remove("grabbing");

  // snap to the left
  const movedBy = currentTranslate - prevTranslate;

  if (movedBy < -100 && currentIndex < slides.length - 1) {
    currentIndex += 1;
  }

  if (movedBy > 100 && currentIndex > 0) {
    currentIndex -= 1;
  }

  setPositionByIndex();
};

const touchMove = (event) => {
  if (isDragging) {
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
};

slides.forEach((slide, index) => {
  // code below prevents default action which is when you click and drag the image, a reflection of it comes with it

  const slideImage = slide.querySelector("img");
  slideImage.addEventListener("dragstart", (event) => event.preventDefault());

  // Touch Event
  slide.addEventListener("touchstart", touchStart(index));
  slide.addEventListener("touchend", touchEnd);
  slide.addEventListener("touchmove", touchMove);

  // Mouse Event
  slide.addEventListener("mousedown", touchStart(index));
  slide.addEventListener("mouseup", touchEnd);
  slide.addEventListener("louseleave", touchEnd);
  slide.addEventListener("mousemove", touchMove);
});

window.oncontextmenu = (event) => {
  // No context menu when right click
  event.preventDefault();

  event.stopPropagation();

  return false;
};
