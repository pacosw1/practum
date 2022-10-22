import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import AreasRoute from './routes/areas.route';
import EntriesRoute from './routes/entries.route';
import GroupsRoute from './routes/groups.route';
import OutputsRoute from './routes/outputs.route';
import ProcessRoute from './routes/process.route';

validateEnv();

const app = new App([
    new IndexRoute(), 
    new UsersRoute(), 
    new AuthRoute(), 
    new AreasRoute(), 
    new GroupsRoute(), 
    new ProcessRoute(),
    new EntriesRoute(),
    new OutputsRoute()
]);

app.listen();
