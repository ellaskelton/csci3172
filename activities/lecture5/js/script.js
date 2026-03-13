
const magic8BallAnswers = [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    "Reply hazy, try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful"
];

const fortuneCookieSayings = [
    "Do not be afraid of competition.",
    "An exciting opportunity lies ahead of you.",
    "You love peace.",
    "Get your mind set…confidence will lead you on.",
    "You will always be surrounded by true friends.",
    "Sell your ideas-they have exceptional merit.",
    "You should be able to undertake and complete anything.",
    "You are kind and friendly.",
    "You are wise beyond your years.",
    "Your ability to juggle many tasks will take you far.",
    "A routine task will turn into an enchanting adventure.",
    "Beware of all enterprises that require new clothes.",
    "Be true to your work, your word, and your friend.",
    "Goodness is the only investment that never fails.",
    "A journey of a thousand miles begins with a single step.",
    "Forget injuries; never forget kindnesses.",
    "Respect yourself and others will respect you.",
    "A man cannot be comfortable without his own approval.",
    "Always do right. This will gratify some people and astonish the rest.",
    "It is easier to stay out than to get out.",
    "Sing everyday and chase the mean blues away.",
    "You will receive money from an unexpected source.",
    "Attitude is a little thing that makes a big difference.",
    "Plan for many pleasures ahead.",
    "Experience is the best teacher.",
    "You will be happy with your spouse.",
    "Expect the unexpected.",
    "Stay healthy. Walk a mile.",
    "The family that plays together stays together."
];


function getUserQuestion() {
    const questionInput = document.getElementById('userQuestion');
    const question = questionInput.value.trim();
    
    if (question === '') {
        return null;
    }
    
    return question;
}


function getAnswer() {
    const listChoice = Math.floor(Math.random() * 2);
    
    let selectedAnswer;
    let answerSource;
    
    if (listChoice === 0) {
        const randomIndex = Math.floor(Math.random() * magic8BallAnswers.length);
        selectedAnswer = magic8BallAnswers[randomIndex];
        answerSource = "Magic 8-Ball";
    } else {
        const randomIndex = Math.floor(Math.random() * fortuneCookieSayings.length);
        selectedAnswer = fortuneCookieSayings[randomIndex];
        answerSource = "Fortune Cookie";
    }
    
    console.log(`Answer source: ${answerSource}`);
    console.log(`Selected answer: ${selectedAnswer}`);
    
    return {
        answer: selectedAnswer,
        source: answerSource
    };
}

function askQuestion() {
    const question = getUserQuestion();
    
    if (question === null) {
        alert('Please enter a question!');
        return;
    }
    
    const result = getAnswer();
    const answerElement = document.getElementById('answer');
    
    answerElement.textContent = result.answer;
    
    console.log(`Question: ${question}`);
    console.log(`Answer: ${result.answer} (from ${result.source})`);
    
    document.getElementById('userQuestion').value = '';
}