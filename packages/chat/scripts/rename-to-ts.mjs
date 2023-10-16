import { promises as fs } from 'fs'
import * as execa from 'execa'
import * as path from 'path';


/**
 * Rename all files in a folder that have one extension to another extension
 *
 * @param {string} dir directory to scan
 * @param {string} oldExt old extension
 * @param {string} newExt new extension
 */
const renameFiles = async (dir, oldExt, newExt) => {
  const files = await fs.readdir(dir, { withFileTypes: true })

  for (const file of files) {
    const fullPath = path.join(dir, file.name)

    if (file.isDirectory()) {
      await renameFiles(fullPath, oldExt, newExt)
    } else if (file.isFile()) {
      const fileName = file.name

      // Check if the file name ends with the old extension
      if (fileName.endsWith(oldExt)) {
        const newFileName = fileName.replace(new RegExp(`${oldExt}$`), newExt)
        const newFullPath = path.join(dir, newFileName)

        // Using git mv to rename with execa
        try {
          execa.execaSync('git', ['mv', fullPath, newFullPath])
          console.log(`Renamed ${fullPath} to ${newFullPath}`)
        } catch (error) {
          console.error(
            `Error renaming ${fullPath} to ${newFullPath}:`,
            error.message,
          )
        }
      }
    }
  }
}

const main = async () => {
  await renameFiles('src', '.jsx', '.tsx')
  await renameFiles('src', '.js', '.ts')
  await renameFiles('tests', '.jsx', '.tsx')
  await renameFiles('tests', '.test.jsx.snap', '.test.tsx.snap')
  await renameFiles('tests', '.js', '.ts')
}

main().catch((err) => {
  console.error(err)
})