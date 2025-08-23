// Lokasi: src/components/common/ThemeProvider.js
'use client';

import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';

export function MyThemeProvider({ children, ...props }) {
    const [isMounted, setIsMounted] = useState(false);

    // useEffect ini hanya akan berjalan di browser, bukan di server.
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Selama komponen belum ter-mount di browser, jangan render provider-nya.
    // Ini adalah kunci untuk mencegah "hydration mismatch".
    if (!isMounted) {
        return <>{children}</>;
    }

    // Setelah komponen siap di browser, barulah render ThemeProvider.
    return <ThemeProvider {...props}>{children}</ThemeProvider>;
}