import sprintf from 'sprintf';
import _ from 'lodash';

var list = []

export default class Session {
  constructor () {
    var random
    do {
      random = sprintf('%04d', Math.floor(Math.random() * 10000 - 1));
    } while ( list.indexOf(random) >= 0 );

    this._id = random;
    this._users = {};
    list.push(this);
  }

  get id() {
    return this._id;
  }

  get users() {
    return _.values(this._users);
  }

  join(socket_id, name) {
    this._users[socket_id] = {name: name};
  }

  remove(socket_id) {
    delete this._users[socket_id];
  }

  find_user(socket_id) {
    return this._users[socket_id];
  }

  static list() {
    return list;
  }

  static isExist(id) {
    console.log(this.find(id));
    return this.find(id) != null;
  }

  static find(id) {
    var data = null

    _.each(list, (session) => {
      console.log(session.id)
      if ( session.id == id ) {
        data = session;
        return false;
      }
    });

    return data;
  }
}
