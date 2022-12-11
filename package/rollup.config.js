import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

export default {
    input: 'src/index.js',
    plugins: [
        terser(),
    ],
    output: [
        {
            file: pkg.module,
            format: 'es'
        },
    ],
};