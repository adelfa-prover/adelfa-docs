import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh]">
      <h1 className="mt-2 text-4xl font-bold tracking-tight">
        404: Page Not Found
      </h1>
      <div className="mt-6 flex gap-4">
        <Link href="/" className="text-blue-600 underline hover:no-underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
