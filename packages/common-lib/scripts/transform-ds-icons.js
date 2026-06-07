/* eslint-disable spellcheck/spell-checker */
import fs from 'fs';
import { argv } from 'process';

const defaultDir = './src/assets/images/icons/ds';
const defaultInterfacesFile = './src/interfaces/DsIcon.ts';

const targetDir = argv[2];
const interfacesFile = argv[3];

function readIcons(dir = defaultDir) {
  return fs.readdirSync(dir);
}

// transform "Icon=Barcode, Style=Outline, Size=28px, Badge=None.svg" to "barcode_outline_28px"
function transformIconName(name) {
  let convertedName = name;
  if (name.includes('Icon=')) {
    const [icon, style, size, badge = 'none', extra1 = '', extra2 = ''] = name
      .split(', ')
      .map((part) =>
        part
          .split('=')[1]
          .trim()
          .replace('.svg', '')
          .replace(' ', '_')
          .toLowerCase(),
      );
    // eslint-disable-next-line no-console
    console.log(icon, style, size, badge);
    convertedName = `${icon}_${style}_${size}${badge !== 'none' ? `_${badge}` : ''}${extra1 && `_${extra1}`}${extra2 && `_${extra2}`}.svg`;
  }
  return convertedName
    .replace(/\s/g, '')
    .replace(/\+/g, 'plus_')
    .replace(/'/g, '')
    .replace(/-/g, 'minus_');
}

function writeIconsIndex(icons, interfacesFile = defaultInterfacesFile) {
  if (!interfacesFile) return;
  const interfaceName = interfacesFile.split('/').pop().replace('.ts', '');
  const clearNameIcons = icons.map(({ name, dir, flatName }) => ({
    name: name.replace('.svg', ''),
    dir: dir.replace('./src/', '@/'),
    flatName: flatName.replace('.svg', ''),
  }));

  const imports = clearNameIcons.map(
    ({ name, dir, flatName }) =>
      `import ${name} from '${dir}/${flatName}.svg';`,
  );

  const clearNames = clearNameIcons.map(({ name }) => name);

  const content = `// file generated programmatically
/* eslint-disable */
${imports.join('\n')}
export const ${interfaceName}Imports = {
  ${clearNames.join(',\n  ')},
};
export type ${interfaceName}Name =
  | '${clearNames.join("'\n  |  '")}'
  | 'empty';
`;

  fs.writeFileSync(interfacesFile, content);
}

function resolveIcons(
  dirname = defaultDir,
  interfacesFile = defaultInterfacesFile,
  prefix,
) {
  prefix = prefix ? `${prefix}_` : '';
  const icons = readIcons(dirname);
  const names = [];
  icons.forEach((icon) => {
    // if is directory, call recursively with prefix dirname.toLowerCase()
    if (fs.lstatSync(`${dirname}/${icon}`).isDirectory()) {
      names.push(
        ...resolveIcons(
          `${dirname}/${icon}`,
          interfacesFile,
          `${prefix}${icon.toLowerCase()}`,
        ),
      );
      return;
    }
    const flatNewName = transformIconName(icon);
    const newName = `${prefix}${flatNewName}`;
    names.push({ name: newName, dir: dirname, flatName: flatNewName });
    try {
      fs.renameSync(`${dirname}/${icon}`, `${dirname}/${flatNewName}`);
    } catch (e) {
      // name is already correct
    }
  });
  return names;
}

writeIconsIndex(
  resolveIcons(
    targetDir ?? defaultDir,
    interfacesFile ?? defaultInterfacesFile,
  ),
  interfacesFile,
);
