import { terser } from "rollup-plugin-terser";
import scss from 'rollup-plugin-scss'
import pkg from './package.json';

export default {
    input: 'src/index.js',
    plugins: [
        terser(),
        scss({
            output: 'dist/kafka-consumer.min.css',
            outputStyle: "compressed"
        }),
    ],
    output: [
        {
            name: 'kafka-consumer',
            file: pkg.browser,
            format: 'umd',
        },
        {
            file: pkg.module,
            format: 'es'
        },
    ],
};