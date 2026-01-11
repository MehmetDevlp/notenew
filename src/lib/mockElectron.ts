import { v4 as uuidv4 } from 'uuid';

// Mock types
interface Page {
    id: string;
    title: string;
    content: any[];
    parentId: string | null;
    isDatabase: boolean;
    databaseId: string | null;
    createdAt: number;
    updatedAt: number;
    properties: any;
}

// Check if we are running in a browser environment (no electronAPI)
if (!window.electronAPI) {
  console.log('Running in browser mode - using localStorage mock');
  
  const PAGES_KEY = 'notion_clone_pages';
  const DB_PROPS_KEY = 'notion_clone_db_props';
  const PROP_VALUES_KEY = 'notion_clone_prop_values';
  
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

  window.electronAPI = {
    // --- PAGES ---
    getPages: async () => {
      return getStorage(PAGES_KEY);
    },
    
    getPage: async (id: string) => {
      const pages = getStorage(PAGES_KEY);
      return pages.find((p: any) => p.id === id);
    },
    
    createPage: async (parentId?: string) => {
      const pages = getStorage(PAGES_KEY);
      const newPage = {
        id: uuidv4(),
        title: 'Untitled',
        content: [],
        parentId: parentId || null,
        isDatabase: false,
        databaseId: null,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      pages.push(newPage);
      saveStorage(PAGES_KEY, pages);
      return newPage;
    },
    
    updatePage: async (id: string, updates: any) => {
      const pages = getStorage(PAGES_KEY);
      const index = pages.findIndex((p: any) => p.id === id);
      if (index !== -1) {
        pages[index] = { ...pages[index], ...updates, updatedAt: Date.now() };
        saveStorage(PAGES_KEY, pages);
      }
    },
    
    deletePage: async (id: string) => {
      let pages = getStorage(PAGES_KEY);
      pages = pages.filter((p: any) => p.id !== id); // Simple delete, no recursive for mock
      saveStorage(PAGES_KEY, pages);
    },

    // --- DATABASE PROPERTIES ---
    getDatabaseProperties: async (databaseId: string) => {
        const props = getStorage(DB_PROPS_KEY);
        return props.filter((p: any) => p.databaseId === databaseId);
    },

    createDatabaseProperty: async (databaseId: string, name: string, type: string, options?: any) => {
        const props = getStorage(DB_PROPS_KEY);
        const newProp = {
            id: uuidv4(),
            databaseId,
            name,
            type,
            options
        };
        props.push(newProp);
        saveStorage(DB_PROPS_KEY, props);
        return newProp;
    },

    // --- PROPERTY VALUES ---
    getPropertyValues: async (pageId: string) => {
        const values = getStorage(PROP_VALUES_KEY);
        // Join with properties logic omitted for mock simplicity
        return values.filter((v: any) => v.pageId === pageId);
    },

    setPropertyValue: async (pageId: string, propertyId: string, value: any) => {
        const values = getStorage(PROP_VALUES_KEY);
        const index = values.findIndex((v: any) => v.pageId === pageId && v.propertyId === propertyId);
        
        if (index !== -1) {
            values[index].value = value;
        } else {
            values.push({ id: uuidv4(), pageId, propertyId, value });
        }
        saveStorage(PROP_VALUES_KEY, values);
    }
  };
}
