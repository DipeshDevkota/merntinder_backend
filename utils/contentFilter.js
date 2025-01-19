// utils/contentFilter.js

const offensiveWords = [
    "rough",
    "badword2",
    "offensive1",
    "offensive2",
    // Add more words as needed
  ];
  
  // Helper function to check for offensive words
  function containsOffensiveWords(message) {
    const lowerMessage = message.toLowerCase();
    return offensiveWords.some((word) => lowerMessage.includes(word));
  }
  
  // Helper function to censor offensive words
  function censorMessage(message) {
    let censoredMessage = message;
    offensiveWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      censoredMessage = censoredMessage.replace(regex, "***");
    });
    return censoredMessage;
  }
  
  module.exports = { containsOffensiveWords, censorMessage };
  