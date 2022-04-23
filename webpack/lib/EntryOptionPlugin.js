/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const SingleEntryPlugin = require("./SingleEntryPlugin");
const MultiEntryPlugin = require("./MultiEntryPlugin");
const DynamicEntryPlugin = require("./DynamicEntryPlugin");

/** @typedef {import("../declarations/WebpackOptions").EntryItem} EntryItem */
/** @typedef {import("./Compiler")} Compiler */

/**
 * @param {string} context context path
 * @param {EntryItem} item entry array or single path
 * @param {string} name entry key name
 * @returns {SingleEntryPlugin | MultiEntryPlugin} returns either a single or multi entry plugin
 */
const itemToPlugin = (context, item, name) => {
	if (Array.isArray(item)) {
		return new MultiEntryPlugin(context, item, name);
	}
	return new SingleEntryPlugin(context, item, name);
};

module.exports = class EntryOptionPlugin {
	/**
	 * @param {Compiler} compiler the compiler instance one is tapping into
	 * @returns {void}
	 */
	apply(compiler) {
		// 监听了 entryOption 事件
		compiler.hooks.entryOption.tap("EntryOptionPlugin", (context, entry) => {

			if (typeof entry === "string" || Array.isArray(entry)) {
				itemToPlugin(context, entry, "main").apply(compiler);
			}

			else if (typeof entry === "object") {
				/**
				 * 把一个个对象的属性转成一个个单个的 entry 进行处理
				 * 
				 * entry = {
						index: '/Users/chenyunyi/Desktop/webpack/learn-webpack/demo0/src/index/index.js',
						search: '/Users/chenyunyi/Desktop/webpack/learn-webpack/demo0/src/search/index.js'
					}
				 */
				for (const name of Object.keys(entry)) {
					itemToPlugin(context, entry[name], name).apply(compiler);
				}
			}

			// entry 是一个函数，这么奇葩🌹
			else if (typeof entry === "function") {
				// 动态处理
				new DynamicEntryPlugin(context, entry).apply(compiler);
			}
			return true;
		});
	}
};
