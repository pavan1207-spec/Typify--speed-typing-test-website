const words = 'abcdefghijklmnopqrstuvwxyz.,'.split(" ");
const wordsCount = words.length; 
const targetWordCount = 20;  
window.timer = null;
window.gameStart = null;
window.pauseTime = 0;
window.correctWordCount = 0; 

function getWords() {
  return Array(100).fill('abcdefghijklmnopqrstuvwxyz.,').join(" ").split(" ");  // Repeat the phrase 20 times
}

function formatWord(word) {
  return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
  clearInterval(window.timer); 
  window.timer = null;
  window.gameStart = null;
  window.pauseTime = 0;
  window.correctWordCount = 0; 

  document.getElementById('words').innerHTML = '';
  const repeatedWords = getWords(); 
  for (let i = 0; i < repeatedWords.length; i++) {
    document.getElementById('words').innerHTML += formatWord(repeatedWords[i]);
  }

  addClass(document.querySelector('.word'), 'current');
  addClass(document.querySelector('.letter'), 'current');
  document.getElementById('info').innerHTML = targetWordCount + ' words';
  document.getElementById('words').style.marginTop = '0px';
  removeClass(document.getElementById('game'), 'over');
  document.getElementById('cursor').style.display = 'block';

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
    
    if (![...currentWord.querySelectorAll('.letter.incorrect')].length) {
      window.correctWordCount++;
      document.getElementById('info').innerHTML= `${20-window.correctWordCount} words left`;
    }

    if (window.correctWordCount >= targetWordCount) {
      gameOver();
    }
  }

  if (isBackspace) {
    if (currentLetter && isFirstLetter) {
      removeClass(currentWord, 'current');
      addClass(currentWord.previousSibling, 'current');
      removeClass(currentLetter, 'current');
      addClass(currentWord.previousSibling.lastChild, 'current');
      removeClass(currentWord.previousSibling.lastChild, 'incorrect');
      removeClass(currentWord.previousSibling.lastChild, 'correct');
    }
    if (currentLetter && !isFirstLetter) {
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

  if (currentWord.getBoundingClientRect().top > 380) {
    const words = document.getElementById('words');
    const margin = parseInt(words.style.marginTop || '0px');
    words.style.marginTop = (margin - 35) + 'px';
  }

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
