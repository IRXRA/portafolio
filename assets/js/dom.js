// @ts-check
/** @template {Element} T @param {string} selector @param {ParentNode} [root] @returns {T|null} */
export function query(selector, root = document) { return /** @type {T|null} */ (root.querySelector(selector)); }
/** @template {Element} T @param {string} selector @param {ParentNode} [root] @returns {T[]} */
export function queryAll(selector, root = document) { return /** @type {T[]} */ ([...root.querySelectorAll(selector)]); }
