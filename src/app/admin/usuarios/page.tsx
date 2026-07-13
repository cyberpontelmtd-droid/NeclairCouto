import { prisma } from "@/lib/prisma";
import { createUser, deleteUser } from "./actions";

export default async function UsuariosPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark mb-6">Usuários</h1>
        <div className="bg-white rounded-2xl shadow-sm divide-y">
          {users.map((user) => (
            <div key={user.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-brand-dark">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-brand-pink text-brand-purple">
                  {user.role === "ADMIN" ? "Admin" : "Equipe"}
                </span>
                {users.length > 1 && (
                  <form
                    action={async () => {
                      "use server";
                      await deleteUser(user.id);
                    }}
                  >
                    <button type="submit" className="text-red-500 text-sm hover:underline">
                      Remover
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-brand-dark mb-6">Adicionar usuário</h2>
        <form action={createUser} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Nome</label>
            <input
              name="name"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">E-mail</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Senha</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Papel</label>
            <select
              name="role"
              defaultValue="STAFF"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            >
              <option value="STAFF">Equipe</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="self-start bg-brand-purple text-white font-bold px-8 py-3 rounded-full hover:bg-brand-dark transition-colors"
          >
            Criar usuário
          </button>
        </form>
      </div>
    </div>
  );
}
