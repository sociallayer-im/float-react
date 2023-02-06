const fsExtra = require('fs-extra')
const fs = require('fs')
const path = require('path')

async function process () {
    await deleteDir('./dist')
    await copy('./manifest.json', './dist/manifest.json')
    await copy('./src/assets/icons', './dist/icons')
    await copy('./src/assets/images', './dist/images')
    await copy('./src/popup/popup.html', './dist/popup.html')
    await copy('./src/scene.splinecode', './dist/scene.splinecode')
    await copy('./src/animation', './dist/animation')
}

process()

async function move(src, dest) {
    try {
        await fsExtra.move(src, dest)
    } catch (err) {
        console.error(err)
    }
}

async function deleteDir(src) {
    try {
        await fsExtra.remove(src)
    } catch (err) {
        console.error(err)
    }
}

async function copy (src, dest) {
    try {
        await fsExtra.copy(src, dest)
    } catch (err) {
        console.error(err)
    }
}

function moveHtmlSync(filePath, dest) {
    const files = fs.readdirSync(filePath)
    const res = []
    files.forEach((filename) => {
        const filedir = path.resolve(filePath, filename)
        const stats = fs.statSync(filedir)
        const isFile = stats.isFile()
        var isDir = stats.isDirectory()
        if (isFile) {
            move(filedir, dest + filename)
            res.push(filedir)
        }

        if (isDir) {
            moveHtmlSync(filedir)
        }
    })
}
