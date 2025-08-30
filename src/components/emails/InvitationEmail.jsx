// src/components/emails/InvitationEmail.jsx
import React from 'react';
import Image from 'next/image';

// --- Gaya CSS Inline untuk Kompatibilitas Maksimal ---
const main = {
    backgroundColor: '#f8fafc',
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", "Arial", sans-serif',
    padding: '20px 0',
    margin: 0,
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '0',
    width: '600px',
    maxWidth: '100%',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
};

const headerSection = {
    background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
    padding: '40px 24px',
    textAlign: 'center',
    color: '#ffffff',
};

const logoContainer = {
    marginBottom: '20px',
};

const logo = {
    height: '60px',
    maxWidth: '200px',
    filter: 'brightness(0) invert(1)', // Make logo white if it's dark
};

const headerTitle = {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: '#ffffff',
};

const headerSubtitle = {
    fontSize: '16px',
    fontWeight: '400',
    margin: '0',
    opacity: '0.9',
    color: '#ffffff',
};

const contentSection = {
    padding: '40px 32px',
};

const inviterSection = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '32px',
    border: '1px solid #e2e8f0',
};

const avatar = {
    borderRadius: '50%',
    width: '56px',
    height: '56px',
    border: '3px solid #ffffff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
};

const inviterInfo = {
    flex: '1',
};

const inviterName = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a202c',
    margin: '0 0 4px 0',
};

const inviterText = {
    fontSize: '14px',
    color: '#64748b',
    margin: '0',
};

const mainContent = {
    marginBottom: '32px',
};

const greeting = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a202c',
    margin: '0 0 20px 0',
};

const paragraph = {
    color: '#374151',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '0 0 16px 0',
};

const buttonContainer = {
    textAlign: 'center',
    margin: '32px 0',
};

const button = {
    background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '16px 32px',
    minWidth: '200px',
    boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
    transition: 'all 0.3s ease',
};

const alternativeLink = {
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginTop: '24px',
};

const alternativeLinkText = {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 8px 0',
    textAlign: 'center',
};

const linkText = {
    color: '#007bff',
    textDecoration: 'none',
    wordBreak: 'break-all',
    fontSize: '13px',
    fontFamily: 'monospace',
    display: 'block',
    textAlign: 'center',
    padding: '8px',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    border: '1px solid #e2e8f0',
};

const divider = {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '32px 0',
    border: 'none',
};

const features = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginTop: '24px',
};

const feature = {
    flex: '1',
    minWidth: '150px',
    textAlign: 'center',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
};

const featureIcon = {
    fontSize: '24px',
    marginBottom: '8px',
    display: 'block',
};

const featureTitle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a202c',
    margin: '0 0 4px 0',
};

const featureText = {
    fontSize: '12px',
    color: '#64748b',
    margin: '0',
};

const footer = {
    backgroundColor: '#1a202c',
    color: '#94a3b8',
    fontSize: '13px',
    textAlign: 'center',
    padding: '32px 24px',
};

const footerTitle = {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 8px 0',
};

const footerText = {
    margin: '0 0 4px 0',
    lineHeight: '1.4',
};

const footerLink = {
    color: '#60a5fa',
    textDecoration: 'none',
};

// --- Komponen Email ---
export const InvitationEmail = ({
    invitationLink = 'https://example.com',
    invitedBy = 'Admin',
    invitedByImage = 'https://via.placeholder.com/56x56/007bff/ffffff?text=A',
    logoUrl = 'https://unmuhbabelpress.com/unmuhpress.png',
    companyName = 'Unmuh Babel Press',
    recipientName = '',
    expiresIn = '7 hari',
    role = 'editor', // 'admin', 'editor', 'reviewer'
    invitedByRole = 'Admin',
}) => {
    const currentYear = new Date().getFullYear();

    // Role configurations
    const roleConfig = {
        ADMIN: {
            title: 'Administrator',
            description: 'Kelola seluruh sistem, user, dan konten',
            color: '#dc2626', // red
            gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            icon: '👑',
            permissions: [
                '🛡️ Akses penuh ke dashboard',
                '👥 Kelola semua pengguna',
                '⚙️ Konfigurasi sistem',
                '📊 Analytics lengkap',
            ],
        },
        EDITOR: {
            // Gunakan huruf besar
            title: 'Editor',
            description: 'Buat, edit, dan publikasikan konten',
            color: '#059669', // green
            gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            icon: '✏️',
            permissions: [
                '📝 Buat dan edit artikel',
                '📤 Publikasikan konten',
                '🖼️ Kelola media library',
                '📋 Akses content management',
            ],
        },
        VIEWER: {
            // Gunakan huruf besar
            title: 'Reviewer',
            description: 'Review dan approve konten sebelum publikasi',
            color: '#7c3aed', // purple
            gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            icon: '🔍',
            permissions: [
                '👀 Review konten draft',
                '✅ Approve/reject artikel',
                '📝 Berikan feedback',
                '📊 Laporan review',
            ],
        },
    };

    const currentRole = roleConfig[role.toUpperCase()]

    return (
        <html lang="id">
            <head>
                <meta
                    httpEquiv="Content-Type"
                    content="text/html; charset=UTF-8"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>Undangan Bergabung - {companyName}</title>
            </head>
            <body style={main}>
                <div style={container}>
                    {/* Header Section */}
                    <div
                        style={{
                            ...headerSection,
                            background: currentRole.gradient,
                        }}
                    >
                        <div style={logoContainer}>
                            <Image
                                style={logo}
                                src={logoUrl}
                                alt={`${companyName} Logo`}
                                width={200}
                                height={60}
                                unoptimized
                            />
                        </div>
                        <h1 style={headerTitle}>
                            Undangan Dashboard {currentRole.icon}
                        </h1>
                        <p style={headerSubtitle}>
                            Bergabunglah sebagai{' '}
                            <strong>{currentRole.title}</strong>
                        </p>
                    </div>

                    {/* Content Section */}
                    <div style={contentSection}>
                        {/* Inviter Section */}
                        <div style={inviterSection}>
                            <Image
                                style={avatar}
                                src={invitedByImage}
                                alt={invitedBy}
                                width={56}
                                height={56}
                                unoptimized
                            />
                            <div style={inviterInfo}>
                                <div style={inviterName}>{invitedBy}</div>
                                <div style={inviterText}>
                                    ({invitedByRole}) mengundang Anda ke
                                    dashboard
                                </div>
                            </div>
                            <div
                                style={{
                                    backgroundColor: currentRole.color,
                                    color: 'white',
                                    padding: '4px 10px',
                                    borderRadius: '15px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    marginLeft: '8px',
                                    flexShrink: 0,
                                }}
                            >
                                {currentRole.title}
                            </div>
                        </div>

                        {/* Main Content */}
                        <div style={mainContent}>
                            <div style={greeting}>
                                Halo{recipientName ? ` ${recipientName}` : ''}!
                                👋
                            </div>

                            <p style={paragraph}>
                                Anda telah diundang untuk bergabung dengan{' '}
                                <strong>{companyName} Dashboard</strong> sebagai{' '}
                                <strong style={{ color: currentRole.color }}>
                                    {currentRole.title}
                                </strong>
                                .
                            </p>

                            <p style={paragraph}>
                                {currentRole.description}. Sebagai{' '}
                                {currentRole.title}, Anda akan memiliki akses ke
                                berbagai fitur dan tools yang diperlukan untuk
                                menjalankan tugas Anda dengan efektif.
                            </p>

                            {/* Role Permissions */}
                            <div
                                style={{
                                    backgroundColor: '#f8fafc',
                                    padding: '24px',
                                    borderRadius: '10px',
                                    border: `2px solid ${currentRole.color}20`,
                                    marginBottom: '24px',
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: currentRole.color,
                                        marginBottom: '16px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {currentRole.icon} Akses & Permissions Anda
                                </div>
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns:
                                            'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '12px',
                                    }}
                                >
                                    {currentRole.permissions.map(
                                        (permission, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    fontSize: '14px',
                                                    color: '#374151',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                }}
                                            >
                                                {permission}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div style={buttonContainer}>
                            <a
                                href={invitationLink}
                                style={{
                                    ...button,
                                    background: currentRole.gradient,
                                    boxShadow: `0 4px 12px ${currentRole.color}40`,
                                }}
                            >
                                🚀 Akses Dashboard Sebagai {currentRole.title}
                            </a>
                        </div>

                        {/* Alternative Link */}
                        <div style={alternativeLink}>
                            <p style={alternativeLinkText}>
                                Jika tombol di atas tidak berfungsi, salin dan
                                tempel tautan berikut:
                            </p>
                            <a href={invitationLink} style={linkText}>
                                {invitationLink}
                            </a>
                        </div>

                        <hr style={divider} />

                        {/* Important Notice */}
                        <p
                            style={{
                                ...paragraph,
                                fontSize: '14px',
                                color: '#64748b',
                                textAlign: 'center',
                            }}
                        >
                            ⏰ <strong>Penting:</strong> Undangan dashboard ini
                            berlaku selama {expiresIn}.
                            <br />
                            Segera akses untuk mulai mengelola konten dengan
                            role{' '}
                            <strong style={{ color: currentRole.color }}>
                                {currentRole.title}
                            </strong>
                            !
                        </p>
                    </div>

                    {/* Footer */}
                    <div style={footer}>
                        <div style={footerTitle}>{companyName}</div>
                        <p style={footerText}>
                            Jalan Balai, Kecamatan Pangkalan Baru
                            <br />
                            Kabupaten Bangka Tengah, Indonesia
                        </p>
                        <p style={footerText}>
                            Email:{' '}
                            <a
                                href="mailto:info@unmuhbabelpress.com"
                                style={footerLink}
                            >
                                info@unmuhbabelpress.com
                            </a>
                        </p>
                        <p
                            style={{
                                ...footerText,
                                marginTop: '16px',
                                paddingTop: '16px',
                                borderTop: '1px solid #374151',
                            }}
                        >
                            &copy; {currentYear} {companyName}. Seluruh hak
                            cipta dilindungi.
                        </p>
                    </div>
                </div>
            </body>
        </html>
    );
};

export default InvitationEmail;
