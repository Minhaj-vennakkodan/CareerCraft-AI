const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'CRAFT_DB.json');

// Initialize empty DB if not present
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({
    users: [],
    resumes: [],
    portfolios: [],
    analytics: [],
    subscriptions: [],
    system: { initialized: true }
  }, null, 2));
}

function readDb() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading Mock DB file:', err);
    return { users: [], resumes: [], portfolios: [], analytics: [], subscriptions: [] };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('Error writing Mock DB file:', err);
    return false;
  }
}

const mockDb = {
  find: (collection, query = {}) => {
    const db = readDb();
    const items = db[collection] || [];
    return items.filter(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  },

  findOne: (collection, query = {}) => {
    const db = readDb();
    const items = db[collection] || [];
    return items.find(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    }) || null;
  },

  insert: (collection, document) => {
    const db = readDb();
    if (!db[collection]) db[collection] = [];
    const newDoc = {
      _id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...document
    };
    db[collection].push(newDoc);
    writeDb(db);
    return newDoc;
  },

  update: (collection, query, updateData) => {
    const db = readDb();
    const items = db[collection] || [];
    let updatedCount = 0;
    const updatedItems = items.map(item => {
      let matches = true;
      for (let key in query) {
        if (item[key] !== query[key]) matches = false;
      }
      if (matches) {
        updatedCount++;
        return {
          ...item,
          ...updateData,
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });
    db[collection] = updatedItems;
    writeDb(db);
    return updatedCount;
  },

  delete: (collection, query) => {
    const db = readDb();
    const items = db[collection] || [];
    const initialLength = items.length;
    const remainingItems = items.filter(item => {
      let matches = true;
      for (let key in query) {
        if (item[key] !== query[key]) matches = false;
      }
      return !matches;
    });
    db[collection] = remainingItems;
    writeDb(db);
    return initialLength - remainingItems.length;
  }
};

module.exports = mockDb;
