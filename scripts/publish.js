#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DIST_LIB = path.join(__dirname, '../dist/hello-world-web-component');
const DIST_WEB_COMPONENT = path.join(__dirname, '../dist/web-component');
const LIB_PACKAGE_JSON = path.join(__dirname, '../projects/hello-world-web-component/package.json');
const DIST_PACKAGE_JSON = path.join(DIST_LIB, 'package.json');

function run(cmd, options = {}) {
  console.log(`\n> ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit', ...options });
  } catch (error) {
    console.error(`Command failed: ${cmd}`);
    process.exit(1);
  }
}


function bumpVersion(currentVersion, type = 'patch') {
  const [major, minor, patch] = currentVersion.split('.').map(Number);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
    default:
      return `${major}.${minor}.${patch + 1}`;
  }
}

function updateVersion(version) {
  // Update source package.json
  const pkg = JSON.parse(fs.readFileSync(LIB_PACKAGE_JSON, 'utf8'));
  pkg.version = version;
  fs.writeFileSync(LIB_PACKAGE_JSON, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`Updated version in source package.json to ${version}`);

  // Update dist package.json if it exists
  if (fs.existsSync(DIST_PACKAGE_JSON)) {
    const distPkg = JSON.parse(fs.readFileSync(DIST_PACKAGE_JSON, 'utf8'));
    distPkg.version = version;
    fs.writeFileSync(DIST_PACKAGE_JSON, JSON.stringify(distPkg, null, 2) + '\n');
    console.log(`Updated version in dist package.json to ${version}`);
  }
}

function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  const dryRun = args.includes('--dry-run');
  const skipBuild = args.includes('--skip-build');
  const bumpType = args.find(arg => ['--major', '--minor', '--patch'].includes(arg))?.replace('--', '') || null;
  const explicitVersion = args.find(arg => arg.startsWith('--version='))?.split('=')[1];

  console.log('='.repeat(60));
  console.log('Publishing Angular Web Component Library');
  console.log('='.repeat(60));

  // Determine version
  let version;
  const currentPkg = JSON.parse(fs.readFileSync(LIB_PACKAGE_JSON, 'utf8'));
  const currentVersion = currentPkg.version;

  if (explicitVersion) {
    version = explicitVersion;
    console.log(`\nUsing explicit version: ${version}`);
  } else if (bumpType) {
    version = bumpVersion(currentVersion, bumpType);
    console.log(`\nBumping ${bumpType} version: ${currentVersion} -> ${version}`);
  } else {
    version = currentVersion;
    console.log(`\nUsing current version: ${version}`);
  }

  // Build if not skipped
  if (!skipBuild) {
    console.log('\n📦 Building library...');
    run('npm run build');

    console.log('\n📦 Building web component element...');
    run('npm run build:element:concat');
  } else {
    console.log('\n⏭️  Skipping build (--skip-build)');
  }

  // Check if dist exists
  if (!fs.existsSync(DIST_LIB)) {
    console.error('\n❌ Dist directory not found. Run build first.');
    process.exit(1);
  }

  // Update version in package.json files
  if (bumpType || explicitVersion) {
    console.log('\n📝 Updating version...');
    updateVersion(version);
  }

  // Copy web component bundle to dist
  if (fs.existsSync(DIST_WEB_COMPONENT)) {
    const bundleSrc = path.join(DIST_WEB_COMPONENT, 'hello-world-element.js');
    const bundleDest = path.join(DIST_LIB, 'bundles', 'hello-world-element.js');

    if (fs.existsSync(bundleSrc)) {
      const bundlesDir = path.join(DIST_LIB, 'bundles');
      if (!fs.existsSync(bundlesDir)) {
        fs.mkdirSync(bundlesDir, { recursive: true });
      }
      fs.copyFileSync(bundleSrc, bundleDest);
      console.log('\n📋 Copied web component bundle to dist/bundles/');
    }
  }

  // Publish
  if (dryRun) {
    console.log('\n🔍 Dry run - would publish:');
    run(`npm pack --dry-run`, { cwd: DIST_LIB });
  } else {
    console.log('\n🚀 Publishing to npm registry...');
    run('npm publish', { cwd: DIST_LIB });
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ ${dryRun ? 'Dry run' : 'Publish'} completed for version ${version}`);
  console.log('='.repeat(60));
}

main();

