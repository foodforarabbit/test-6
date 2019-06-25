import {
  IAction,
} from '../Interfaces';
import {
  Record,
} from 'immutable';

export default {};

export enum DefaultActionTypes {
  ADD_USER = 'ADD_USER',
  DELETE_USER = 'DELETE_USER',
  ADD_TODO = 'ADD_TODO',
  ADD_SUB_TODO = 'ADD_SUB_TODO',
  DELETE_TODO = 'DELETE_TODO',
  COMPLETE_TODO = 'COMPLETE_TODO',
  ADD_CAT_FACT = 'ADD_CAT_FACT',
}

export interface IUser {
  id: number;
  name: string;
}

export const UserFactory = Record<IUser>({
  id: -1,
  name: '',
});

export interface ITodo {
  id:  number;
  userId: number;
  title: string;
  complete: boolean;
}

export const TodoFactory = Record<ITodo>({
  id: -1,
  userId: -1,
  title: 'untitled',
  complete: false
});

export interface ISubTodo {
  id:  number;
  todoId:  number;
  title: string;
  complete: boolean;
}

export const SubTodoFactory = Record<ISubTodo>({
  id: -1,
  todoId: -1,
  title: 'untitled',
  complete: false,
});

export class AddUserAction implements IAction {
  public readonly type = DefaultActionTypes.ADD_USER;
  constructor(
    public payload: {
      user: Record<IUser>,
    }
  ) {}
}

export class DeleteUserAction implements IAction {
  public readonly type = DefaultActionTypes.DELETE_USER;
  constructor(
    public payload: {
      userId: number,
    }
  ) {}
}


export class AddTodoAction implements IAction {
  public readonly type = DefaultActionTypes.ADD_TODO;
  constructor(
    public payload: {
      userId: number,
      todo: Record<ITodo>,
    }
  ) {}
}

export class CompletedTodoAction implements IAction {
  public readonly type = DefaultActionTypes.COMPLETE_TODO;
  constructor(
    public payload: {
      todo: Record<ITodo>,
      complete: boolean
    }
  ) {}
}


export class DeleteTodoAction implements IAction {
  public readonly type = DefaultActionTypes.DELETE_TODO;
  constructor(
    public payload: {
      todo: Record<ITodo>,
    }
  ) {}
}

export class AddSubTodoAction implements IAction {
  public readonly type = DefaultActionTypes.ADD_SUB_TODO;
  constructor(
    public payload: {
      todoId: number,
      subTodo: Record<ISubTodo>,
    }
  ) {}
}

export class AddCatFactAction implements IAction {
  public readonly type = DefaultActionTypes.ADD_CAT_FACT;
  constructor(
    public payload: {
      userId: number,
      todo: Record<ITodo>,
    }
  ) {}
}