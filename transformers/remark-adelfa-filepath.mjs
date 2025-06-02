import { visit } from 'unist-util-visit';
import { dirname } from 'path';

export function remarkAdelfaFilepath() {
  return (tree, file) => {
    visit(tree, 'code', (node) => {
      // Only process adelfa code blocks with outputFile
      if (node.lang === 'adelfa' && node.meta?.includes('outputFile=')) {
        // Get the directory of the current MDX file
        const mdxDir = dirname(file.path || file.history[0] || '');

        // Add the directory path to the metadata
        // We'll add it as a special property that won't interfere with existing parsing
        node.meta = `${node.meta} __mdxDir="${mdxDir}"`;
      }
    });
  };
}