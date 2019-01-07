import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import Props from './Props.jsx';
import SortableComponent from './SortableComponent.jsx';
import styles from '../containers/RightContainerStyles';


class RightTabs extends Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const {
      classes,
      components,
      focusComponent,
      rightColumnOpen,
      setVisible,
      onExpansionPanelChange,
      setSelectableParents,
    } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <Tabs
          value={value}
          onChange={this.handleChange}
          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
        >
          <Tab
            disableRipple
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
            label="Hierarchy"
          />
          <Tab
            disableRipple
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
            label={
              focusComponent.props
                ? <Badge
                  className={classes.padding}
                  color='primary'
                  badgeContent={focusComponent.props.length}
                >
                  Props
                </Badge> : 'Props'
            }
          />
        </Tabs>
        {value === 0 && <SortableComponent
          components={components}
          setVisible={setVisible}
          setSelectableParents={setSelectableParents}
          onExpansionPanelChange={onExpansionPanelChange}
        />}
        {value === 1 && <Props
          rightColumnOpen={rightColumnOpen}
          focusComponent={focusComponent}
          components = {components}
        />
        }
      </div>
    );
  }
}

RightTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  components: PropTypes.array.isRequired,
  focusComponent: PropTypes.object.isRequired,
  rightColumnOpen: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  onExpansionPanelChange: PropTypes.func,
  setSelectableParents: PropTypes.func,
};

export default withStyles(styles)(RightTabs);
