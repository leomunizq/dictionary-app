const wrapper = document.querySelector('.wrapper'),
  searchInput = wrapper.querySelector('input')
synonyms = wrapper.querySelector('.details .list')

infoText = wrapper.querySelector('.info-text')
volume = wrapper.querySelector('.word i')
removeIcon = wrapper.querySelector('.search span')
let audio
//funcao para pesquisar os sinonimos
function search(word) {
  searchInput.value = word
  fetchApi(word)
  wrapper.classList.remove('active')
}

// data function
function data(result, word) {
  if (result.title) {
    //se a Api retonar uma mensagem que nao encontrou a palavra
    infoText.innerHTML = `Can't find the meaning of <span>${word}</span>. Please try to search for another word.`
  } else {
    console.log(result)
    wrapper.classList.add('active')
    let definitions = result[0].meanings[0].definitions[0]
    phontetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`

    // permite passar os dados de resposta em particular para um elemento html especifico
    document.querySelector('.word p').innerHTML = result[0].word
    document.querySelector('.word span').innerHTML = phontetics

    document.querySelector('.meaning span').innerHTML = definitions.definition
    document.querySelector('.example span').innerHTML = definitions.example
    audio = new Audio('https:' + result[0].phonetics[0].audio)

    //sinonimos
    if (definitions.synonyms[0] == undefined) {
      synonyms.parentElement.style.display = 'none'
    } else {
      synonyms.parentElement.style.display = 'block'

      synonyms.innerHTML = ''

      for (let i = 0; i < 5; i++) {
        // busca os 5 sinonimos
        let tag = `<span onclick=search('${definitions.synonyms[i]}')>${definitions.synonyms[i]},</span>`
        synonyms.insertAdjacentHTML('beforeend', tag) //passa os sinonimos para dentro da Div
      }
    }
  }
}

// fetch API function
function fetchApi(word) {
  wrapper.classList.remove('active')
  infoText.style.color = '#000'
  infoText.innerHTML = `Searching the meaning of <span>${word}</span>`
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  fetch(url)
    .then(res => res.json())
    .then(result => data(result, word))
}

searchInput.addEventListener('keyup', e => {
  if (e.key === 'Enter' && e.target.value) {
    fetchApi(e.target.value)
  }
})

volume.addEventListener('click', () => {
  audio.play()
})

removeIcon.addEventListener('click', () => {
  searchInput.value = ''
  searchInput.focus()
  wrapper.classList.remove('active')
  infoText.style.color = '#000'
  infoText.innerHTML =
    'Type any existing word and press enter to get meaning, example, synonyms, etc.'
})
