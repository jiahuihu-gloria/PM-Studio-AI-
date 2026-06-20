import type { ProductWorkspace } from "@/lib/domain/product-workspace";

export interface ProjectRepository {
  save(workspace: ProductWorkspace): Promise<ProductWorkspace>;
  findById(id: string): Promise<ProductWorkspace | null>;
}

const memoryStore = new Map<string, ProductWorkspace>();

export class InMemoryProjectRepository implements ProjectRepository {
  async save(workspace: ProductWorkspace) {
    memoryStore.set(workspace.id, workspace);
    return workspace;
  }

  async findById(id: string) {
    return memoryStore.get(id) ?? null;
  }
}
