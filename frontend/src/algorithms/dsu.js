/**
 * Disjoint Set Union (DSU) / Union-Find with Path Compression and Union by Rank.
 */
export class DSU {
  constructor(elements = []) {
    this.parent = new Map();
    this.rank = new Map();
    this.count = 0;

    for (const elem of elements) {
      this.makeSet(elem);
    }
  }

  makeSet(elem) {
    if (!this.parent.has(elem)) {
      this.parent.set(elem, elem);
      this.rank.set(elem, 0);
      this.count++;
    }
  }

  find(elem) {
    if (!this.parent.has(elem)) {
      this.makeSet(elem);
      return elem;
    }
    if (this.parent.get(elem) !== elem) {
      this.parent.set(elem, this.find(this.parent.get(elem)));
    }
    return this.parent.get(elem);
  }

  union(elemA, elemB) {
    const rootA = this.find(elemA);
    const rootB = this.find(elemB);

    if (rootA === rootB) {
      return false;
    }

    const rankA = this.rank.get(rootA) || 0;
    const rankB = this.rank.get(rootB) || 0;

    if (rankA < rankB) {
      this.parent.set(rootA, rootB);
    } else if (rankA > rankB) {
      this.parent.set(rootB, rootA);
    } else {
      this.parent.set(rootB, rootA);
      this.rank.set(rootA, rankA + 1);
    }

    this.count--;
    return true;
  }

  isConnected(elemA, elemB) {
    return this.find(elemA) === this.find(elemB);
  }

  getComponentCount() {
    return this.count;
  }

  getComponents() {
    const groups = new Map();
    for (const elem of this.parent.keys()) {
      const root = this.find(elem);
      if (!groups.has(root)) {
        groups.set(root, []);
      }
      groups.get(root).push(elem);
    }
    return groups;
  }
}
