import { v4 as uuidv4 } from 'uuid';
import { Database, Page, Property } from '../types/database';

// Check if we are running in a browser environment (no electronAPI)
if (!window.electronAPI) {
  console.log('Running in browser mode - using localStorage mock');

  const PAGES_KEY = 'notion_clone_pages';
  const DB_PROPS_KEY = 'notion_clone_db_props';
  const PROP_VALUES_KEY = 'notion_clone_prop_values';
  const DATABASES_KEY = 'notion_clone_databases';

  const getStorage = (key: string) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error(`Failed to parse ${key}`, e);
      return [];
    }
  };

  const saveStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const dbApi = {
    // --- DATABASE ---
    createDatabase: async (input: { title: string; parentPageId?: string }): Promise<Database> => {
      const dbs = getStorage(DATABASES_KEY);
      const newDb: Database = {
        id: uuidv4(),
        title: input.title,
        parent_page_id: input.parentPageId || null,
        created_at: Date.now(),
        updated_at: Date.now(),
        icon: null,
        cover_url: null
      };
      dbs.push(newDb);
      saveStorage(DATABASES_KEY, dbs);
      return newDb;
    },
    getDatabase: async (id: string): Promise<Database | null> => {
      const dbs = getStorage(DATABASES_KEY);
      return dbs.find((d: any) => d.id === id) || null;
    },

    // --- PROPERTIES ---
    db: {
      addProperty: async (databaseId: string, name: string, type: string, config?: any): Promise<Property> => {
        const props = getStorage(DB_PROPS_KEY);
        const newProp = {
          id: uuidv4(),
          database_id: databaseId,
          name,
          type,
          config: config || {},
          order_index: props.filter((p: any) => p.database_id === databaseId).length,
          visible: true,
          created_at: Date.now()
        };
        props.push(newProp);
        saveStorage(DB_PROPS_KEY, props);
        return newProp as any;
      },
      updateProperty: async (id: string, updates: any) => {
        const props = getStorage(DB_PROPS_KEY);
        const index = props.findIndex((p: any) => p.id === id);
        if (index !== -1) {
          props[index] = { ...props[index], ...updates };
          saveStorage(DB_PROPS_KEY, props);
        }
      },
      deleteProperty: async (id: string) => {
        let props = getStorage(DB_PROPS_KEY);
        props = props.filter((p: any) => p.id !== id);
        saveStorage(DB_PROPS_KEY, props);
      },
      getProperties: async (databaseId: string): Promise<Property[]> => {
        const props = getStorage(DB_PROPS_KEY);
        return props
          .filter((p: any) => p.database_id === databaseId)
          .sort((a: any, b: any) => a.order_index - b.order_index);
      }
    },

    // --- PAGES ---
    page: {
      create: async (parentId: string, parentType: 'database' | 'page' = 'database'): Promise<Page> => {
        const pages = getStorage(PAGES_KEY);
        // Ensure parentType is valid for the mock
        const pType = parentType === 'database' || parentType === 'page' ? parentType : 'page';

        const newPage: Page = {
          id: uuidv4(),
          title: 'Untitled',
          content: [],
          parent_id: parentId || null,
          parent_type: pType,
          is_archived: false,
          is_favorite: false,
          created_at: Date.now(),
          updated_at: Date.now(),
          icon: null,
          cover_image: null,
          type: 'doc'
        };
        pages.push(newPage);
        saveStorage(PAGES_KEY, pages);
        return newPage;
      },
      get: async (id: string): Promise<Page | null> => {
        const pages = getStorage(PAGES_KEY);
        return pages.find((p: any) => p.id === id) || null;
      },
      getMany: async (parentId: string): Promise<Page[]> => {
        const pages = getStorage(PAGES_KEY);
        if (parentId === null) return pages; // Legacy support
        return pages.filter((p: any) => p.parent_id === parentId);
      },
      update: async (id: string, updates: any) => {
        const pages = getStorage(PAGES_KEY);
        const index = pages.findIndex((p: any) => p.id === id);
        if (index !== -1) {
          pages[index] = { ...pages[index], ...updates, updated_at: Date.now() };
          saveStorage(PAGES_KEY, pages);
        }
      },
      delete: async (id: string) => {
        let pages = getStorage(PAGES_KEY);
        pages = pages.filter((p: any) => p.id !== id);
        saveStorage(PAGES_KEY, pages);
      }
    },

    // --- VALUES ---
    value: {
      set: async (pageId: string, propertyId: string, value: any) => {
        const values = getStorage(PROP_VALUES_KEY);
        const index = values.findIndex((v: any) => v.pageId === pageId && v.propertyId === propertyId);
        if (index !== -1) {
          values[index].value = JSON.stringify(value);
        } else {
          values.push({
            id: uuidv4(),
            pageId,
            propertyId,
            value: JSON.stringify(value)
          });
        }
        saveStorage(PROP_VALUES_KEY, values);
      },
      get: async (pageId: string, propertyId: string) => {
        const values = getStorage(PROP_VALUES_KEY);
        const found = values.find((v: any) => v.pageId === pageId && v.propertyId === propertyId);
        return found ? JSON.parse(found.value) : null;
      },
      getPageMap: async (pageId: string) => {
        const values = getStorage(PROP_VALUES_KEY);
        const pageValues = values.filter((v: any) => v.pageId === pageId);
        return pageValues.reduce((acc: any, curr: any) => {
          acc[curr.propertyId] = JSON.parse(curr.value);
          return acc;
        }, {});
      }
    }
  };

  window.electronAPI = {
    ...dbApi,

    // --- LEGACY / ALIASES ---
    // Cast to any to avoid strict Page vs Document mismatches
    getDocuments: async () => dbApi.page.getMany(null as any) as any,
    getDocument: dbApi.page.get as any,
    createDocument: async (parentId?: string) => dbApi.page.create(parentId!, 'page') as any,
    updateDocumentContent: async (id: string, content: any) => dbApi.page.update(id, { content }),

    updateDocumentMetadata: dbApi.page.update,
    deleteDocument: dbApi.page.delete,

    createPage: async (parentId?: string) => dbApi.page.create(parentId!, 'page'),
    property: {
      add: dbApi.db.addProperty,
      update: dbApi.db.updateProperty,
      delete: dbApi.db.deleteProperty,
      setValue: dbApi.value.set
    }
  };
}