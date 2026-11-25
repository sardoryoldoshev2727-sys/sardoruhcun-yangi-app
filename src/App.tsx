/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppShell } from './components/AppShell';
import { StoreProvider } from './context/StoreContext';

export default function App() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}
