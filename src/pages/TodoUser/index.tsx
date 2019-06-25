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
  Checkbox
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {
  AddTodoAction,
  DeleteTodoAction,
  CompletedTodoAction,
  AddSubTodoAction,
  ITodo,
  ISubTodo,
  TodoFactory,
  SubTodoFactory,
  IUser,
} from '../../actions/default';
import {
  makeSelectTodosForUser,
  makeSelectUser,
} from '../../selectors/default';
import { createStructuredSelector } from 'reselect';

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

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
  },
});

const Todo: React.FC<ITodoProps> = (props) => {
  const classes = useStyles();
  const [textInput, setTextInput] = useState('');
  const [toggleAddInput, setToggleAddInput] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState(-1);
  const {
    addTodo,
    deleteTodo,
    completedTodo,
    addSubTodo,
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
      { !toggleAddInput ?
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
      :  
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
                  addSubTodo(
                    currentTodoId,
                    SubTodoFactory({
                      title: textInput,
                      todoId: currentTodoId
                    }),
                  );
                  setTextInput('');
                }
              }
            >
              Input Sub Task
            </Button>
          </Grid>
          
        </Grid>}
        {
          todosForUser.map((todo, index) => {
            let complete = todo.get('complete')
            return (
              <Card className={classes.card} key={index}>
                <CardActionArea>
                <Checkbox
                  checked={complete}
                  value={complete}
                  onChange={() => completedTodo(todo, complete)}
                  inputProps={{
                    'aria-label': 'primary checkbox',
                  }}
                />
                  <CardContent>

                    <Typography variant="body2" color="textSecondary" component="p">
                    {todo.get('title')}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary" 
                    //@ts-ignore   
                    onClick={() => deleteTodo(todo)}
                  >
                    Delete
                  </Button>
                  <Button 
                    size="small" 
                    color="primary" 
                    onClick={() => {
                      setToggleAddInput(!toggleAddInput);
                      setCurrentTodoId(todo.get('id'));
                    }}
                  >
                    {!toggleAddInput ? "Add SubTodo" : "Add New Task" }
                  </Button>
                </CardActions>
              </Card>
            )
          })
        }
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