import ResetPasswordForm from './ResetPasswordForm';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ResetPasswordPage({ params }) {
  const { token } = await params;
  return <ResetPasswordForm token={token} />;
}

