const words = 'azxcvf lkmnbj'.split(" ");
const wordsCount = words.length; 
const targetWordCount = 20;  // End the game after typing 50 correct words
window.timer = null;
window.gameStart = null;
window.pauseTime = 0;
window.correctWordCount = 0;  // Track the number of correct words typed

function getWords() {
  return Array(100).fill('azxcvf lkmnbj').join(" ").split(" ");  // Repeat the phrase 20 times
}

function formatWord(word) {
  return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
  clearInterval(window.timer); // Clear any existing timer
  window.timer = null;
  window.gameStart = null;
  window.pauseTime = 0;
  window.correctWordCount = 0;  // Reset the correct word count

  // Clear the words area and add new words
  document.getElementById('words').innerHTML = '';
  const repeatedWords = getWords(); // Get the repeated words
  for (let i = 0; i < repeatedWords.length; i++) {
    document.getElementById('words').innerHTML += formatWord(repeatedWords[i]);
  }

  // Reset state for first word and letter
  addClass(document.querySelector('.word'), 'current');
  addClass(document.querySelector('.letter'), 'current');
  document.getElementById('info').innerHTML = targetWordCount + ' words';
  document.getElementById('words').style.marginTop = '0px';
  removeClass(document.getElementById('game'), 'over');
  document.getElementById('cursor').style.display = 'block';

  // Set the cursor position to the first letter of the first word
  const firstLetter = document.querySelector('.letter.current');
  const cursor = document.getElementById('cursor');
  cursor.style.top = firstLetter.getBoundingClientRect().top + 2 + 'px';
  cursor.style.left = firstLetter.getBoundingClientRect().left + 'px';
}



function gameOver() {
  clearInterval(window.timer);
  addClass(document.getElementById('game'), 'over');
  
  document.getElementById('info').innerHTML = `Good try again!`;
}

document.getElementById('game').addEventListener('keyup', ev => {
  const key = ev.key;
  const currentWord = document.querySelector('.word.current');
  const currentLetter = document.querySelector('.letter.current');
  const expected = currentLetter?.innerHTML || ' ';
  const isLetter = key.length === 1 && key !== ' ';
  const isSpace = key === ' ';
  const isBackspace = key === 'Backspace';
  const isFirstLetter = currentLetter === currentWord.firstChild;

  if (document.querySelector('#game.over')) {
    return;
  }

  console.log({ key, expected });

  if (!window.timer && isLetter) {
    window.timer = setInterval(() => {
      if (!window.gameStart) {
        window.gameStart = (new Date()).getTime();
      }
    }, 1000);
  }

  if (isLetter) {
    if (currentLetter) {
      addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
      removeClass(currentLetter, 'current');
      if (currentLetter.nextSibling) {
        addClass(currentLetter.nextSibling, 'current');
      }
    } else {
      const incorrectLetter = document.createElement('span');
      incorrectLetter.innerHTML = key;
      incorrectLetter.className = 'letter incorrect extra';
      currentWord.appendChild(incorrectLetter);
    }
  }

  if (isSpace) {
    if (expected !== ' ') {
      const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
      lettersToInvalidate.forEach(letter => {
        addClass(letter, 'incorrect');
      });
    }
    removeClass(currentWord, 'current');
    addClass(currentWord.nextSibling, 'current');
    if (currentLetter) {
      removeClass(currentLetter, 'current');
    }
    addClass(currentWord.nextSibling.firstChild, 'current');
    
    // Count correct word
    if (![...currentWord.querySelectorAll('.letter.incorrect')].length) {
      window.correctWordCount++;
      document.getElementById('info').innerHTML= `${20-window.correctWordCount} words left`;
    }

    // Check if 20 words have been typed correctly
    if (window.correctWordCount >= targetWordCount) {
      gameOver();
    }
  }

  if (isBackspace) {
    if (currentLetter && isFirstLetter) {
      // make prev word current, last letter current
      removeClass(currentWord, 'current');
      addClass(currentWord.previousSibling, 'current');
      removeClass(currentLetter, 'current');
      addClass(currentWord.previousSibling.lastChild, 'current');
      removeClass(currentWord.previousSibling.lastChild, 'incorrect');
      removeClass(currentWord.previousSibling.lastChild, 'correct');
    }
    if (currentLetter && !isFirstLetter) {
      // move back one letter, invalidate letter
      removeClass(currentLetter, 'current');
      addClass(currentLetter.previousSibling, 'current');
      removeClass(currentLetter.previousSibling, 'incorrect');
      removeClass(currentLetter.previousSibling, 'correct');
    }
    if (!currentLetter) {
      addClass(currentWord.lastChild, 'current');
      removeClass(currentWord.lastChild, 'incorrect');
      removeClass(currentWord.lastChild, 'correct');
    }
  }

  // move lines / words
  if (currentWord.getBoundingClientRect().top > 380) {
    const words = document.getElementById('words');
    const margin = parseInt(words.style.marginTop || '0px');
    words.style.marginTop = (margin - 35) + 'px';
  }

  // move cursor
  const nextLetter = document.querySelector('.letter.current');
  const nextWord = document.querySelector('.word.current');
  const cursor = document.getElementById('cursor');
  cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
  cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
});

function addClass(el, name) {
  el.className += ' ' + name;
}

function removeClass(el, name) {
  el.className = el.className.replace(name, '');
}

document.getElementById('newGame').addEventListener('click', () => {
  newGame();
});

newGame();
