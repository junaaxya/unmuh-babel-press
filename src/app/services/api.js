//panggilan API pakai fetch
export const getHomeContent = async () => {
    const res = await fetch('/api/beranda');
    return await res.json();
};

export const uploadLogo = async (file) => {
    const form = new FormData();
    form.append('file', file);
    return await fetch('/api/beranda/logo', {
        method: 'POST',
        body: form,
    });
};

export const deleteLogo = async () => {
    return await fetch('/api/beranda/logo', { method: 'DELETE' });
};

export const uploadHeroImage = async (file) => {
    const form = new FormData();
    form.append('file', file);
    return await fetch('/api/beranda/hero-image', {
        method: 'POST',
        body: form,
    });
};

export const deleteHeroImage = async () => {
    return await fetch('/api/beranda/hero-image', { method: 'DELETE' });
};

export const updateHeroText = async (payload) => {
    return await fetch('/api/beranda/hero-text', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
};
