// Contains the Chant class that wraps together the Volpiano and fulltext.

import {Volpiano, VolpianoError} from './volpiano';

export class ChantData {
  public volpiano: Volpiano;
  public text: string;

  // Processing text:
  static readonly TEXT_EMPTY_WORD = '.';
  static readonly TEXT_EMPTY_SYLLABLE = '_';
  static readonly TEXT_WORD_SEPARATOR = ' ';
  static readonly TEXT_SYLLABLE_SEPARATOR = '-';
  static isTextSyllabized(text: string) { return (text.indexOf(ChantData.TEXT_SYLLABLE_SEPARATOR) >- 0); }
  static splitTextIntoWords(text: string): Array<string> {
    if (text.length < 1) { return []; }
    return text.split(ChantData.TEXT_WORD_SEPARATOR).filter(w => w.length > 0);
  }
  static splitTextIntoSyllables(text: string): Array<string> {
    let textSyllables: Array<string> = [];
    for (const w of ChantData.splitTextIntoWords(text)) {
      if (w.length === 0) { continue; }
      textSyllables.push(...ChantData.splitWordIntoSyllables(w));
    }
    return textSyllables;
  }
  static splitWordIntoSyllables(word: string): Array<string> {
    if (word.length === 0) { return []; }
    const syls = word.split(ChantData.TEXT_SYLLABLE_SEPARATOR);
    if (syls[syls.length - 1] === "") {
      return syls.slice(0, -1)
    } else {
      return syls;
    }
  }

  get textWords(): Array<string> {
    if (this.text.length < 1) { return []; }
    return this.text.split(ChantData.TEXT_WORD_SEPARATOR);
  }
  get textSyllables(): Array<string> {
    return ChantData.splitTextIntoSyllables(this.text);
  }
  get isTextEmpty(): boolean { return (this.text.length > 0); }
  get isTextSyllabized(): boolean { return ChantData.isTextSyllabized(this.text); }


  constructor(volpiano: Volpiano, text: string) {
    this.volpiano = volpiano;
    this.text = text;
  }

  get wordCountMatches(): boolean {
    const nTextWords = this.textWords.length;
    const nMusicWords = this.volpiano.musicWords().length;
    return (nTextWords === nMusicWords)
  }

  get syllableCountMatches(): boolean {
    const nTextSyllables = this.textSyllables.length;
    const nMusicSyllables = this.volpiano.musicSyllables().length;
    return (nTextSyllables === nMusicSyllables);
  }

  static alignVolpianoAndTextWords(volpiano: Volpiano, text: string):
    Array<[Volpiano, string]>
  {
    const vWords = volpiano.allWords();
    const tWords = ChantData.splitTextIntoWords(text);

    let cWords: Array<[Volpiano, string]> = [];
    let tIdx = 0;
    for (let vIdx = 0; vIdx < vWords.length; vIdx++) {
      const vWord = vWords[vIdx];
      let tWord = ChantData.TEXT_EMPTY_WORD;
      if (Volpiano.shouldHaveTextWord(vWord)) {
        if (tIdx >= tWords.length) {
          tWord = ChantData.TEXT_EMPTY_WORD;
        } else {
          tWord = tWords[tIdx];
          tIdx++; // Only increment text index if reading to next word!
        }
      }
      const cWord: [Volpiano, string] = [new Volpiano(vWord), tWord];
      cWords.push(cWord);
    }

    return cWords;
  }

  get alignedWords(): Array<[Volpiano, string]> {
    return ChantData.alignVolpianoAndTextWords(this.volpiano, this.text);
  }


  static alignVolpianoAndTextWordsAndSyllables(
    volpiano: Volpiano, text: string,
    strictSyllabization: boolean = false):
    Array<Array<[Volpiano, string]>>
  {
    // Take the chant data and build Chant Word and Chant Syllable hierarchy.
    // The core effort is to align volpiano and text words/syllables. This is
    // non-trivial because some Volpiano segments should not have text underlay.
    //
    // If the text is not syllabized, each text word is assigned to the first
    // syllable of the corresponding volpiano word.
    //
    // If strictSyllabization is set to True, then syllable counts MUST match,
    // otherwise a VolpianoError is thrown. If false and syllable counts do not match,
    // then:
    //  - if more volpiano than text, remaining volpiano syllables get empty text.
    //  - if more text than volpiano, ignore volpiano.
    //
    // Note that this last behavior is sketchy -- we might want to shift *all* of the
    // syllables right... Maybe this whole thing should run over syllable sequences,
    // not hierarchy.
    const volpianoWords = volpiano.allWords();
    if (volpianoWords.length < 1) { return []; }
    // Builds the data structure of words and syllables for rendering.

    const textWords = ChantData.splitTextIntoWords(text);

    let cWordsAndSyllables: Array<Array<[Volpiano, string]>> = [];

    let tIdx = 0;
    for (let vIdx = 0; vIdx < volpianoWords.length; vIdx++) {
      const vWord = volpianoWords[vIdx];

      if (!Volpiano.shouldHaveTextWord(vWord) || (tIdx >= textWords.length)) {
        // If the volpiano word should have no text,
        // or if we ran out of text words:
        // split it into syllables and assign empty syllable text
        // to each. Most likely, text-less volpiano words will be
        // single-syllable entities like barlines.
        const vSyls = Volpiano.splitIntoSyllables(vWord);
        const cWord: Array<[Volpiano, string]> = vSyls.map(vS => [new Volpiano(vS), ChantData.TEXT_EMPTY_SYLLABLE]);
        cWordsAndSyllables.push(cWord);
        continue;
      }

      // The situation when we are actually aligning real text syllables
      const tWord = textWords[tIdx];
      tIdx++;

      // This can still be an empty word. In that case, we fill it with empty syllables.
      if (tWord === "") {
        const cWord: Array<[Volpiano, string]> = Volpiano.splitIntoSyllables(vWord).map(vS => [new Volpiano(vS), ChantData.TEXT_EMPTY_SYLLABLE])
        cWordsAndSyllables.push(cWord);
        continue;
      }

      const cWord: Array<[Volpiano, string]> = [];

      // Syllabization
      if (ChantData.isTextSyllabized(tWord)) {
        const tSyllables = ChantData.splitTextIntoSyllables(tWord);
        const vSyllables = Volpiano.splitIntoSyllables(vWord);
        if (strictSyllabization && (tSyllables.length !== vSyllables.length)) {
          throw new VolpianoError('Strict syllabization impossible for word no. ' + tIdx + '/' + vIdx + ':\n' +
           'tSyllables=' + tSyllables.toString() + ' vSyllables=' + vSyllables.toString());
        }
        // There can be a mismatch: more volpiano syls. vs more text syls, either way.
        // When we run out of volpiano, we ignore all remaining text syllables.
        // When we run out of text, we add empty text to volpiano.
        let tsIdx = 0;
        for (let vsIdx = 0; vsIdx < vSyllables.length; vsIdx ++) {
          const vSyl = vSyllables[vsIdx];
          if (!Volpiano.shouldHaveTextSyllable(vSyl) || (tsIdx >= tSyllables.length)) {
            const cSyl: [Volpiano, string] = [new Volpiano(vSyl), ChantData.TEXT_EMPTY_SYLLABLE];
            cWord.push(cSyl);
            continue;
          }

          // In this situation we are supposed to read a syllable.
          const tSyl = tSyllables[tsIdx];
          tsIdx++;

          // tSyl can still be empty
          if (tSyl === "") {
            const cSyl: [Volpiano, string] = [new Volpiano(vSyl), ChantData.TEXT_EMPTY_SYLLABLE];
            cWord.push(cSyl);
            continue;
          }

          // The "regular" case:
          const cSyl: [Volpiano, string] = [new Volpiano(vSyl), tSyl]
          cWord.push(cSyl);
        }

        // End of syllabization-based alignment building.

      } else {
        // No syllabization: just assign text word to first syllable.
        const vSyllables = Volpiano.splitIntoSyllables(vWord);
        const firstVSyl = vSyllables[0];
        const firstSyl: [Volpiano, string] = [new Volpiano(firstVSyl), tWord];
        cWord.push(firstSyl);
        // All other syllables are assigned the empty syllable text.
        if (vSyllables.length > 1) {
          for (const vSyl of vSyllables.slice(1)) {
            cWord.push([new Volpiano(vSyl), ChantData.TEXT_EMPTY_SYLLABLE])
          }
        }
      }

      cWordsAndSyllables.push(cWord);
    }

    return cWordsAndSyllables;
  }
  get alignedWordsAndSyllables() {
    return ChantData.alignVolpianoAndTextWordsAndSyllables(
      this.volpiano,
      this.text,
      false);
  }

}
