import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import HardwareOnly from '@site/src/components/HardwareOnly';
import Translator from '@site/src/components/Translator';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  // Map the "<HardwareOnly>" tag to our component
  HardwareOnly,
  // Override h1 to inject Translator
  h1: (props) => (
    <header>
      <h1 {...props} />
      <Translator />
    </header>
  ),
};
