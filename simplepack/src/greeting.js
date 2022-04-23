import { superGreeting } from './super-greeting.js';

export function greeting(name) {
  const s = superGreeting(name);
  return 'hello ' + name + ', ' + s;
}