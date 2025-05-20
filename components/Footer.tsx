import Image from "next/image";

export default function Footer() {
  return (
    <div className="h-25 bg-">
        <Image
        src="/logo.svg"
        alt="Logo"
        width={64}
        height={64}
        />
    </div>
  );
}
