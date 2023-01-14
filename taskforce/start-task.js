const { exec } = require('child_process');

const child = exec('nx run task:serve', { cwd: __dirname });

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
