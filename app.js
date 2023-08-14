const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');

const API_URL = 'https://opentdb.com/api.php?amount=10&category=9&type=boolean';
let correctAnswers = [];


app.get('/', (req, res) => {
    res.render('index');
  });

app.get('/quiz', (req, res) => {
  axios.get(API_URL)
    .then(response => {
      const questions = response.data.results;
      correctAnswers = questions.map(question => question.correct_answer === 'True');
      res.render('quiz', { questions });
    })
    .catch(error => {
      console.error('Error fetching questions:', error);
      res.status(500).send('Error fetching questions');
    });
});

app.post('/submit', express.urlencoded({ extended: true }), (req, res) => {
    const userAnswers = Object.values(req.body.answers).map(answer => answer === 'true');
    const score = calculateScore(userAnswers);
  
    res.render('score', { score });
  });

function calculateScore(userAnswers) {
  let score = 0;
  for (let i = 0; i < userAnswers.length; i++) {
    if (userAnswers[i] === correctAnswers[i]) {
      score++;
    }
  }
  return score;
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

