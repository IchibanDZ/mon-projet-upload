import Link from "next/link";

export default function Footer() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex justify-center space-x-4">
        <li>
          <Link href="/mentions-legales" legacyBehavior>
            <a>Mentions Légales</a>
          </Link>
        </li>
        <li>
          <Link href="/contact" legacyBehavior>
            <a>Contact</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
