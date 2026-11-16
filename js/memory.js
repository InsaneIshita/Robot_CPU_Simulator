// ==========================================
// Robot CPU Simulator - Memory Subsystem
// ==========================================

class Memory {
    constructor() {
        // 25 data memory cells corresponding to grid addresses 00 - 24
        this.data = new Array(25).fill(null);
        this.lastAccessedAddress = null;
        this.lastAccessType = null; // 'read' or 'write'
        this.activeTab = 'data'; // 'data' or 'instructions'
    }

    reset() {
        this.data = new Array(25).fill(null);
        this.lastAccessedAddress = null;
        this.lastAccessType = null;
    }

    read(address) {
        const addr = parseInt(address, 10);
        if (isNaN(addr) || addr < 0 || addr >= 25) {
            return null;
        }
        this.lastAccessedAddress = addr;
        this.lastAccessType = 'read';
        return this.data[addr] !== null ? this.data[addr] : 0;
    }

    write(address, value) {
        const addr = parseInt(address, 10);
        if (isNaN(addr) || addr < 0 || addr >= 25) {
            return false;
        }
        const val = parseInt(value, 10);
        this.data[addr] = isNaN(val) ? 0 : val;
        this.lastAccessedAddress = addr;
        this.lastAccessType = 'write';
        return true;
    }

    formatAddress(addr) {
        return String(addr).padStart(2, '0');
    }

    formatValue(val) {
        return val !== null && val !== undefined ? String(val) : '-';
    }

    setTab(tab) {
        this.activeTab = tab;
    }
}

window.cpuMemory = new Memory();

