export const chunkText = (text, chunkSize = 500, overlap = 50) => {
  if (!text || text.trim().length === 0) return [];

  // Clean text while preserving paragraph structure
  const cleanedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();

  // Split into paragraphs
  const paragraphs = cleanedText.split(/\n+/).filter(p => p.trim().length > 0);

  const chunks = [];
  let currentChunk = [];
  let currentWordCount = 0;
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    const words = paragraph.trim().split(/\s+/);
    const paragraphWordCount = words.length;

    // If paragraph is larger than chunkSize, split it into multiple chunks
    if (paragraphWordCount > chunkSize) {
      if (currentChunk.length > 0) {
        chunks.push({
          content: currentChunk.join('\n\n'),
          chunkIndex: chunkIndex++,
          pageNumber: 0
        });
        currentChunk = [];
        currentWordCount = 0;
      }

      for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
        const chunkWords = words.slice(i, i + chunkSize);
        chunks.push({
          content: chunkWords.join(' '),
          chunkIndex: chunkIndex++,
          pageNumber: 0
        });
      }
      continue;
    }

    // If adding this paragraph exceeds chunk size, push current chunk
    if (currentWordCount + paragraphWordCount > chunkSize && currentChunk.length > 0) {
      const prevWords = currentChunk.join(' ').split(/\s+/);
      const overlapText = prevWords.slice(-Math.min(overlap, prevWords.length)).join(' ');

      chunks.push({
        content: currentChunk.join('\n\n'),
        chunkIndex: chunkIndex++,
        pageNumber: 0
      });

      currentChunk = [overlapText, paragraph];
      currentWordCount = overlapText.split(/\s+/).length + paragraphWordCount;
    } else {
      // Add paragraph to current chunk
      currentChunk.push(paragraph);
      currentWordCount += paragraphWordCount;
    }
  }

  // Add the last chunk
  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join('\n\n'),
      chunkIndex: chunkIndex++,
      pageNumber: 0
    });
  }

  return chunks;
};

export const findRelevantChunks = (chunks, query, maxChunks = 3) => {
  if (!chunks || chunks.length === 0 || !query) return [];

  const stopWords = new Set([
    'the','is','at','which','on','a','an','and','or','but',
    'in','with','to','for','of','as','by','this','that','it'
  ]);

  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  if (queryWords.length === 0) {
    return chunks.slice(0, maxChunks).map(chunk => ({
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id
    }));
  }

  const scoredChunks = chunks.map((chunk, index) => {
    const content = chunk.content.toLowerCase();
    const contentWords = content.split(/\s+/).length;
    let score = 0;

    for (const word of queryWords) {
      const exactMatches = (content.match(new RegExp('\\b' + word + '\\b', 'g')) || []).length;
      const partialMatches = (content.match(new RegExp(word, 'g')) || []).length;
      score += exactMatches * 3 + Math.max(0, partialMatches - exactMatches) * 1.5;
    }

    const uniqueWordsFound = queryWords.filter(word => content.includes(word)).length;
    if (uniqueWordsFound > 1) score += uniqueWordsFound * 2;

    const normalizedScore = score / Math.sqrt(contentWords);
    const positionBonus = 1 - (index / chunks.length) * 0.1;

    return {
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id,
      score: normalizedScore * positionBonus,
      rawScore: score,
      matchedWords: uniqueWordsFound
    };
  });

  return scoredChunks
    .filter(chunk => chunk.score > 0)
    .sort((a, b) => b.score !== a.score ? b.score - a.score : 
                      b.matchedWords !== a.matchedWords ? b.matchedWords - a.matchedWords : 
                      a.chunkIndex - b.chunkIndex)
    .slice(0, maxChunks);
};
