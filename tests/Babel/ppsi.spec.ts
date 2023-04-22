import {run_spec} from '../../test-setup/run_spec';

run_spec(__dirname, ["babel"], {
    importOrder: ['^@core/(.*)$', '^@server/(.*)', '^@ui/(.*)$', '^[./]'],
    importOrderSeparation: true,
});