import * as SQLite from "expo-sqlite";

db = SQLite.openDatabase("little_lemon");

const createTable = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists menu (id integer primary key not null, category text, name text, price text, description text, image text);"
        );
      },
      reject,
      resolve
    );
  });
};

const dropTable = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("drop table menu");
      },
      reject,
      resolve
    );
  });
};

const getMenuItems = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //   tx.executeSql("SHOW TABLES", [], (_, results) => {
      //     console.log("Showing tables:");
      //     console.log(results.rows);
      //   });
      tx.executeSql("select * from menu", [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
};

const saveMenuItems = async (items) => {
  //   console.log(items);
  const sqlStatement = items
    .map((obj) => {
      const record = `("${obj.category}","${obj.name}","${obj.price}","${obj.description}","${obj.image}")`;
      //   console.log(sqlString);
      return record;
    })
    .join(", ");
  //   console.log("-- Executing below sql statement:");
  //   console.log(
  //     "insert into menu (category, name, price, description, image) values " +
  //       sqlStatement
  //   );
  db.transaction((tx) => {
    tx.executeSql(
      "insert into menu (category, name, price, description, image) values " +
        sqlStatement
    );
  });
};

const queryBySearchAndCategory = async (search, categories) => {
  return new Promise((resolve, reject) => {
    let sqlStatement =
      "select category, name, price, description, image from menu where category in (" +
      "'" +
      categories.join("', '") +
      "'" +
      ")" +
      "and name like " +
      "'%" +
      search +
      "%'";
    db.transaction((tx) => {
      tx.executeSql(sqlStatement, [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
};

const databaseExists = (callback) => {
  //   console.log("CHECKING DATABASE");
  db.transaction((tx) => {
    // tx.executeSql("drop table menu");
    //   `create table if not exists menu (id primary key not null, name text);`
    //   "drop table menu"
    //   ();
    // tx.executeSql(
    //   `create table if not exists menu (id primary key not null, name text);`
    // );
    tx.executeSql(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='menu'`,
      [],
      (_, { rows }) => {
        console.log("'Menu' table exists:", typeof rows.length, rows.length);
        callback(rows.length);
      }
    );
  });
};

const addMenuItems = (items) => {
  //   console.log(items);
  const sqlStatement = items
    .map((obj) => {
      const record = `('${obj.category}','${obj.name}','${obj.price}','${obj.description}','${obj.image}')`;
      //   console.log(sqlString);
      return record;
    })
    .join(", ");
  console.log("-- Creating menu table:");
  console.log(
    "insert into menu (category, name, price, description, image) values " +
      sqlStatement
  );

  db.transaction((tx) => {
    tx.executeSql(
      `create table if not exists menu (id primary key, category text, name text, description text, image text);`
    );

    tx.executeSql(
      "insert into menu (category, name, price, description, image) values " +
        sqlStatement
    );

    tx.executeSql(`SELECT * FROM menu `, [], (_, { rows }) => {
      //   console.log("'Menu' table exists:", typeof rows.length, rows.length);
      console.log(rows);
    });
  });
};

const displayMenuItems = () => {
  db.transaction((tx) => {
    tx.executeSql(`SELECT * FROM menu`, [], (_, { rows }) => {
      console.log(rows);
    });
    tx.executeSql(`PRAGMA table_info(menu)`, [], (_, { resp }) => {
      console.log(resp);
    });
  });
};

export {
  databaseExists,
  addMenuItems,
  displayMenuItems,
  createTable,
  getMenuItems,
  saveMenuItems,
  dropTable,
  queryBySearchAndCategory,
};
