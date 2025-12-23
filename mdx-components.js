import { useMDXComponents as getDocsMDXComponents } from "nextra-theme-docs";
import { Pre, withIcons, Popup } from "nextra/components";
import { SmallLogo } from "./components/logo";
import {
  CiteRef,
  Bibliography,
  AdelfaPublications,
} from "./components/Citation";

const docsComponents = getDocsMDXComponents({
  pre: withIcons(Pre, { adelfa: () => <SmallLogo />, lf: () => <SmallLogo /> }),
});

export function useMDXComponents(components) {
  return {
    ...docsComponents,
    ...components,
    Popup,
    CiteRef,
    Bibliography,
    AdelfaPublications,
  };
}
