// Runs the database initialization followed by the seed, in order.
// Each underlying script (db/db-init.js, db/seeders/initial-seed.js) runs as
// its own node process so they execute sequentially and we can stop if init
// fails before seeding.
const { execFileSync } = require('child_process');
const path = require('path');

const appRoot = path.resolve(__dirname, '..');

const steps = [
    { label: 'initializing database', file: path.join('db', 'db-init.js') },
    { label: 'seeding database', file: path.join('db', 'seeders', 'initial-seed.js') },
];

for (const step of steps) {
    console.log(`\n> ${step.label} (${step.file})`);
    try {
        execFileSync(process.execPath, [step.file], {
            cwd: appRoot,
            stdio: 'inherit',
        });
    } catch (err) {
        console.error(`\nfailed while ${step.label}; aborting.`);
        process.exit(err.status || 1);
    }
}

console.log('\ndatabase init + seed complete.');
