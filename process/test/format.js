import fs from 'fs';
import yaml from 'js-yaml';

let format;
try {
  const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));
  format = (config?.target === 32) 
    ? "wasm32-unknown-emscripten4" 
    : "wasm64-unknown-emscripten-draft_2024_02_15";
} catch (e) {
  format = "wasm64-unknown-emscripten-draft_2024_02_15"; // Default if file/error
}

export default format;