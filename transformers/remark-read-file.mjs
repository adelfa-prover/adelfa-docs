import { visit } from 'unist-util-visit';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';

export function remarkReadFile() {
  return (tree, file) => {
    visit(tree, 'code', (node) => {
      // Only process code blocks with readFile attribute
      if (node.meta?.includes('readFile')) {
        // Get the directory of the current MDX file
        const mdxDir = dirname(file.path || file.history[0] || '');
        
        let filename;
        
        // Check if readFile has a value (readFile="value")
        const readFileMatch = node.meta.match(/readFile="([^"]+)"/);
        if (readFileMatch) {
          filename = readFileMatch[1];
        } else if (node.meta.includes('readFile')) {
          // readFile flag without value, try to use filename attribute
          const filenameMatch = node.meta.match(/filename="([^"]+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          } else {
            console.warn(`readFile used without value and no filename attribute found in ${file.path}: ${node.meta}`);
            return;
          }
        }
        
        if (!filename) {
          console.warn(`Could not determine filename for readFile in ${file.path}: ${node.meta}`);
          return;
        }
        
        const filePath = join(mdxDir, filename);
        
        // Check if file exists and read it
        if (existsSync(filePath)) {
          try {
            const fileContent = readFileSync(filePath, 'utf-8');
            // Replace the code block content with the file content
            node.value = fileContent;
            
            // Remove the readFile attribute from meta to avoid conflicts
            node.meta = node.meta.replace(/\s*readFile(?:="[^"]+")?/, '');
            // Clean up any extra spaces
            node.meta = node.meta.trim();
          } catch (error) {
            console.error(`Error reading file ${filePath}: ${error.message}`);
            // Keep original content if file can't be read
          }
        } else {
          console.warn(`File not found: ${filePath}`);
          // Keep original content if file doesn't exist
        }
      }
    });
  };
}