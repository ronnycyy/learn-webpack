// Load in dependencies
const Spritesmith = require('spritesmith');
const fs = require('fs');
const path = require('path');

// Generate our spritesheet
const sprites = ['./loaders/images/part1.jpeg', './loaders/images/part2.jpeg'];

Spritesmith.run({ src: sprites }, function handleResult(err, result) {
  console.log(result.image);  // Buffer representation of image
  console.log(result.coordinates); // Object mapping filename to {x, y, width, height} of image
  console.log(result.properties); // Object with metadata about spritesheet {width, height}
  fs.writeFileSync(path.resolve(__dirname, 'dist/sprite.jpeg'), result.image);
});