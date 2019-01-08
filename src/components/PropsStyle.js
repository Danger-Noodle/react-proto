
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
    fontSize: '25px',
  },
  stateLabel: {
    backgroundColor: '#252526',
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
});
export default styles;

// main: '#33eb91',
// dark: '#14a37f'
