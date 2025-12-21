import db from '../config/db.js';

class Search {

  static searchQuery(query){
    const SQLQuery = 'SELECT name, user_id FROM User WHERE name LIKE ?';
    return db.promise().query(SQLQuery, [`%${query}%`]).then(([rows]) => rows);
  }
}

export default Search;
