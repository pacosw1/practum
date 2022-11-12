"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _authService = _interopRequireDefault(require("../services/auth.service"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let AuthController = class AuthController {
    constructor(){
        this.authService = new _authService.default();
        this.signUp = async (req, res, next)=>{
            try {
                const userData = req.body;
                const _ = await this.authService.signup(userData);
                const { tokenData , findUser  } = await this.authService.login(userData);
                res.cookie('Authorization', tokenData.token, {
                    httpOnly: true,
                    secure: true,
                    maxAge: tokenData.expiresIn,
                    sameSite: 'none'
                });
                res.status(200).json({
                    data: {
                        id: findUser.id,
                        email: findUser.email
                    },
                    message: 'signup + login'
                });
            } catch (error) {
                next(error);
            }
        };
        this.access = async (req, res, next)=>{
            try {
                const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : '');
                const response = await this.authService.access(Authorization);
                res.status(200).json({
                    data: response,
                    message: 'auth check'
                });
            } catch (error) {
                next(error);
            }
        };
        this.logIn = async (req, res, next)=>{
            try {
                const userData = req.body;
                const { tokenData , findUser  } = await this.authService.login(userData);
                res.cookie('Authorization', tokenData.token, {
                    httpOnly: true,
                    secure: true,
                    maxAge: tokenData.expiresIn,
                    sameSite: 'none'
                });
                res.status(200).cookie('Authorization', tokenData.token, {
                    httpOnly: true,
                    secure: true,
                    maxAge: tokenData.expiresIn,
                    sameSite: 'none'
                }).json({
                    data: {
                        id: findUser.id,
                        email: findUser.email
                    },
                    message: 'login'
                });
            } catch (error) {
                next(error);
            }
        };
        this.logOut = async (req, res, next)=>{
            try {
                const userData = req.user;
                const logOutUserData = await this.authService.logout(userData);
                res.cookie('Authorization', '', {
                    httpOnly: true,
                    secure: true,
                    maxAge: 0,
                    sameSite: 'none'
                });
                res.status(200).json({
                    data: logOutUserData,
                    message: 'logout'
                });
            } catch (error) {
                next(error);
            }
        };
    }
};
const _default = AuthController;

//# sourceMappingURL=auth.controller.js.map