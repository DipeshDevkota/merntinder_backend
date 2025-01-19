const toxicity = require("@tensorflow-models/toxicity");

// Load the toxicity model with a threshold (e.g., 0.9 for high confidence)
const loadToxicityModel = async () => {
  console.log("Toxicity is",toxicity)
  const threshold = 0.9;
  const model = await toxicity.load(threshold);
  console.log("Model is:",model)
  return model;
};

// Function to check for offensive messages using TensorFlow
const checkToxicity = async (message, model) => {
  const predictions = await model.classify([message]);
  console.log("Prediction  is:",predictions)
  
  const toxic = predictions.some(prediction => {
    // Check if any category has results that exceed the threshold

    return prediction.results[0].match === true;
  });
  console.log("Toxic  is:",toxic)

  return toxic;

};

module.exports = { loadToxicityModel, checkToxicity };
