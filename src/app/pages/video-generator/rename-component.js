const { readdirSync, statSync, renameSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const directory = './';
const oldName = 'videoGenerator';
const newName = 'videoGenerator'; // Replace this with your desired name


const newNameCapitalized = newName.charAt(0).toUpperCase() + newName.slice(1);

function renameFiles(dir) {
    const files = readdirSync(dir);
    
    files.forEach(file => {
        const filePath = join(dir, file);
        const stats = statSync(filePath);

        if (stats.isDirectory() && file.toLowerCase().includes(oldName.toLowerCase())) {
            // Rename directories containing the old name
            const newDirName = file.replace(new RegExp(oldName, 'gi'), newName);
            const newDirPath = join(dir, newDirName);
            try {
                renameSync(filePath, newDirPath);
                console.log(`Renamed directory: ${file} → ${newDirName}`);
                // Continue renaming inside the new directory
                renameFiles(newDirPath);
            } catch (err) {
                console.error(`Error renaming directory ${file}:`, err);
            }
        } else if (stats.isFile()) {
            // Read the file content
            let content = readFileSync(filePath, 'utf8');
            // Replace occurrences of the old name with the new name in the content
            content = content.replace(new RegExp(oldName, 'g'), newName);
            content = content.replace(new RegExp(oldName.charAt(0).toUpperCase() + oldName.slice(1), 'g'), newNameCapitalized);
            // Write the updated content back to the file
            writeFileSync(filePath, content, 'utf8');

            if (file.toLowerCase().includes(oldName)) {
                // Rename files containing the old name
                const newFileName = file.replace(new RegExp(oldName, 'gi'), newName);
                const newPath = join(dir, newFileName);
                try {
                    renameSync(filePath, newPath);
                    console.log(`Renamed: ${file} → ${newFileName}`);
                } catch (err) {
                    console.error(`Error renaming ${file}:`, err);
                }
            }
        }
    });
}

// Execute the function
renameFiles(directory);