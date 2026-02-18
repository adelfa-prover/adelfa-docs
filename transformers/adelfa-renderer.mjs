export function extend(extension, node) {
  if (!extension) return node;
  return {
    ...node,
    tagName: extension.tagName ?? node.tagName,
    properties: {
      ...node.properties,
      class: extension.class || node.properties?.class,
      ...extension.properties,
    },
    children: extension.children?.(node.children) ?? node.children,
  };
}

export function rendererRich(options = {}) {
  const { hast } = options;

  return {
    nodeStaticInfo(info, node, options = {}) {
      if (!info.output?.length) return node;

      const properties = {
        class: "twoslash-hover",
        "data-popup-input": info.input,
        "data-popup-output": info.output,
      };
      if (options.style) properties.style = options.style;

      return extend(hast?.hoverToken, {
        type: "element",
        tagName: "span",
        properties,
        children: Array.isArray(node) ? node : [node],
      });
    },
  };
}
