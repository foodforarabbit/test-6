import React, { useState } from 'react';
import {
  compose,
  bindActionCreators,
  AnyAction,
  Dispatch,
} from 'redux';
import { IMatch } from '../../Interfaces';
import {
  getIn,
  Record,
  List,
} from 'immutable';
import { connect } from 'react-redux';
import {
  Grid,
  Typography,
  Button,
  TextField,
} from '@material-ui/core';
import {
  AddTodoAction,
  DeleteTodoAction,
  CompletedTodoAction,
  AddSubTodoAction,
  ITodo,
  ISubTodo,
  TodoFactory,
  IUser,
} from '../../actions/default';
import {
  makeSelectTodosForUser,
  makeSelectUser,
} from '../../selectors/default';
import { createStructuredSelector } from 'reselect';
import TodoCard from '../../components/TodoCard';

interface ITodoComponentProps {
  match: IMatch,
}

interface ITodoProps extends ITodoComponentProps {
  addTodo: (userId: number, todo: Record<ITodo>) => void;
  addTodoSubTodo: (todo: Record<ITodo>) => void;
  deleteTodo: (todoId: number) => void;
  completedTodo: (todo: Record<ITodo>, complete: boolean) => void;
  addSubTodo: (todoId: number, subTodo: Record<ISubTodo>) => void;
  userId: number;
  todoId: number;
  todosForUser: List<Record<ITodo>>;
  subTodoForTodo: List<Record<ISubTodo>>;
  user?: Record<IUser>;
}

const addTodo = (userId: number, todo: Record<ITodo>) => new AddTodoAction({ userId, todo });
const deleteTodo = (todo: Record<ITodo>) => new DeleteTodoAction({ todo });
const completedTodo = (todo: Record<ITodo>, complete: boolean) => new CompletedTodoAction({ todo, complete });
const addSubTodo = (todoId: number, subTodo: Record<ISubTodo>) => new AddSubTodoAction({ todoId, subTodo });

const Todo: React.FC<ITodoProps> = (props) => {
  const [textInput, setTextInput] = useState('');
  const {
    addTodo,
    userId,
    todosForUser,
    user
  } = props;

  console.log('TodoUser', props)
  if (user == null) {
    return (
      <Grid
        container={true}
        direction='column'
        wrap='nowrap'
      >
        <Grid
          item={true}
        >
          <Typography
            variant='h5'
          >
            INVALID USER
          </Typography>
        </Grid>
      </Grid>
    );
  }
  return (
    <Grid
      container={true}
      direction='column'
      wrap='nowrap'
    >
      <Grid
        item={true}
      >
        <Typography
          variant='h5'
        >
          TODOS FOR {user.get('name')}
        </Typography>
      </Grid>
      <Grid
        container={true}
        item={true}
        direction='column'
        wrap='nowrap'
      >
        <Grid
          item={true}
          container={true}
          alignItems='center'
        >
          <Grid
            item={true}
          >
            <TextField
              label='title'
              value={textInput}
              onChange={(e) => {
                setTextInput(e.target.value);
              }}
            />
          </Grid>
          <Grid
            item={true}
          >
            <Button
              variant='outlined'
              onClick={
                () => {
                  addTodo(
                    userId,
                    TodoFactory({
                      title: textInput,
                    }),
                  );
                  setTextInput('');
                }
              }
            >
              Input Todo
            </Button>
          </Grid>

        </Grid>
        <Grid
          container={true}
          item={true}
        >
          {
            todosForUser.map((todo, index) => {
              return <TodoCard todo={todo} key={index} />
            })
          }
        </Grid>
      </Grid>
    </Grid>
  );
}

const mapStateToProps = (state: any, props: ITodoComponentProps) => {
  const {
    match,
  } = props;
  const userId = parseInt(getIn(match, ['params', 'userId'], -1), 10); // from path / router
  return {
    userId,
    ...createStructuredSelector({
      todosForUser: makeSelectTodosForUser(userId),
      user: makeSelectUser(userId),
    })(state)
  }
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    ...bindActionCreators({ addTodo, deleteTodo, completedTodo, addSubTodo }, dispatch)
  };
};


export default compose<React.ComponentClass<ITodoComponentProps>>(
  connect(mapStateToProps, mapDispatchToProps)
)(Todo);