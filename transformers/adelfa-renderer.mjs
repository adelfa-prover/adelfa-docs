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

  function highlightPopupContent(info) {
    const popupContents = [];
    if (info.output.length === 0) return [];

    const content = `>> ${info.input}\n\n${info.output}`;

    const typeCode = {
      type: "element",
      tagName: "code",
      properties: {},
      children: this.codeToHast(content, {
        ...this.options,
        transformers: [],
        lang: "adelfa",
        structure: content.trim().includes("\n") ? "classic" : "inline",
      }).children.map((child) => ({
        ...child,
        properties: {
          class: "",
        },
      })),
    };
    typeCode.properties.class = "twoslash-popup-code";

    popupContents.push(extend(hast?.popupTypes, typeCode));

    return popupContents;
  }

  return {
    nodeStaticInfo(info, node) {
      const themedContent = highlightPopupContent.call(this, info);

      if (!themedContent.length) return node;

      const popup = extend(hast?.hoverPopup, {
        type: "element",
        tagName: "span",
        properties: {
          class: "twoslash-popup-container",
        },
        children: themedContent,
      });

      return extend(hast?.hoverToken, {
        type: "element",
        tagName: "span",
        properties: {
          class: "twoslash-hover",
        },
        children: hast?.hoverCompose
          ? hast?.hoverCompose({ popup, token: node })
          : [popup, node],
      });
    },
  };
}
