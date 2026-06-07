const express = require("express");
const cors = require("cors");
const Sentiment = require("sentiment");

const app = express();
const sentiment = new Sentiment();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.post("/analyze", (req, res) => {
  const { text } = req.body;

  const result = sentiment.analyze(text);

  let mood = "Neutral ";

  if (result.score > 0) {
    mood = "Positive ";
  } else if (result.score < 0) {
    mood = "Negative ";
  }

  const healthScore = Math.min(
  100,
  Math.max(0, 50 + result.score * 10)
);

// Green Flags and Red Flags
const redFlags = [];
const greenFlags = [];

const lowerText = text.toLowerCase();

if (
  lowerText.includes("hate") ||
  lowerText.includes("stupid") ||
  lowerText.includes("idiot")
) {
  redFlags.push("Toxic language detected");
}

if (
  lowerText.includes("thank you") ||
  lowerText.includes("thanks")
) {
  greenFlags.push("Gratitude expressed");
}

if (
  lowerText.includes("appreciate")
) {
  greenFlags.push("Appreciation shown");
}

res.json({
  mood,
  score: result.score,
  healthScore,
  positiveWords: result.positive,
  negativeWords: result.negative,
  redFlags,
  greenFlags,
});
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});