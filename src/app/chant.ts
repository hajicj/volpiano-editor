// Contains the Chant class that wraps together the Volpiano and fulltext.

import {Volpiano, VolpianoError} from './volpiano';

export class ChantData {
  public volpiano: Volpiano;
  public text: string;

  // Accessing text:
  public readonly TEXT_WORD_SEPARATOR = ' ';
  public readonly TEXT_SYLLABLE_SEPARATOR = '-';
  get textWords(): Array<string> {
    if (this.text.length < 1) { return []; }
    return this.text.split(this.TEXT_WORD_SEPARATOR);
  }
  get textSyllables(): Array<string> {
    let textSyllables: Array<string> = [];
    for (const w of this.textWords) {
      if (w.length === 0) { continue; }
      textSyllables.push(...w.split(this.TEXT_SYLLABLE_SEPARATOR));
    }
    return textSyllables;
  }
  get isTextEmpty(): boolean { return (this.text.length > 0); }
  get isTextSyllabized(): boolean { return ChantData.isTextSyllabized(this.text); }

  static TEXT_SYLLABLE_SEPARATOR = '-';
  static isTextSyllabized(text: string) { return (text.indexOf(ChantData.TEXT_SYLLABLE_SEPARATOR) >- 0); }

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

  buildChantWordsAndSyllables(
    strictSyllabization: boolean = false):
    Array<Array<(Volpiano | string)>>
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
    const volpianoWords = this.volpiano.allWords();
    if (volpianoWords.length < 1) { return []; }
    // Builds the data structure of words and syllables for rendering.

    const textWords = this.textWords;

    let cWords: Array<Array<[string, string]>> = [];

    let tIdx = 0;
    for (let vIdx = 0; vIdx < volpianoWords.length; vIdx++) {
      const vWord = volpianoWords[vIdx];
      let tWord = "";
      if (Volpiano.shouldHaveTextWord(vWord)) {
        tWord = textWords[tIdx];
        tIdx++;
      }
      const cWord = [new Volpiano(vWord), tWord];

      // Syllabization
      if (ChantData.isTextSyllabized(tWord)) {
        const tSyllables = tWord.split('-');
        const vSyllables = vWord.split(Volpiano.VOLPIANO_SYLLABLE_SEPARATOR);
        if (strictSyllabization && (tSyllables.length !== vSyllables.length)) {
          throw new VolpianoError('Strict syllabization impossible for word no. ' + tIdx + '/' + vIdx + ':\n' +
           'tSyllables=' + tSyllables.toString() + ' vSyllables=' + vSyllables.toString());
        }
        // There can be a mismatch: more volpiano syls. vs more text syls, either way.
        // When we run out of volpiano, we ignore all remaining text syllables. When we run out of text, we add empty text to volpiano.
      }

      // No syllabization

      cWords.push(cWord);
    }

    return cWords;
  }

}
