import { LLNode, LinkedList } from "./LinkedList";

type Executor<T> = (...args) => T
type ErrorHandler = (error: Error, output: any, ...params: any[]) => boolean;

export class Task<T> extends LLNode {
  public executor: Executor<T>;
  public errHandler?: ErrorHandler;
  public next: Task<any>;
  public prev: Task<any>;

  constructor(name: string, executor: Executor<T>, errorHandler: ErrorHandler) {
    super(name);
    this.executor = executor;
    this.errHandler = errorHandler;
  }

  execute(...params: any): any {
    return this.executor(...params);
  }
}

export class Pipeline {
  private workflow: LinkedList;

  constructor(...tasks: Array<Task<any>>) {
    this.workflow = new LinkedList();

    for (const task of tasks) {
      this.workflow.append(task);
    }
  }

  public before<T>(key: string, task: Task<T>): this {
    const node = this.workflow.search(key) as Task<any>;

    if(node) {
      this.workflow.insertBefore(node, task);
    }

    return this;
  }

  public after<T>(key: string, task: Task<T>): this {
    const node = this.workflow.search(key);

    if(node) {
      this.workflow.insertAfter(node, task);
    }

    return this;
  }

  replace<T>(key: string, task: Task<T>): this {
    const _task = this.workflow.search(key) as Task<T>;

    if(_task) {
      _task.key = task.key;
      _task.executor = task.executor;
      _task.errHandler = task.errHandler;
    }

    return this;
  }

  execute(...params: any[]): any {
    let task = this.workflow.getHead() as Task<any>;
    let acc = null;

    while (task !== null) {
      try {
        acc = task.execute(acc, ...params);
        task = task.next;
      } catch (error) {
        if(task.errHandler) {
          const stop = task.errHandler(error, acc, ...params);
        }
          throw error;
      }
    }

    return acc;
  }
}
