// This file contains various volpiano syntax and semantics functionality.
// Conforms to the Cantus network Volpiano encoding standards.



export class VolpianoError extends Error {}

export class Volpiano {

  // Static members and methods: syntax, validation
  public static readonly VOLPIANO_CHARS = '-abcdefghijklmnopqrsABCDEFGHIJKLMNOPQRS1234567.,()[]{?'.split('');
  public static readonly VOLPIANO_CHARSET = new Set('-abcdefghijklmnopqrsABCDEFGHIJKLMNOPQRS1234567.,()[]{?'.split(''));
  public static readonly BASIC_NOTE_CHARS: Array<string> = 'abcdefghjklmnopqrs'.split('');

  // private static readonly _containsOnlyVolpianoAlphabet: RegExp = new RegExp(Volpiano.VOLPIANO_CHARS.join("|"));
  private static readonly _hasBaseNoteRegex: RegExp = new RegExp(Volpiano.BASIC_NOTE_CHARS.join("|"));

  public static readonly VOLPIANO_WORD_SEPARATOR = '---';
  public static readonly VOLPIANO_SYLLABLE_SEPARATOR = '--';

  // Instance data
  private _volpianoString: string = '';
  get volpianoString(): string {
    return this._volpianoString;
  }
  set volpianoString(value: string) {
    if (!Volpiano.isValidVolpiano(value)) {
      throw new VolpianoError('Invalid volpiano input: ' + value);
    }
    console.log('Setting volpiano string value: ' + value);
    this._volpianoString = value;
  }


  constructor(rawString: string) {
    this.volpianoString = rawString;
  }

  static isValidVolpiano(str: string): boolean {
    // This function validates merely whether the given string is a sequence
    // that Volpiano expects to render. It does NOT check for conformity to
    // Cantus guidelines. It is intended to mark as valid also Volpiano fragments.
    return Volpiano.isAlphabetVolpiano(str);
    // return true;
  }

  allWords(): Array<string> {
    if (this.volpianoString === "") { return []; }
    const vWords = this.volpianoString.split(Volpiano.VOLPIANO_WORD_SEPARATOR);
    if (vWords[vWords.length - 1].length <= 0) {
      return vWords.slice(0, -1);
    } else {
      return vWords;
    }
  }

  musicWords(): Array<string> {
    // Returns a list of volpiano substrings corresponding to words set to music.
    // Examples:
    //   >>> musicWords('c--d-h-k--h---h-j--k---h---hg--h')
    //   >>> ['c--d-h-k--h', 'h-j--k', 'h', 'hg--h']
    //
    //   >>> musicWords('1---c--d-h-k--h---7---h-j--k---h---hg--h---3')
    //   >>> ['c--d-h-k--h', 'h-j--k', 'h', 'hg--h']
    if (this.volpianoString === "") { return []; }
    const words = this.volpianoString.split(Volpiano.VOLPIANO_WORD_SEPARATOR);
    const musicWords = words.filter(w => Volpiano.containsMusic(w));
    // console.log('volpiano.musicWords(): musicWords:');
    // console.log(musicWords);
    return musicWords;
  }

  musicSyllables(): Array<string> {
    // Returns a list of volpiano substrings corresponding to syllables set to music.
    if (this.volpianoString === "") {
      return [];
    }
    const musicWords = this.musicWords();
    let syllables: Array<string> = [];
    for (const w of musicWords) {
      const ws = w.split(Volpiano.VOLPIANO_SYLLABLE_SEPARATOR).filter(s => Volpiano.containsMusic(s));
      syllables.push(...ws);
    }
    return syllables;
  }

  static splitIntoWords(vol: string): Array<string> {
    return vol.split(Volpiano.VOLPIANO_WORD_SEPARATOR);
  }
  static splitIntoSyllables(vol: string): Array<string> {
    let syllables: Array<string> = [];
    if (vol.length === 0) { return syllables; }
    for (let w of Volpiano.splitIntoWords(vol)) {
      if (w.length === 0) { continue; }
      // this might not work when the separator is at the end of string.
      syllables.push(...w.split(Volpiano.VOLPIANO_SYLLABLE_SEPARATOR))
    }
    return syllables;
  }

  static containsMusic(vol: string) {
    return Volpiano._hasBaseNoteRegex.test(vol);
  }

  static shouldHaveTextWord(vWord: string) {
    // Check if the given fragment of Volpiano, which is assumed to be a volpiano word
    // (i.e. not a sub-word unit), is expected to be underlaid with a text word.
    // This is not necessarily the same as containing music -- in some cases, perhaps
    // a word that does contain music will not have text underlay. For now, however,
    // we just check whether the given vWord contains some music (base notes).
    return Volpiano.containsMusic(vWord);
  }
  static shouldHaveTextSyllable(vSyl: string) {
    return Volpiano.containsMusic(vSyl);
  }

  static isAlphabetVolpiano(str: string) {
    // Check if given string is composed only from characters that belong
    // to the Volpiano alphabet. Empty string passes.
    if (str === "") { return true; }

    // If any one of the input string letters are not in alphabet, return false.
    const letters = new Set(str.split(''));
    for (const l of letters) {
      if (!Volpiano.VOLPIANO_CHARSET.has(l)) {
        return false;
      }
    }
    return true;
  }

}
