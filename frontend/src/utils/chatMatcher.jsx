export const getBestMatchingResponse = (message, chatData) => {
  const normalizedMsg = message.toLowerCase();

  let bestMatch = null;
  let maxMatchedKeywords = 0;

  for (const item of chatData) {
    const keywords = item.keywords.map((k) => k.toLowerCase());
    const matchedCount = keywords.filter((k) => normalizedMsg.includes(k)).length;

    if (matchedCount > maxMatchedKeywords) {
      bestMatch = item;
      maxMatchedKeywords = matchedCount;
    }
  }

  if (bestMatch && maxMatchedKeywords > 0) {
    return bestMatch.response;
  }

  return "🤖 Sorry, I didn't understand. Can you rephrase?";
};
