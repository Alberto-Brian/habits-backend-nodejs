"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const listing = [];
exports.default = (list, limit = 3) => {
    for (let i = 0; i < limit; i++) {
        listing.push(list[i]);
    }
    return listing;
};
