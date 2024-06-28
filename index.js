import path from "node:path";
import fs from "node:fs";
import os from "node:os";

const HOME_PATH = os.homedir();
const LEVEL_PATH = "C:/Program Files (x86)/Steam/steamapps/common/Beat Saber/Beat Saber_Data/CustomLevels";
const DATA_PATH = path.join(HOME_PATH, "AppData/LocalLow/Hyperbolic Magnetism/Beat Saber/PlayerData.dat");
const OUTPUT_PATH = path.join(process.cwd(), "output");

function chkDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
}

;(async function() {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      throw new Error(`${DATA_PATH} not found`);
    }
    if (!fs.existsSync(LEVEL_PATH)) {
      throw new Error(`${LEVEL_PATH} not found`);
    }

    const playerData = JSON.parse(fs.readFileSync(DATA_PATH));
    const favoritesLevelIds = playerData.localPlayers[0].favoritesLevelIds;

    const dirNames = favoritesLevelIds.filter(function(item) {
        return /^custom_level_/i.test(item);
      })
      .map(function(item) {
        return item.replace(/^custom_level_/i, "");
      });

    chkDir(OUTPUT_PATH);
    for (const dirName of dirNames) {
      const srcPath = path.join(LEVEL_PATH, dirName);
      const dstPath = path.join(OUTPUT_PATH, dirName);

      if (!fs.existsSync(srcPath)) {
        console.error(new Error(`${srcPath} not found`));
        continue;
      }

      fs.cpSync(srcPath, dstPath, { recursive: true });
    }
  } catch(err) {
    console.error(err);
  }
})();

