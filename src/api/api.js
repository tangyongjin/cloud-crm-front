import { port, root_url, version_2 } from './api_config/base_config';
import activity from './api_activity';
import auth from './api_auth';
import button from './api_button';
import curd from './api_curd';
import filehandler from './api_file';
import permission from './api_permission';
import processmanager from './api_processmanager';
import user from './api_user';
import organization from './api_organization';

const api_root = `${root_url}:${port}/${version_2}`;
export { api_root };

export default class api {}

api.button = button.apis;
api.organization = organization.apis;
api.processmanager = processmanager.apis;
api.activity = activity.apis;
api.curd = curd.apis;
api.auth = auth.apis;
api.permission = permission.apis;
api.user = user.apis;
api.filehandler = filehandler.apis;
