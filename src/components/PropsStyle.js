import { orange } from '@material-ui/core/colors';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit,
    color: '#eee',
    backgroundColor: '#3e3e41',
    elevation: '10',
  },
  column: {
    display: 'inline-flex',
    alignItems: 'baseline',
  },
  icon: {
    fontSize: '20px',
    color: '#eee',
    opacity: '0.7',
    transition: 'all .2s ease',

    '&:hover': {
      color: 'red',
    },
  },
  cssLabel: {
    color: 'white',

    '&$cssFocused': {
      color: 'green',
    },
  },
  cssFocused: {},
  input: {
    color: '#eee',
    marginBottom: '10px',
    width: '60%',
  },
  light: {
    color: '#eee',
  },
  headLabel: {
    backgroundColor: '#19191a',
    elevation: '10',
  },
  headText: {
    color: '#eee',
    fontSize: '20px',
    padding: '6px',
  },
  stateLabel: {
    backgroundColor: '#303030',
    margin: '5px',
    marginLeft: '20px',
    elevation: '20',
  },
  stateText: {
    color: '#eee',
    fontSize: '20px',
    padding: '5px',
    paddingLeft: '10px',
  },
  avatar: {
    color: '#eee',
    fontSize: '10px',
  },
  chips: {
    height: '20%',
    minHeight: '50px',
    maxHeight: '100px',
    overflowX: 'auto',
    marginLeft: '15px',
  },
  clickText: {
    marginTop: '20px',
    marginBottom: '10px',
    marginLeft: '5px',
    fontSize: '18px',
    color: '#a6a6a6',
  },
});
export default styles;

// main: '#33eb91',
// dark: '#14a37f'
