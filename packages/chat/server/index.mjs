// @ts-check
import { Parcel } from "@parcel/core"
import e from 'express';
import jsonServer from 'json-server';
import { setupAPI } from './api-server.mjs';
import { join }  from 'path';
import * as pkgUp from 'pkg-up';
 
const server = jsonServer.create();

const PORT = process.env['PORT'] || 3000;
const PKG_JSON_PATH = pkgUp.pkgUpSync();
if (!PKG_JSON_PATH) throw new Error('Could not determine package.json path');
console.log("Directory: " + PKG_JSON_PATH)
const DIR_NAME = join(PKG_JSON_PATH, '..');

const app = e();

setupAPI(server);


const file = join(DIR_NAME, 'index.html'); // Pass an absolute path to the entrypoint here
const options = {}; // See options section of api docs, for the possibilities

// Initialize a new bundler using a file and options
const bundler = new Parcel({ entries: file, defaultConfig: '@parcel/config-default',
defaultTargetOptions: {
    engines: {
      browsers: ['last 1 Chrome version']
    }
  }})
await bundler.watch((err, buildEvent) => {
    console.log(`Parcel: `, buildEvent)
})

app.use('/assets', e.static(join(DIR_NAME, 'assets')));
app.use(server);
console.log(join(DIR_NAME, "dist", "index.html"));
app.get("/*", e.static(join(DIR_NAME, "dist")));

// Listen on port PORT
app.listen(PORT, () => {
    console.log(`Serving on http://localhost:${PORT}`)
});
