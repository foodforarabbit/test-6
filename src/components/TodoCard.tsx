import React, { useState } from 'react';
import {
  compose,
  AnyAction,
  Dispatch,
} from 'redux';
import {
  makeStyles,
} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {
  Record,
  List,
} from 'immutable';
import {
  ITodo,
  CompletedTodoAction,
  AddSubTodoAction,
  SubTodoFactory,
  ISubTodo,
  DeleteTodoAction,
  CompleteSubTodoAction,
} from '../actions/default';
import {
  Checkbox,
  Typography,
  Button,
  TextField,
  Grid,
} from '@material-ui/core';
import {
  connect,
} from 'react-redux';
import {
  createStructuredSelector,
} from 'reselect';
import {
  makeSelectSubTodosForTodo,
} from '../selectors/default';

interface ITodoCardComponentProps {
  todo: Record<ITodo>;
}

interface ITodoCardProps extends ITodoCardComponentProps {
  dispatch: Dispatch<AnyAction>;
  todoId: number;
  complete: boolean;
  subtodos: List<Record<ISubTodo>>;
}

const useStyles = makeStyles({
  card: {
    margin: 4,
    maxWidth: 345,
  },
  completed: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  subtodoContainer: {
    paddingLeft: '1em',
  }
});

const TodoCard: React.FC<ITodoCardProps> = (props) => {
  const [textInput, setTextInput] = useState('');
  const classes = useStyles();
  const {
    todo,
    todoId,
    complete,
    subtodos,
    dispatch,
  } = props;
  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardContent>
          <Grid
            container={true}
          >
            <Grid
              container={true}
              item={true}
              alignItems='center'
              wrap='nowrap'
            >
              <Checkbox
                checked={complete}
                value={complete}
                onChange={() => {
                  dispatch(new CompletedTodoAction({ todo, complete }))
                }}
                inputProps={{
                  'aria-label': 'primary checkbox',
                }}
              />
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                classes={{
                  root: complete ? classes.completed : '',
                }}
              >
                {todo.get('title')}
              </Typography>
              {/* {subtodos} */}
            </Grid>
            <Grid
              container={true}
              item={true}
              direction='column'
              classes={{
                item: classes.subtodoContainer,
              }}
            >
              {
                subtodos.map((subtodo) => {
                  const subtodoId = subtodo.get('id');
                  const subComplete = subtodo.get('complete');
                  return <Grid
                    key={subtodoId}
                    container={true}
                    item={true}
                    alignItems='center'
                    wrap='nowrap'
                  >
                    <Checkbox
                      checked={subComplete}
                      value={subComplete}
                      onChange={() => {
                        dispatch(new CompleteSubTodoAction({ subtodo, complete: subComplete }))
                      }}
                      inputProps={{
                        'aria-label': 'primary checkbox',
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                      classes={{
                        root: subComplete ? classes.completed : '',
                      }}
                    >
                      {subtodo.get('title')}
                    </Typography>
                  </Grid>
                })
              }
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size="small" 
          color="primary" 
          //@ts-ignore   
          onClick={() => {
            dispatch(new DeleteTodoAction({ todo }));
          }}
        >
          Delete
        </Button>
        <TextField
          label='title'
          value={textInput}
          onChange={(e) => {
            setTextInput(e.target.value);
          }}
        />
        <Button 
          size="small" 
          color="primary" 
          onClick={
            () => {
              dispatch(new AddSubTodoAction({
                todoId,
                subTodo: SubTodoFactory({
                  title: textInput,
                })
              }));
              setTextInput('');
            }
          }
        >
          {"Add SubTodo"}
        </Button>
      </CardActions>
    </Card>
  );
}

const mapStateToProps = (state: any, ownProps: ITodoCardComponentProps) => {
  const {
    todo
  } = ownProps;
  const todoId = todo.get('id');
  const complete = todo.get('complete');
  return {
    todoId,
    complete,
    ...createStructuredSelector({
      subtodos: makeSelectSubTodosForTodo(todoId),
    })(state)
  }
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    dispatch,
  };
};

export default compose<React.ComponentClass<ITodoCardComponentProps>>(
  connect(mapStateToProps, mapDispatchToProps)
)(TodoCard);