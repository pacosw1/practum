"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _app = _interopRequireDefault(require("./app.ts"));
const _authRoute = _interopRequireDefault(require("./routes/auth.route.ts"));
const _indexRoute = _interopRequireDefault(require("./routes/index.route.ts"));
const _usersRoute = _interopRequireDefault(require("./routes/users.route.ts"));
const _validateEnv = _interopRequireDefault(require("./utils/validateEnv.ts"));
const _areasRoute = _interopRequireDefault(require("./routes/areas.route.ts"));
const _entriesRoute = _interopRequireDefault(require("./routes/entries.route.ts"));
const _groupsRoute = _interopRequireDefault(require("./routes/groups.route.ts"));
const _outputsRoute = _interopRequireDefault(require("./routes/outputs.route.ts"));
const _processRoute = _interopRequireDefault(require("./routes/process.route.ts"));
const _toolsRoute = _interopRequireDefault(require("./routes/tools.route.ts"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
(0, _validateEnv.default)();
const app = new _app.default([
    new _indexRoute.default(),
    new _usersRoute.default(),
    new _authRoute.default(),
    new _areasRoute.default(),
    new _groupsRoute.default(),
    new _processRoute.default(),
    new _entriesRoute.default(),
    new _outputsRoute.default(),
    new _toolsRoute.default()
]);
app.listen();

//# sourceMappingURL=server.js.map