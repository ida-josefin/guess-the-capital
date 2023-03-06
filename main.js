const countries_url = "https://restcountries.com/v3.1/all";

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
      }
}

(async () => {
    const countries = await fetchData(countries_url);

    let randomNumber;
    let usedCountries = [];

    const getRandomCountry = () => {
        randomNumber = Math.floor(Math.random()* countries.length);
        let randomCountry = countries[randomNumber].name.common;
        if (countries[randomNumber] && 
            countries[randomNumber].name && 
            randomCountry && 
            !usedCountries.includes(randomCountry)) {
            usedCountries.push(randomCountry);
            displayQuestion(randomCountry);
            return randomCountry;
        } else {
            return getRandomCountry();
        }
    }

    const getCountryFlag = () => {
        return countries[randomNumber].flags.png;
    }

    const displayQuestion = (country) => {
        const questionHeading = document.getElementById('country');
        questionHeading.innerText = `What is the capital of ${country}?`;

        const flagImg = document.getElementById('flagImg');
        const flag = getCountryFlag();
        flagImg.src = flag;
        flagImg.alt = countries[randomNumber].flags.alt;
    }

    const getCountryCapital = () => {
        if (countries[randomNumber].name && 
            countries[randomNumber].name.common && 
            countries[randomNumber] && 
            countries[randomNumber].capital) {
            capital = countries[randomNumber].capital;
            return capital;
        } else {
            getRandomCountry();
            return getCountryCapital();
        }
    }

    const getRandomCapitals = () => {
        const randomIndexTwo = Math.floor(Math.random()* countries.length);
        const randomIndexThree = Math.floor(Math.random()* countries.length);

        if (!countries[randomIndexTwo].capital || !countries[randomIndexThree].capital || countries[randomIndexTwo].capital === capital || countries[randomIndexThree].capital === capital) {
            return getRandomCapitals();
        }
        const capitalTwo = countries[randomIndexTwo].capital;
        const capitalThree = countries[randomIndexThree].capital;
        return [capitalTwo, capitalThree];
    }

    let alternativeOne;
    let alternativeTwo;
    let alternativeThree;

    const placeCapitalsRandomly = (capital) => {
        capital = getCountryCapital();
        let randomIndex = Math.floor(Math.random()*3);
        
        switch(randomIndex) {
            case 0:
                alternativeOne = capital;
                alternativeTwo = getRandomCapitals()[0];
                alternativeThree = getRandomCapitals()[1];
                break;
            case 1:
                alternativeOne = getRandomCapitals()[1];
                alternativeTwo = capital;
                alternativeThree = getRandomCapitals()[0];
                break;
            case 2: 
                alternativeOne = getRandomCapitals()[0];
                alternativeTwo = getRandomCapitals()[1];
                alternativeThree = capital;
                break;
        }
    }

    const buttonOne = document.getElementById('firstAlternative');
    const buttonTwo = document.getElementById('secondAlternative');
    const buttonThree = document.getElementById('thirdAlternative');

    const showCapitalOptions = () => {
        buttonOne.innerText = alternativeOne;
        buttonTwo.innerText = alternativeTwo;
        buttonThree.innerText = alternativeThree;
    }

    let guessCount = 1;

    buttonOne.addEventListener('click', () => {
        guessCount++;
        checkAnswer(alternativeOne, capital);
    });
    buttonTwo.addEventListener('click', () => {
        guessCount++;
        checkAnswer(alternativeTwo, capital);
    });
    buttonThree.addEventListener('click', () => {
        guessCount++;
        checkAnswer(alternativeThree, capital);
    });
    
    let score = 0;
    const resultParagraph = document.getElementById('score');
    const roundParagraph = document.getElementById('round');

    const showGameStats = () => {
        roundParagraph.innerText = `Round: ${guessCount}`;
        resultParagraph.innerText = `Score: ${score}`;
    }

    const roundResultParagraph = document.getElementById('roundResult');

    const checkAnswer = (buttonClicked, capital) => {
        if (buttonClicked === capital) {
            score++;
            roundResultParagraph.innerText = "Correct!";
        } else {
            roundResultParagraph.innerText = `Wrong! The correct answer was ${capital}.`;
        }
        if(guessCount === 10) {
            endGame();
        } else {
            newRound();
        }
    }

    const restart = () => {
        const restartButton = document.getElementById('restart');
        restartButton.addEventListener('click', () => {
            score = 0;
            guessCount = 0;
            roundResultParagraph.innerText = '';
            usedCountries = [];
            showGameStats();
            newRound();
        });
    }

    const newRound = () => {
        getRandomCountry();
        getCountryCapital();
        getCountryFlag();
        getRandomCapitals();
        placeCapitalsRandomly(capital);
        showCapitalOptions();
        showGameStats();
    }

    const questionDiv = document.getElementById('question');
    const resultHeading = document.getElementById('resultHeading');
    const playAgainButton = document.getElementById('play-again');

    const alternativeButtons = [buttonOne, buttonTwo, buttonThree];

    const playAgain = () => {
        playAgainButton.style.display = 'block';
        resultHeading.style.display = 'block';
        questionDiv.style.display = 'none';
        
        playAgainButton.addEventListener('click', function() {
            questionDiv.style.display = 'block';
            roundResultParagraph.innerText = '';
            playAgainButton.style.display = 'none';
            resultHeading.style.display = 'none';

            score = 0;
            guessCount = 0;
            usedCountries = [];

            for (index in alternativeButtons) {
                alternativeButtons[index].disabled = false;
            }

            newRound();
        });
    }

    const endGame = () => {
        for (button in alternativeButtons) {
            alternativeButtons[button].disabled = true;
        }

        if (score === 10) {
            resultHeading.innerText = `You are a star! You got 10 out of 10.`;
        } else if (score > 5) {
            resultHeading.innerText = `You got ${score} out of 10. Good job!`;
        } else {
            resultHeading.innerText = `You got ${score} out of 10. Better luck next time.`;
        }

       playAgain();
    }

    const initializeGame = () => {
        let capital;
        showGameStats();
        getRandomCountry();
        getCountryCapital();
        getRandomCapitals()
        placeCapitalsRandomly(capital);
        showCapitalOptions();
        restart();
        playAgainButton.style.display = 'none';
    }
    initializeGame();
})();


    




