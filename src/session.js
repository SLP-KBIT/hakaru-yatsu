import sprintf from 'sprintf';

var list = []

export default class Session {
  constructor () {
    var random
    do {
      random = sprintf('%04d', Math.floor(Math.random() * 10000 - 1));
    } while ( list.indexOf(random) >= 0 );

    this._id = random;
    list.push(random);
  }

  get id() {
    return this._id;
  }

  static list() {
    return list;
  }

  static isExist(id) {
    return list.indexOf(id) >= 0;
  }
}
