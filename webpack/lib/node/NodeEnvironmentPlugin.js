/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const NodeWatchFileSystem = require("./NodeWatchFileSystem");
const NodeOutputFileSystem = require("./NodeOutputFileSystem");
const NodeJsInputFileSystem = require("enhanced-resolve/lib/NodeJsInputFileSystem");
const CachedInputFileSystem = require("enhanced-resolve/lib/CachedInputFileSystem");
const createConsoleLogger = require("../logging/createConsoleLogger");
const nodeConsole = require("./nodeConsole");

class NodeEnvironmentPlugin {
	constructor(options) {
		this.options = options || {};
	}

	// 插件的 apply，用于注册事件回调
	apply(compiler) {
		compiler.infrastructureLogger = createConsoleLogger(
			Object.assign(
				{
					level: "info",
					debug: false,
					console: nodeConsole
				},
				this.options.infrastructureLogging
			)
		);
		compiler.inputFileSystem = new CachedInputFileSystem(
			new NodeJsInputFileSystem(),
			60000
		);
		const inputFileSystem = compiler.inputFileSystem;
		compiler.outputFileSystem = new NodeOutputFileSystem();
		compiler.watchFileSystem = new NodeWatchFileSystem(
			compiler.inputFileSystem
		);

		// [webpack 流程篇] 准备阶段:  在 entry-option 和 run 事件之间触发 beforeRun 事件
		// 是 beforeRun 事件，不是 NodeEnvironmentPlugin 事件啊 !!!!!!! 😠😠🔥🔥🔥
		// 清理缓存
		compiler.hooks.beforeRun.tap("NodeEnvironmentPlugin", compiler => {
			if (compiler.inputFileSystem === inputFileSystem) inputFileSystem.purge();
		});
	}
}
module.exports = NodeEnvironmentPlugin;
