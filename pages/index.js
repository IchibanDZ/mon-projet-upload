import { getSession } from "next-auth/react";
import HomeContent from "../components/HomeContent";
import Navbar from "../components/Navbar";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/register",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

export default function IndexPage() {
  return <div> <Navbar /><HomeContent />;</div>
}
