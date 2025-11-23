import { Room } from "./room";

export interface Page<T> {
    page: number;
    size: number;
    totalElements?: number;
    totalPage?: number;
    content: T[];
    first: boolean;
    last: boolean;
}
