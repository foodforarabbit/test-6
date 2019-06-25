import {
  fromJS,
  Record,
  Map,
  List,
} from 'immutable';
import {
  IAction,
} from '../Interfaces';

import {
  DefaultActionTypes,
  ITodo,
  ISubTodo,
  AddTodoAction,
  AddSubTodoAction,
  DeleteTodoAction,
  CompletedTodoAction,
  IUser,
  AddUserAction,
  DeleteUserAction,
  UserFactory,
  TodoFactory,
  CompleteSubTodoAction
} from '../actions/default';


// import {
//   Settings,
// } from '../../models';

export interface IReducerState {
  lastUserId: number;
  lastTodoId: number;
  lastSubTodoId: number;
  users: Map<number, Record<IUser>>;
  todos: Map<number, Record<ITodo>>;
  subTodos: Map<number, Record<ISubTodo>>;
}

const initialUsers = [
  UserFactory({
    id: 1,
    name: 'Ryan',
  }),
  UserFactory({
    id: 2,
    name: 'Sandy',
  }),
  UserFactory({
    id: 3,
    name: 'Sean',
  }),
  UserFactory({
    id: 4,
    name: 'Peter',
  }),
]

const initialTodos = [
  TodoFactory({
    id: 1,
    userId: 1,
    title: 'Drink Water',
    complete: false,
  })
]
const INITIAL_STATE = fromJS({
  lastUserId: initialUsers.length,
  lastTodoId: initialTodos.length,
  lastSubTodoId: 0,
  users: Map<number, Record<IUser>>().withMutations((mutableMap) => {
    initialUsers.forEach((user) => {
      mutableMap.set(user.get('id'), user);
    })
  }),
  todos: Map<number, Record<ITodo>>().withMutations((mutableMap) => {
    initialTodos.forEach((todo) => {
      mutableMap.set(todo.get('id'), todo);
    })
  }),
});

export const reducer = (state: Record<IReducerState> = INITIAL_STATE, action: IAction) => {
  switch (action.type) {
    case DefaultActionTypes.ADD_USER: {
      const lastUserId = state.get('lastUserId');
      const {
        payload,
      } = action as AddUserAction;
      const {
        user,
      } = payload;

      if (user.get('name') === '') {
        // alert('name')
        return state;
      }

      const userId = lastUserId + 1;
      return state.withMutations((mutableState) => {
        mutableState.set('lastUserId', userId);
        mutableState.setIn(
          ['users', userId],
          user.set('id', userId),
        );
      })
    }

    case DefaultActionTypes.DELETE_USER: {
      const {
        payload,
      } = action as DeleteUserAction;
      const {
        userId,
      } = payload;

      return state.withMutations((map) => {
        console.log(map)
        map
          .removeIn(['users', userId])
          .removeIn(['todos', userId])
      });
    }

    case DefaultActionTypes.ADD_TODO: {
      const lastTodoId = state.get('lastTodoId');
      const {
       payload,
      } = action as AddTodoAction;
      const {
       userId,
       todo,
      } = payload;

      if (todo.get('title') === "") {
        // alert('title');
        return state;
      } 

      const todoId = lastTodoId + 1;
      return state.withMutations((mutableState) => {
        mutableState.set('lastTodoId', todoId);
        mutableState.setIn( 
          ['todos', todoId],
          todo.withMutations((mutableTodo) => {
            mutableTodo.set('id', todoId)
            mutableTodo.set('userId', userId)
          }),
        );
      });
    }

    case DefaultActionTypes.ADD_SUB_TODO: {
      const lastSubTodoId = state.get('lastSubTodoId');
      const {
       payload,
      } = action as AddSubTodoAction;
      const { 
       subTodo,
       todoId,
      } = payload;
      
      if (subTodo.get('title') === '') {
        // alert('no title')
        return state;
      }

      let subTodoId = lastSubTodoId + 1;
      return state.withMutations((mutableState) => {
        mutableState.set('lastSubTodoId', subTodoId);
        console.log('mutableState',mutableState)
        mutableState.setIn( 
          ['subTodos', subTodoId],
          subTodo.withMutations((mutableSubTodo: any) => {
            mutableSubTodo.set('todoId', todoId)
            mutableSubTodo.set('id', subTodoId)
            mutableSubTodo.set('subTodos', List(subTodo))
          }),     
        );
       });
    }

    case DefaultActionTypes.COMPLETE_TODO: {
      const {
        payload,
      } = action as CompletedTodoAction;
      const {
        todo,
        complete
      } = payload;
      let id = todo.get('id')
      return state.withMutations((mutableState) => {
        mutableState.setIn( 
        ['todos', id],
        todo.withMutations((mutableTodo) => {
          mutableTodo.set('complete', !complete)
        }),
      );
      })
    }

    case DefaultActionTypes.COMPLETE_SUBTODO: {
      const {
        payload,
      } = action as CompleteSubTodoAction;
      const {
        subtodo,
        complete
      } = payload;
      let id = subtodo.get('id')
      return state.withMutations((mutableState) => {
        mutableState.setIn( 
        ['subTodos', id],
        subtodo.withMutations((mutableSubTodo) => {
          mutableSubTodo.set('complete', !complete)
        }),
      );
      })
    }

    case DefaultActionTypes.DELETE_TODO: {
      const {
        payload,
      } = action as DeleteTodoAction;
      const {
        todo,
      } = payload;
      return state.withMutations((map) => {
        let id = todo.get('id')
        map
          .removeIn(['todos', id])
      });
    }

    default:
      return state;
  }
};

export default reducer;
