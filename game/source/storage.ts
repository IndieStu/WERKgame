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
    return value === undefined ? null : decode(value);
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
  async clear() { await this.request('readwrite', s => s.delete('current')); }
}
