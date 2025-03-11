const text = document.querySelector("h1 span");
const words = ["Programmer", "Mentor", "Speaker", "Content Creator"];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typeEffect = () => {
  const currentWord = words[wordIndex];
  const currentChar = currentWord.substring(0, charIndex);
  console.log(currentWord, currentChar);
  text.textContent = currentChar;
  text.classList.add("stop-blinking");

  if (!isDeleting && charIndex < currentWord.length) {
    charIndex++;
    setTimeout(typeEffect, 150);
  } else if(isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeEffect, 100);
  } else{
    isDeleting = !isDeleting;
    text.classList.remove("stop-blinking");
    wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
    setTimeout(typeEffect, 700);
  }

}

typeEffect();