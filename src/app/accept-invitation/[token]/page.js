import AcceptInvitationClient from './AcceptInvitationClient';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page({ params }) {
  return <AcceptInvitationClient token={params.token} />;
}
