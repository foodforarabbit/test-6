import {
  delay,
  takeEvery,
  call,
  put,
} from 'redux-saga/effects';
import {
  DefaultActionTypes,
  AddTodoAction,
  TodoFactory,
  AddSubTodoAction,
  SubTodoFactory,
} from '../actions/default';
import request from '../utils';

export default function* defaultSaga() {
  yield takeEvery(DefaultActionTypes.ADD_TODO, addTodo);
  yield takeEvery(DefaultActionTypes.ADD_SUB_TODO, addSubTodo);
  while (true) {
    console.debug('saga running');
    yield delay(10000);
  }
}



function* addTodo(
  action: AddTodoAction,
) {
  const {
    payload,
  } = action;
  const {
    userId,
    todo,
  } = payload;

  if (todo.get('title') !== '') {
    console.debug('add todo normally');
    return;
  }
  const response: {
    quote: string;
  } = yield call(request,
    'https://api.kanye.rest',
    {
      // mode: 'no-cors',
    }
  );
  if (response != null) {
    const {
      quote,
    } = response;

    yield put(new AddTodoAction({
      userId,
      todo: TodoFactory({
        title: quote,
      })
    }))
  }
}

function* addSubTodo(
  action: AddSubTodoAction,
) {
  const {
    payload,
  } = action;
  const {
    todoId,
    subTodo,
  } = payload;

  if (subTodo.get('title') !== '') {
    console.debug('add todo normally');
    return;
  }
  const response: {
    quote: string;
  } = yield call(request,
    'https://api.kanye.rest',
    {
      // mode: 'no-cors',
    }
  );
  if (response != null) {
    const {
      quote,
    } = response;

    yield put(new AddSubTodoAction({
      todoId,
      subTodo: SubTodoFactory({
        title: quote,
      })
    }))
  }
}