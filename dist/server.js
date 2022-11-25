"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _app = _interopRequireDefault(require("./app"));
const _authRoute = _interopRequireDefault(require("./routes/auth.route"));
const _indexRoute = _interopRequireDefault(require("./routes/index.route"));
const _usersRoute = _interopRequireDefault(require("./routes/users.route"));
const _validateEnv = _interopRequireDefault(require("./utils/validateEnv"));
const _areasRoute = _interopRequireDefault(require("./routes/areas.route"));
const _entriesRoute = _interopRequireDefault(require("./routes/entries.route"));
const _groupsRoute = _interopRequireDefault(require("./routes/groups.route"));
const _outputsRoute = _interopRequireDefault(require("./routes/outputs.route"));
const _processRoute = _interopRequireDefault(require("./routes/process.route"));
const _toolsRoute = _interopRequireDefault(require("./routes/tools.route"));
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