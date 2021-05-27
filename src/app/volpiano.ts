// This file contains various volpiano syntax and semantics functionality.
// Conforms to the Cantus network Volpiano encoding standards.

const BASIC_NOTE_CHARS: Array<string> = 'abcdefghjklmnopqrs'.split('');


export class VolpianoError extends Error {}

export class Volpiano {

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

  private readonly _hasBaseNoteRegex: RegExp = new RegExp(BASIC_NOTE_CHARS.join("|"));


  constructor(rawString: string) {
    this.volpianoString = rawString;
  }

  static isValidVolpiano(str: string): boolean {
    return true;
  }

  musicWords(): Array<string> {
    // Returns a list of volpiano substrings corresponding to words set to music.
    // Examples:
    //   >>> musicWords('c--d-h-k--h---h-j--k---h---hg--h')
    //   >>> ['c--d-h-k--h', 'h-j--k', 'h', 'hg--h']
    //
    //   >>> musicWords('1---c--d-h-k--h---7---h-j--k---h---hg--h---3')
    //   >>> ['c--d-h-k--h', 'h-j--k', 'h', 'hg--h']
    if (this.volpianoString === "") {
      return [];
    }
    const words = this.volpianoString.split('---');
    const musicWords = words.filter(w => this.containsMusic(w));
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
      const ws = w.split('--').filter(s => this.containsMusic(s));
      syllables.push(...ws);
    }
    return syllables;
  }

  containsMusic(vol: string) {
    return this._hasBaseNoteRegex.test(vol);
  }

}
