const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('CloudClinicDB', 1);

        request.onerror = (event) => {
            console.error('Error opening database:', event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('medicine')) {
                const objectStore = db.createObjectStore('medicine', { keyPath: 'medicineID' });
                // You can define indexes or other configurations for the object store here
            }
            if (!db.objectStoreNames.contains('diagnosis')) {
                const objectStore = db.createObjectStore('diagnosis', { keyPath: 'code' });
                // You can define indexes or other configurations for the object store here
            }
            if (!db.objectStoreNames.contains('labTestType')) {
                const objectStore = db.createObjectStore('labTestType', { keyPath: 'labTestTypeID' });
                // You can define indexes or other configurations for the object store here
            }
        };
    });
};

const addData = async (store, data) => {
    try {
        const db = await openDB();
        const transaction = db.transaction([store], 'readwrite');
        const objectStore = transaction.objectStore(store);

        data.forEach((item) => {
            objectStore.put(item);
        });
        console.log(`Data added to ${store} object store in IndexedDB successfully`);
    } catch (error) {
        console.error(`Error adding data to ${store} object store in IndexedDB:`, error);
    }
};

const getData = async (store) => {
    try {
        const db = await openDB();
        const transaction = db.transaction([store], 'readonly');
        const objectStore = transaction.objectStore(store);
        const request = objectStore.getAll();

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                const data = event.target.result;
                resolve(data);
                // Do something with the retrieved data
            };
        });
    } catch (error) {
        return { message: `Error ${error}` };
        console.error(`Error retrieving data from ${store} object store in IndexedDB:`, error);
    }
};

const deleteData = async () => {
    try {
        const db = await openDB();

        var request = db.deleteDatabase('CloudClinicDB');
        request.onsuccess = function () {
            console.log('Deleted database successfully');
        };
    } catch (error) {
        return { message: `Error ${error}` };
        console.error(`Error deleting data from ${store} object store in IndexedDB:`, error);
    }
};

export { addData, getData, deleteData };
