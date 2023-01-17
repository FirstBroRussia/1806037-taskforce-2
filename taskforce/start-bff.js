const { exec } = require('child_process');

const child = exec('nx run bff:serve', { cwd: __dirname });

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
