import type { MDXComponents } from "mdx/types";
import defaultMdxComponents from "fumadocs-ui/mdx";
import {
  CiteRef,
  Bibliography,
  AdelfaPublications,
} from "@/components/Citation";
import { Tabs, Tab } from "fumadocs-ui/components/tabs";
import { Steps, Step } from "fumadocs-ui/components/steps";
import { Files, Folder, File } from "fumadocs-ui/components/files";

function AdelfaCode(_props: {
  lang: "adelfa" | "lf";
  file: string;
  output?: string;
}) {
  return null; // Replaced by remark plugin at build time
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    CiteRef,
    Bibliography,
    AdelfaPublications,
    AdelfaCode,
    Tabs,
    Tab,
    Steps,
    Step,
    Files,
    Folder,
    File,
  };
}
