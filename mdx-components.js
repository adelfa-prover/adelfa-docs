import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs';
import { Pre, withIcons } from 'nextra/components';
import { SmallLogo } from './components/logo';
 
const docsComponents = getDocsMDXComponents({
  pre: withIcons(Pre, { adelfa: () => <SmallLogo/>, lf: () => <SmallLogo/>})
})

 
export function useMDXComponents(components) {
  return {
    ...docsComponents,
    ...components
    // ... your additional components
  }
}