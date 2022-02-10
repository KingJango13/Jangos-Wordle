let guessNum = 0, letterIndex = 0, word = "", letterCounts = {};
const letters = "abcdefghijklmnopqrstuvwxyz"
let wordPromise = fetch("https://gist.githubusercontent.com/cfreshman/a03ef2cba789d8cf00c08f767e0fad7b/raw/5d752e5f0702da315298a6bb5a771586d6ff445c/wordle-answers-alphabetical.txt")
    .then(x => x.text())
    .then(x => x.split("\n"))
    .then(x => {
        window.words = x;
        return x;
    })
    
const currentRow = () => document.querySelector("tbody").rows[guessNum];
const currentCell = () => currentRow().cells[letterIndex];

function load(){
    wordPromise.then(x => {
        word = x[Math.floor(Math.random() * x.length)]
        letters.split("").forEach(letter => letterCounts[letter] = 0)
        word.split("").forEach(letter => letterCounts[letter]++)
    })
    document.body.addEventListener("keydown",handleKey)
    for(var btn of document.getElementsByClassName("letter")){
        btn.addEventListener("click",handleKey)
    }
    document.getElementById("backspace").addEventListener("click",handleKey);
    document.getElementById("enter").addEventListener("click",handleKey);
}

function handleKey(e){
    var key = e.key || e.target.textContent.toLowerCase();
    
    currentCell().classList.remove("current")
    if(letters.includes(key.toLowerCase())){
        currentCell().textContent = key;
        if(letterIndex < 4)letterIndex++;
    } else if(key === "Backspace" || key === "⌫"){
        currentCell().textContent = "";
        if(letterIndex > 0)letterIndex--;
    } else if(key === "Enter" || key === "⏎"){
        var cells = [...currentRow().cells];
            var wordGuess = cells.map(x => x.textContent).join("");
            if(wordGuess.length === 5){
                if(wordGuess === word){
                    cells.forEach(x => x.classList.add("correct"))
                    alert("You win!")
                } else if(guessNum === 6) {
                    alert("Game over\nThe word was " + word)
                } else {
                    if(words.includes(wordGuess)){
                        cells.forEach(cell => {
                            var letter = cell.textContent;
                            if(word.includes(letter)){
                                if(letterCounts[letter] > 0){
                                    cell.classList.add("correct_letter");
                                    letterCounts[letter]--
                                }
                            } else {
                                for(var btn of document.getElementsByClassName("letter")){
                                    if(btn.textContent === letter.toUpperCase()){
                                        btn.classList.add("wrong")
                                    }
                                }
                            }
                        })

                        cells.forEach((cell,i) => {
                            if(cell.textContent === word[i]){
                                if(cell.classList.contains("correct_letter")){
                                    cell.classList.remove("correct_letter")
                                }
                                cell.classList.add("correct");
                            }
                        })
                        Object.values(letterCounts).forEach(count => count = 0)
                        word.split("").forEach(letter => letterCounts[letter]++)
                        guessNum++;
                        letterIndex = 0;
                    } else {
                        alert("Please enter a real word")
                    }
                }
            } else {
                alert("Please enter a 5 letter word")
            }
            
        }
        currentCell().classList.add("current")
}