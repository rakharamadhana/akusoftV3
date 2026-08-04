'use client';

import { IonApp, setupIonicReact } from '@ionic/react';
import { useEffect, useState, type ReactNode } from 'react';
import { Landmark } from 'lucide-react';

/* Ionic core styles (required) — see CLAUDE.md §7. */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional utilities we use. */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/display.css';
/* Brand theme bridge (Luminous Precision → Ionic vars). */
import '../app/ionic-theme.css';

// Auto mode: iOS look on Apple devices, Material on Android/web. Runs once,
// guarded internally for the browser so static export stays safe.
setupIonicReact();

/**
 * Wraps the app in the Ionic root context. Ionic's web components decorate
 * themselves with `hydrated`/mode classes on the client, which mismatches the
 * static-export HTML; rendering the Ionic tree only after mount (the standard
 * Ionic-in-Next pattern) avoids those hydration warnings. Both the server and
 * the first client render show the same loader, so hydration matches cleanly.
 */
export function IonicProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-xl bg-primary-container text-white">
          <Landmark className="h-6 w-6" />
        </div>
      </div>
    );
  }

  return <IonApp>{children}</IonApp>;
}
