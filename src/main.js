/** @type {String} List of state subscripts for the non-trivial states. */
const subscripts = "0123456789abcdefghijklmnopqrstuvwxyz";

/** @type {Array<String>} List of inputs comprising the alphabet */
const alphabet = [];

/** @type {Array<String>} List of states in the DFA */
const states = [];

/** @type {String} Starting state of this DFA */
const startState = 'q';

/** @type {String} Dead state of this DFA */
const deadState = 'x';

/** @type {Array<{current: String, input: String, next: String}>} List of transition mappings */
const transitions = [];

/** @type {String} Current state being tracked */
let currentState = startState;

/**
 * Changes the current state to the next state depending on the input.
 * @param {String} input Input to use for transition
 */
function changeState(input)
{
  for (let i = 0; i < transitions.length; i ++)
  {
    /* The current state is only updated if the current state and input match
    the transition being checked. */
    const t = transitions[i];
    if (t.current == currentState && t.input == input) {
      currentState = t.next;
      return;
    }
  }
}

/**
 * Checks to see if the current input stream has any noise.
 * @param {String} stream Input stream to be checked
 */
function checkStream()
{
  const stream = String(inputStream.value);
  let badIndex = 0;

  /* The input stream must be non-empty. */
  if (stream.length == 0 || stream == '')
  {
    dfaDetails.value = 'It seems your input stream is empty.<br>Please try again.';
    return;
  }
  dfaDetails.innerHTML = '';

  /* The stream characters determine the ending state after everything is processed. */
  currentState = startState;
  for (let i = 0; i < stream.length; i ++)
  {
    /* The state should be changed. */
    const letter = stream[i].toLowerCase();
    const temp = currentState;
    changeState(letter);
    if (currentState == deadState && temp != deadState)
    {
      badIndex = i;
    }
    dfaDetails.innerHTML += `δ(${temp}, ${letter}) = ${currentState}<br>`;
  }

  /* Checking for dead state. */
  if (currentState == deadState)
  {
    noiseInfo.innerHTML = `&#10060; It appears there may be noise in the input stream at character #${badIndex}.`
  }
  else
  {
    noiseInfo.innerHTML = '&#9989; No noise detected; your input stream is clean.';
  }
}

/* All the DFA components must be defined/populated. */
states.push(startState);
for (let i = 0; i < subscripts.length; i ++) {
  alphabet.push(subscripts[i]);
  states.push(`q${subscripts[i]}`);
}
states.push(deadState);

/* The transitions must be defined. */
alphabet.forEach(a => transitions.push( {current: startState, input: a, next: `q${a}`} ));
alphabet.forEach(a => {
  alphabet.forEach(b => {
    if (a == b) { transitions.push( {current: `q${a}`, input: a, next: deadState} ); }
    else { transitions.push( {current: `q${a}`, input: b, next: `q${b}`} ); }
  });
});
alphabet.forEach(a => transitions.push( {current: deadState, input: a, next: deadState} ));

/* The elements will be retrieved for easy access. */
const inputStream = document.getElementById('input-stream');
const checkButton = document.getElementById('check-stream');
const dfaDetails = document.getElementById('dfa-details');
const noiseInfo = document.getElementById('noise-info');

checkButton.addEventListener('click', () => {
  checkStream();
});

// transitions.forEach(t => console.log(t));