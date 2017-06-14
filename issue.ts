import { User } from './user';

export enum Status {open, inProgress, done};

export class Issue {
    constructor(
        public id?: number,
        public titlte?: string,
        public description?: string,
        public status?: Status,
        public created?: Date,
        public creator?: User,
        public assignee?: User) {}
}