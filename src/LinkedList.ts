export class LLNode {
  public key: string;
  public next: LLNode;
  public prev: LLNode;

  constructor(key: string) {
    this.key = key;
    this.next = null;
    this.prev = null;
  }

  reset(): void {
    this.key = null;
    this.next = null;
    this.prev = null;
  }
}

export class LinkedList {
  private head: LLNode;
  private tail: LLNode;

  constructor() {
    this.head = null;
    this.tail = null;
  }

  public getHead(): LLNode {
    return this.head;
  }

  public getTail(): LLNode {
    return this.tail;
  }

  public search(key: string): LLNode {
    let current: LLNode = this.head;

    while (current !== null) {
      if (current.key === key) {
        return current;
      }
    }

    return null;
  }

  public insertAfter(currentNode: LLNode, insertionNode: LLNode): void {
    if (currentNode === this.tail) {
      return this.append(insertionNode);
    }

    insertionNode.next = currentNode.next;
    insertionNode.prev = currentNode;
    currentNode.next.prev = insertionNode;
    currentNode.next = insertionNode;
  }

  public insertBefore(currentNode: LLNode, insertionNode: LLNode): void {
    if (currentNode === this.head) {
      return this.prepend(insertionNode);
    }

    insertionNode.prev = currentNode.prev;
    insertionNode.next = currentNode;
    currentNode.prev.next = insertionNode;
  }

  public append(node: LLNode): void {
    this.tail.next = node;
    node.prev = this.tail;
    node.next = null;
    this.tail = node;
  }

  public prepend(node: LLNode): void {
    this.head.prev = node;
    node.next = this.head;
    node.prev = null;
    this.head = node;
  }
}