import { visit, SKIP } from 'unist-util-visit';

/**
 * Remark plugin to transform [@key] citation syntax into CiteRef components
 * and inject citation keys into Bibliography components.
 *
 * Usage in MDX:
 *   Some text[@harper93jacm] with citations[@nadathur22ppdp].
 *
 *   <Bibliography />
 *
 * Transforms to:
 *   Some text<CiteRef num={1} citeKey="harper93jacm" /> with citations<CiteRef num={2} citeKey="nadathur22ppdp" />.
 *
 *   <Bibliography keys={["harper93jacm", "nadathur22ppdp"]} />
 */
export function remarkCitations() {
  return (tree, file) => {
    // Track citations in order of first appearance
    const citedKeys = [];
    const keyToNum = new Map();

    // First pass: find all citations and assign numbers
    visit(tree, 'text', (node) => {
      const regex = /\[@([a-zA-Z0-9_-]+)\]/g;
      let match;
      while ((match = regex.exec(node.value)) !== null) {
        const key = match[1];
        if (!keyToNum.has(key)) {
          keyToNum.set(key, citedKeys.length + 1);
          citedKeys.push(key);
        }
      }
    });

    // If no citations found, nothing to do
    if (citedKeys.length === 0) {
      return;
    }

    // Second pass: transform text nodes with citations
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === undefined) return;

      const regex = /\[@([a-zA-Z0-9_-]+)\]/g;

      // Check if this text node contains any citations
      if (!regex.test(node.value)) {
        return;
      }

      // Reset regex
      regex.lastIndex = 0;

      // Split the text and create new nodes
      const newNodes = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(node.value)) !== null) {
        const key = match[1];
        const num = keyToNum.get(key);

        // Add text before the citation
        if (match.index > lastIndex) {
          newNodes.push({
            type: 'text',
            value: node.value.slice(lastIndex, match.index),
          });
        }

        // Add the CiteRef component
        newNodes.push({
          type: 'mdxJsxTextElement',
          name: 'CiteRef',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'num',
              value: {
                type: 'mdxJsxAttributeValueExpression',
                value: String(num),
                data: {
                  estree: {
                    type: 'Program',
                    body: [{
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'Literal',
                        value: num,
                        raw: String(num),
                      },
                    }],
                    sourceType: 'module',
                  },
                },
              },
            },
            {
              type: 'mdxJsxAttribute',
              name: 'citeKey',
              value: key,
            },
          ],
          children: [],
        });

        lastIndex = match.index + match[0].length;
      }

      // Add remaining text after last citation
      if (lastIndex < node.value.length) {
        newNodes.push({
          type: 'text',
          value: node.value.slice(lastIndex),
        });
      }

      // Replace the original node with the new nodes
      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
        return [SKIP, index + newNodes.length];
      }
    });

    // Third pass: inject keys into Bibliography components
    visit(tree, 'mdxJsxFlowElement', (node) => {
      if (node.name === 'Bibliography') {
        // Check if keys attribute already exists
        const hasKeys = node.attributes?.some(
          attr => attr.type === 'mdxJsxAttribute' && attr.name === 'keys'
        );

        if (!hasKeys) {
          // Add the keys attribute
          if (!node.attributes) {
            node.attributes = [];
          }

          node.attributes.push({
            type: 'mdxJsxAttribute',
            name: 'keys',
            value: {
              type: 'mdxJsxAttributeValueExpression',
              value: JSON.stringify(citedKeys),
              data: {
                estree: {
                  type: 'Program',
                  body: [{
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ArrayExpression',
                      elements: citedKeys.map(key => ({
                        type: 'Literal',
                        value: key,
                        raw: JSON.stringify(key),
                      })),
                    },
                  }],
                  sourceType: 'module',
                },
              },
            },
          });
        }
      }
    });
  };
}
