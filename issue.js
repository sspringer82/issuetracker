"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Status;
(function (Status) {
    Status[Status["open"] = 0] = "open";
    Status[Status["inProgress"] = 1] = "inProgress";
    Status[Status["done"] = 2] = "done";
})(Status = exports.Status || (exports.Status = {}));
;
class Issue {
    constructor(id, titlte, description, status, created, creator, assignee) {
        this.id = id;
        this.titlte = titlte;
        this.description = description;
        this.status = status;
        this.created = created;
        this.creator = creator;
        this.assignee = assignee;
    }
}
exports.Issue = Issue;
//# sourceMappingURL=issue.js.map