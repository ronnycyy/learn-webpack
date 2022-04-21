// 不会实例化 webpack
const NON_COMPILATION_ARGS = [
	"init",     // 创建一份 webpack 配置文件
	"migrate",  // 进行 webpack 版本迁移
	"serve",    // 运行 webpack-serve
	"generate-loader",  // 生成 webpack-loader 代码 
	"generate-plugin",  // 生成 webpack-plugin 代码
	"info"  // 返回与本地环境相关的一些信息
];

const CONFIG_GROUP = "Config options:";
const BASIC_GROUP = "Basic options:";
const MODULE_GROUP = "Module options:";
const OUTPUT_GROUP = "Output options:";
const ADVANCED_GROUP = "Advanced options:";
const RESOLVE_GROUP = "Resolving options:";
const OPTIMIZE_GROUP = "Optimizing options:";
const DISPLAY_GROUP = "Stats options:";


const GROUPS = {
	CONFIG_GROUP,
	BASIC_GROUP,
	MODULE_GROUP,
	OUTPUT_GROUP,
	ADVANCED_GROUP,
	RESOLVE_GROUP,
	OPTIMIZE_GROUP,
	DISPLAY_GROUP
};

const WEBPACK_OPTIONS_FLAG = "WEBPACK_OPTIONS";

module.exports = {
	NON_COMPILATION_ARGS,
	GROUPS,
	WEBPACK_OPTIONS_FLAG
};
