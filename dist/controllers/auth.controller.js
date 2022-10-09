'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true,
});
Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: () => _default,
});
const _authService = _interopRequireDefault(require('../services/auth.service'));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule
    ? obj
    : {
        default: obj,
      };
}
let AuthController = class AuthController {
  constructor() {
    this.authService = new _authService.default();
    this.signUp = async (req, res, next) => {
      try {
        const userData = req.body;
        const signUpUserData = await this.authService.signup(userData);
        res.status(201).json({
          data: signUpUserData,
          message: 'signup',
        });
      } catch (error) {
        next(error);
      }
    };
    this.logIn = async (req, res, next) => {
      try {
        const userData = req.body;
        const { tokenData, findUser } = await this.authService.login(userData);

        let options = {
          httpOnly: true,
          secure: true,
          maxAge: tokenData.expiresIn,
          sameSite: 'none',
        };

        res.cookie('Authorization', tokenData.token, options);

        res.status(200).json({
          data: findUser,
          message: 'login',
        });
      } catch (error) {
        next(error);
      }
    };
    this.logOut = async (req, res, next) => {
      try {
        const userData = req.user;
        const logOutUserData = await this.authService.logout(userData);

        let options = {
          httpOnly: true,
          secure: true,
          maxAge: 0,
          sameSite: 'none',
        };

        res.cookie('Authorization', '', options);

        res.status(200).json({
          data: logOutUserData,
          message: 'logout',
        });
      } catch (error) {
        next(error);
      }
    };
  }
};
const _default = AuthController;

//# sourceMappingURL=auth.controller.js.map
