import Image from "next/image";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

async function authenticate(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const callbackUrl = (formData.get("callbackUrl") as string) || "/admin";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/login?error=1&callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
    throw error;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-pink px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-16 h-16 mb-4">
            <Image src="/logo-icon.png" alt="Neclair Couto" fill className="object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-brand-dark">Painel Administrativo</h1>
          <p className="text-gray-500 text-sm mt-1">Neclair Couto</p>
        </div>

        {params.error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
            E-mail ou senha inválidos.
          </p>
        )}

        <form action={authenticate} className="flex flex-col gap-4">
          <input type="hidden" name="callbackUrl" value={params.callbackUrl || "/admin"} />
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-dark mb-1">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-dark mb-1">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>
          <button
            type="submit"
            className="mt-2 bg-brand-purple text-white font-bold py-3 rounded-full hover:bg-brand-dark transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
