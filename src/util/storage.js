const storage = sessionStorage

export default {
    set(key, val) {
        storage.setItem(key, val)
            // localStorage.setItem(key, val)
    },
    get(key) {
        return storage.getItem(key)
            // return localStorage.getItem(key)
    },
    remove(key) {
        storage.removeItem(key)
            // localStorage.removeItem(key)
    }
}