import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    tsconfigPaths(),
    mode === "development" && componentTagger(),
    {
      name: 'create-admin',
      configureServer(server) {
        server.middlewares.use('/create-admin', async (req, res) => {
          try {
            const { createUser } = await server.ssrLoadModule('src/hooks/useUsers.ts');
            await createUser({
              full_name: 'Test Admin',
              email: 'test-admin@example.com',
              role: 'admin',
              password: 'password123',
            });
            res.end('Admin user created successfully');
          } catch (error) {
            console.error('Error creating admin user:', error);
            res.end('Error creating admin user');
          }
        });
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
