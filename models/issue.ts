import { Database } from 'sqlite3';
import { Issue } from '../issue';
import { User } from '../user';
import { UserModel } from './user';

export class IssueModel {

    constructor(private db: Database) {}

    fetchOne(id: number): Promise<Issue> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id,
                            title,
                            description,
                            status,
                            created,
                            creator,
                            assignee FROM issues WHERE id = ?`;
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    const userModel = new UserModel(this.db);
                    Promise.all([
                        userModel.fetchOne(row['creator']),
                        userModel.fetchOne(row['assignee'])
                    ]).then(([creator, assignee]) => {
                        resolve(new Issue(
                            row['id'],
                            row['title'],
                            row['description'],
                            row['status'],
                            new Date(row['created']),
                            creator,
                            assignee
                        ));
                    }, () => {
                        reject();
                    });
                }
            });
        });
    }

    fetchAll(): Promise<Array<Issue>> {
        const sql = `SELECT
            issues.id,
            title
            description,
            status,
            created,
            creator.id as creatorId,
            creator.username as creatorName,
            assignee.id as assigneeId,
            assignee.username as assigneeName
        FROM issues
        LEFT JOIN users as creator ON issues.creator = creator.id
        LEFT JOIN users as assignee ON issues.assignee = assignee.id`;
        return new Promise((resolve, reject) => {
            this.db.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const issues = rows.map((row) => {
                        const creator = new User(row.creatorId, row.creatorName);
                        const assignee = new User(row.assigneeId, row.assigneeName);
                        return new Issue(
                            row.id,
                            row.titlte,
                            row.description,
                            row.status,
                            row.created,
                            creator,
                            assignee
                        )
                    });
                    resolve(issues);
                }
            })
        });
    }

    save(issue: Issue): Issue {
        return new Promise((resolve, reject) => {
            let sql;
            let data;
            if (issue.id) {
// @todo update
            } else {
// @todo insert
            }
            this.db.run(sql, data, function (err, row) {
                if (err) {
                    reject(err);
                } else {
                    if (!issue.id) {
                        issue.id = this.rowId;
                    }
                    resolve(issue);
                }
            });
        });
    }

    remove(id: number): Promise<boolean> {
        const sql = 'DELETE FROM issues WHERE ID = ?';
        return new Promise((resolve, reject) => {
            this.db.run(sql, [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        }); 
    }

}