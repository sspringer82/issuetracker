import { Database } from 'sqlite3';
import { User } from '../user';

export class UserModel {

    constructor(private db: Database) {}

    fetchByCredentials(username: string, password: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.db.get('SELECT id, username, password FROM Users where username = ? AND password = ?', [username, password], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (row) {
                        resolve(new User(
                            row.id,
                            row.username,
                            row.password
                        ));
                    } else {
                        reject();
                    }
                }
            });
        });
    }

    fetchOne(id: number): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.db.get('SELECT id, username, password FROM Users WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new User(
                        row.id,
                        row.username,
                        row.password
                    ));
                }
            });
        });
    }

    fetchAll(): Promise<Array<User>> {
        return new Promise<Array<User>>((resolve, reject) => {
            this.db.all('SELECT id, username FROM Users', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const users = rows.map((row) => new User(row.id, row.username));
                    resolve(users);
                }
            })
        });
    }
}