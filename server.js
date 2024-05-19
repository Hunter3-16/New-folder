const { spawn } = require('child_process');

const services = [
  { name: 'User Service', script: './services/userService.js', port: 3001 },
  { name: 'Restaurant Service', script: './services/restaurantService.js', port: 3002 },
  { name: 'Delivery Agent Service', script: './services/deliveryAgentService.js', port: 3003 },
];

services.forEach(service => {
  const proc = spawn('node', [service.script]);

  proc.stdout.on('data', data => {
    console.log(`${service.name}: ${data}`);
  });

  proc.stderr.on('data', data => {
    console.error(`${service.name} Error: ${data}`);
  });

  proc.on('close', code => {
    console.log(`${service.name} exited with code ${code}`);
  });
});