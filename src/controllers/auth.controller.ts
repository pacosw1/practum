import { NextFunction, Request, response, Response } from 'express';
import { User } from '@prisma/client';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import AuthService from '@services/auth.service';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const _ = await this.authService.signup(userData);

      const { tokenData, findUser } = await this.authService.login(userData);

      res.cookie('Authorization', tokenData.token, {
        httpOnly: true,
        secure: true,
        maxAge: tokenData.expiresIn,
        sameSite: 'none',
      });

      res.status(200).json({
        data: {
          id: findUser.id,
          email: findUser.email,
        },
        message: 'signup + login',
      });
    } catch (error) {
      next(error);
    }
  };

  public access = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : '');
      const response = await this.authService.access(Authorization);
      res.status(200).json({ data: response, message: 'auth check' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const { tokenData, findUser } = await this.authService.login(userData);

      res.cookie('Authorization', tokenData.token, {
        httpOnly: true,
        secure: true,
        maxAge: tokenData.expiresIn,
        sameSite: 'none',
      });

      res
        .status(200)
        .cookie('Authorization', tokenData.token, {
          httpOnly: true,
          secure: true,
          maxAge: tokenData.expiresIn,
          sameSite: 'none',
        })
        .json({
          data: {
            id: findUser.id,
            email: findUser.email,
          },
          message: 'login',
        });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.authService.logout(userData);

      res.cookie('Authorization', '', {
        httpOnly: true,
        secure: true,
        maxAge: 0,
        sameSite: 'none',
      });

      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
