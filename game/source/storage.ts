import { decode, type Save } from './domain';
export class Store {
  private db?: IDBDatabase;
  async open() {
    this.db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('werk-phase1', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('state');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(Error('Speicher durch anderen Tab blockiert'));
    });
    this.db.onversionchange = () => this.db?.close();
    const value = await this.request('readonly', store => store.get('current'));
    if (value === undefined) return null;
    const decoded = decode(value);
    // Preserve the complete old payload before any new-game write can replace it.
    if (typeof value === 'object' && value && 'version' in value && value.version !== 3) {
      await this.request('readwrite', store => store.put(value, 'backup-before-2b'));
    }
    return decoded;
  }
  private request(mode: IDBTransactionMode, operation: (s: IDBObjectStore) => IDBRequest): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(Error('Speicher nicht verfügbar'));
      const tx = this.db.transaction('state', mode);
      const request = operation(tx.objectStore('state'));
      tx.oncomplete = () => resolve(request.result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error ?? Error('Speichervorgang abgebrochen'));
    });
  }
  async save(value: Save) { await this.request('readwrite', s => s.put(decode(value), 'current')); }
  async raw() { return this.request('readonly', s => s.get('current')); }
  async backup() { return this.request('readonly', s => s.get('backup-before-2b')); }
  async clear() { await this.request('readwrite', s => s.delete('current')); }
}
