const words = 'In one good Real one, not School set, they State high Life, consider on and not Come, what also for Set point, can Want as while with, of Order, Child about School, Thing never Hold, find Order, each Too, between Program work, End you Home, Place around, while Place Problem, End begin, Interest while Public, or where See time, those Increase Interest, be, give End, Think seem Small, as both Another, a Child, same Eye, you between, Way do, who into Again, good Fact, than Under, very Head, become Real, possible Some, write Know, however Late, each That with, because That Place Nation, only for Each, change Form, consider, we would Interest with World, so Order or Run, more Open that Large, write Turn never Over, Open each, over Change, still Old, take Hold, need, give by, consider Line only, leave while, what Set up, Number 12 part Form, want Against, great Problem, can because Head, so First this, here would Course, become Help year, First End, want Both, Fact Public, long Word, down also Long, for Without, new Turn, Against the, because Write seem, Line Interest, call not If, Line Thing, what Work, people Way, may Old, consider Leave, hold Want Life, between most Place, may if Go, who need Fact, such Program, where which End, off Child, down Change, to from People, high during People, find to However, into Small, new General, it Do, that could Old, for Last, get Another, hand much Eye, great No Work, and with, but Good, there Last, think Can, around Use, like Number 7, never Since, World need, what we around, part Show, new Come, seem while, some and Since, still Small, these you General, which seem, will Place, come Order, form How about, just also, they with State, late Use, both Early, too Lead, general Seem, there Point, take General, seem Few out, like Might, under If ask, while Such, Interest feel, Word Right, again How about, system Such, between Late, want Fact, up Problem, stand New, say Move, a Lead Small, however Large, Public out, by Eye here, over So, be Way use, like Say, people Work, for Since, Interest so, face Order, School good, not most, run Problem, group Run, she Late, other Problem, 24 real form, what just High, no Man do, under would to, each Too, end Point, give Number, child Through, so this Large, see Get, form also, all Those, Course to Work, during About, he Plan still, so Like down, he Look down, where Course, at who Plan, way So, since Come against, he all Who, at World, because while, so Few last, these Mean, take House, who Old, way Large, no First too, now Off, would in this, Course Present, order Home, Public School, back Own, little About, he Develop, of Do over, help Day, House stand, Present another, by Few come, that Down last, or Use, Say take, would Each, even Govern, Play around, back Under, some Line, think she Even, when From do, real Problem, between Long, as there, school Do, as Mean to all On, other Good, may From, might Call, world Thing, Life turn, of He look, Last problem, after Get, show Want, need Thing, Old other, during Be again, develop Come, from Consider, the Now, number Say, Life interest, to system, only Group, world Same, state School, one Problem, between For, turn Run, at very, Against Eye, must Go, both Still, all A as, so after Play, Eye Little, be Those, should Out, after Which, these Both, much House, become Both, school This, he Real, and May, mean Time, by Real, number Other, as Feel, at End, ask Plan, come Turn, by All, head Increase, he Present, increase Use, stand After, see Order, lead Than, system Here, ask In, of Look, point Little, too Without, each For, both But, right We, come World, much Own, set We, right Off, long Those, stand Go, both But, under Now, must Real, general Then, before With, much Those, at No, of We only, back These, person Plan, from Run, new as, own Take, early Just, increase Only, look Open, follow Get, that on, system The, mean Plan, man Over, it Possible, if Most, late Line, would First, without Real, hand Say, turn Point, small Set, at in, system However, to be, home Show, new Again, come Under, because About, show Face, child Know, person Large, program How, over Could, thing From, out World, while Nation, stand Part, run Have, look What, many System, order Some, one Program, you Great, could Write, day Do, he Any, also Where, child Late, face Eye, run Still, again How, by As, call High, the Must, by Late, little Mean, never Another, seem to Leave, because For, day Against, public Long, number Word, about After, much Need, open Change, also.'.split(' ');
const wordsCount = words.length; 
const gameTime = 30 * 1000;            //60sec in millisec
window.timer = null;
window.gameStart = null;
window.pauseTime = 0;



function randomWord() {
  const randomIndex = Math.ceil(Math.random() * wordsCount);
  return words[randomIndex - 1];
}

function formatWord(word) {
  return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
  clearInterval(window.timer); // Clear any existing timer
  window.timer = null;
  window.gameStart = null;
  window.pauseTime = 0;

  // Clear the words area and add new words
  document.getElementById('words').innerHTML = '';
  for (let i = 0; i < 200; i++) {
    document.getElementById('words').innerHTML += formatWord(randomWord());
  }

  // Reset state for first word and letter
  addClass(document.querySelector('.word'), 'current');
  addClass(document.querySelector('.letter'), 'current');
  document.getElementById('info').innerHTML = (gameTime / 1000) + '';
  document.getElementById('words').style.marginTop = '0px';
  removeClass(document.getElementById('game'), 'over');
  document.getElementById('cursor').style.display = 'block';

  // Set the cursor position to the first letter of the first word
  const firstLetter = document.querySelector('.letter.current');
  const cursor = document.getElementById('cursor');
  cursor.style.top = firstLetter.getBoundingClientRect().top + 2 + 'px';
  cursor.style.left = firstLetter.getBoundingClientRect().left + 'px';
}

function getWpm() {
  const words = [...document.querySelectorAll('.word')];
  const lastTypedWord = document.querySelector('.word.current');
  const lastTypedWordIndex = words.indexOf(lastTypedWord) + 1;
  const typedWords = words.slice(0, lastTypedWordIndex);
  const correctWords = typedWords.filter(word => {
    const letters = [...word.children];
    const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
    const correctLetters = letters.filter(letter => letter.className.includes('correct'));
    return incorrectLetters.length === 0 && correctLetters.length === letters.length;
  });
  return (correctWords.length / gameTime) * 60000;
}

function gameOver() {
  clearInterval(window.timer);
  addClass(document.getElementById('game'), 'over');
  const result = getWpm();
  document.getElementById('info').innerHTML = `WPM: ${result}`;
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
      const currentTime = (new Date()).getTime();
      const msPassed = currentTime - window.gameStart;
      const sPassed = Math.round(msPassed / 1000);
      const sLeft = Math.round((gameTime / 1000) - sPassed);
      if (sLeft <= 0) {
        gameOver();
        return;
      }
      document.getElementById('info').innerHTML = sLeft + '';
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
