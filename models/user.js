"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../user");
class UserModel {
    constructor(db) {
        this.db = db;
    }
    fetchByCredentials(username, password) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT id, username, password FROM Users where username = ? AND password = ?', [username, password], (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (row) {
                        resolve(new user_1.User(row.id, row.username, row.password));
                    }
                    else {
                        reject();
                    }
                }
            });
        });
    }
    fetchOne(id) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT id, username, password FROM Users WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(new user_1.User(row.id, row.username, row.password));
                }
            });
        });
    }
    fetchAll() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT id, username FROM Users', (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const users = rows.map((row) => new user_1.User(row.id, row.username));
                    resolve(users);
                }
            });
        });
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=user.js.map