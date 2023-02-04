randNum = function(limit) {
  return Math.floor(Math.random() * limit);
}
showPartTwo = () => {
  let partTwo = document.createElement('p') 
  partTwo.textContent = answer
  document.getElementById('showPartTwo').remove()
  document.querySelector('.output-result').appendChild(partTwo)
}
appendAnswerButton = (parent) => {
  let partTwoButton = document.createElement('button')
  partTwoButton.textContent = 'Tell me'
  partTwoButton.id = 'showPartTwo'
  partTwoButton.onclick = showPartTwo
  parent.appendChild(partTwoButton)
}
//-------------------------------------------------------------
// -----------------------FETCH MEME---------------------------
// ------------------------------------------------------------
fetchMemeList = function() {
  return fetch('https://api.imgflip.com/get_memes')
    .then(data => data.json())
    .then(data => data.data)
}
getRandomMemeURL = function(memeList) {
  let memeURL = memeList.then((list) => {
    const memeQtty = list.memes.length
    return list.memes[randNum(memeQtty)].url
  })
  return memeURL;
}
//-------------------------------------------------------------
// -----------------------FETCH JOKE---------------------------
// ------------------------------------------------------------
fetchJokeList = () => {
  return fetch('https://v2.jokeapi.dev/joke/Any?amount=10&safe-mode')
    .then(data => data.json())
}
updateJokeCounterAndList = () => {
  if (jokeCounter === 9) {
    jokeCounter = 0;
    jokeList = fetchJokeList();
  } else {
    jokeCounter++
  }
}
fetchRandomJoke = (jokeList, jokeCounter) => {
  return jokeList.then(data => data.jokes[jokeCounter])
}
//-------------------------------------------------------------
// ----------------------FETCH QUOTE---------------------------
// ------------------------------------------------------------
fetchQuoteList = () => {
  return fetch('https://dummyjson.com/quotes?limit=100')
    .then(data => data.json())
}
getRandomQuote = (quoteList) => {
  return quoteList.then(data => data.quotes[randNum(100)])
}
//-------------------------------------------------------------
// ---------------------FETCH RIDDLE---------------------------
// ------------------------------------------------------------
fetchRandomRiddle = () => {
  return fetch('https://riddles-api.vercel.app/random')
    .then(data => data.json())
}
//-------------------------------------------------------------
// --------------------ELEMENT HANDLER-------------------------
// ------------------------------------------------------------
deleteOutputElementIfExists = () => {
  let outputResult = document.querySelector('.output-result')
  if(typeof(outputResult) != 'undefined' && outputResult != null){
    outputResult.remove()
  }
}
createOutputElement = (tag) => {
  return document.createElement(tag)
}
fillOutputElement = (outputElement, id, content) => {
  outputElement.setAttribute('id', id)
  outputElement.setAttribute('class', 'output-result')
  if (id === 'meme') {
    outputElement.setAttribute('src', content)
    outputElement.setAttribute('height', '300px')
  } else if (outputElement.tagName === "P") {
    outputElement.textContent = content

  }
   outputElement.style.width = '300px'
}
addOutputElementToPage = (outputElement, addBeforeId) => {
  let outputTextParent = document.getElementById('output-text-list')
  let addBeforeElement = document.getElementById(addBeforeId)
  if (outputElement.id === 'riddle') {
    outputTextParent.appendChild(outputElement)
  } else {
    outputTextParent.insertBefore(outputElement, addBeforeElement)//
  }
}
// append to #output-text-list
//-------------------------------------------------------------
// ----------------------BUTTON FUNCTIONS----------------------
// ------------------------------------------------------------
addRandomMemeToPage = (memeList) => {
  getRandomMemeURL(memeList)
    .then((meme) => {
      deleteOutputElementIfExists()
      let outputElement = createOutputElement('img')
      fillOutputElement(outputElement, 'meme', meme)
      addOutputElementToPage(outputElement, 'joke-text')
  })
}
addRandomJokeToPage = (jokeList, jokeCounter) => {
  fetchRandomJoke(jokeList, jokeCounter).then(joke => {
    let jk = "";
    let outputElement = createOutputElement('p')
    if (joke.type === 'single') {
      jk = joke.joke
    } else {
      outputElement = createOutputElement('div')
      let setup = document.createElement('p')
      setup.textContent = joke.setup
      answer = joke.delivery
      outputElement.appendChild(setup)
      appendAnswerButton(outputElement)
    }
    updateJokeCounterAndList()
    deleteOutputElementIfExists()
    fillOutputElement(outputElement, 'joke', jk)
    addOutputElementToPage(outputElement, 'quote-text')
  })                    
}
addRandomRiddleToPage = () => {
  fetchRandomRiddle().then(data => {
    deleteOutputElementIfExists()
    let outputElement = createOutputElement('div')
    outputElement.setAttribute('class', 'created')
    
    let riddle = document.createElement('p')
    riddle.textContent = data.riddle
    outputElement.appendChild(riddle)
    appendAnswerButton(outputElement)
    fillOutputElement(outputElement, 'riddle')
    addOutputElementToPage(outputElement)
    answer = data.answer
    console.log(outputElement)
  })
}
addRandomQuoteToPage = (quoteList) => {
  getRandomQuote(quoteList).then(data => {
    deleteOutputElementIfExists()
    let outputElement = createOutputElement('div')
    let author = document.createElement('p')
    let quote = document.createElement('p')
    author.textContent = '--- ' + data.author
    quote.textContent = data.quote
    outputElement.appendChild(quote)
    outputElement.appendChild(author)
    fillOutputElement(outputElement, 'quote')
    addOutputElementToPage(outputElement, 'riddle-text')
  })
}
//-------------------------------------------------------------
// ---------------------EXECUTION ORDER------------------------
// ------------------------------------------------------------
// constant bc api always returns the same list
const memeList = fetchMemeList()
let jokeCounter = 0 //global var to execute updateJoke; don't change name
let jokeList = fetchJokeList() //global var to be updated by updateJoke; don't change name
let quoteList = fetchQuoteList()//
let answer; //also global
