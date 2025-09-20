const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
const assetsPath = path.resolve(__dirname, '..', 'public');

const packageJson = require(packageJsonPath);
const newVersion = packageJson.version;

fs.readdir(assetsPath, (err, files) => {
  if (err) {
    console.error('Error reading assets directory:', err);
    process.exit(1);
  }

  const configFiles = files.filter((file) => file.startsWith('config.') && file.endsWith('.json'));

  if (configFiles.length === 0) {
    console.warn('No config.*.json files found in public. Nothing to update.');
    return;
  }

  configFiles.forEach((file) => {
    const filePath = path.join(assetsPath, file);
    try {
      const configContent = fs.readFileSync(filePath, 'utf8');
      const configJson = JSON.parse(configContent);

      if (configJson.version !== newVersion) {
        configJson.version = newVersion;
        fs.writeFileSync(filePath, JSON.stringify(configJson, null, 2));
        console.log(`Successfully updated ${file} to version ${newVersion}`);
      } else {
        console.log(`${file} is already up to date with version ${newVersion}.`);
      }
    } catch (error) {
      console.error(`Failed to update ${file}:`, error);
    }
  });
});
