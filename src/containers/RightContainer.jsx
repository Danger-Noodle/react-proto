import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  handleClose,
  setVisible,
  openExpansionPanel,
  setSelectableParents,
} from '../actions/components';
import Snackbars from '../components/Snackbars.jsx';
import RightTabs from '../components/RightTabs.jsx';
import styles from './RightContainerStyles';
import SortableComponent from '../components/SortableComponent.jsx';
import Props from '../components/Props.jsx';

const IPC = require('electron').ipcRenderer;

const mapDispatchToProps = dispatch => ({
  handleNotificationClose: () => dispatch(handleClose()),
  setVisible: compId => dispatch(setVisible(compId)),
  openExpansionPanel: component => dispatch(openExpansionPanel(component)),
  setSelectableParents: () => dispatch(setSelectableParents()),
});

const mapStateToProps = store => ({
  successOpen: store.workspace.successOpen,
  errorOpen: store.workspace.errorOpen,
  appDir: store.workspace.appDir,
});

class RightContainer extends Component {
  state = {
    successOpen: false,
    errorOpen: false,
  };

  viewAppDir = () => {
    IPC.send('view_app_dir', this.props.appDir);
  };

  handleExpansionPanelChange = (component) => {
    const { focusComponent } = this.props;
    this.props.openExpansionPanel(
      focusComponent.id === component.id ? {} : component,
    );
  };

  render() {
    const {
      components,
      successOpen,
      errorOpen,
      handleNotificationClose,
      appDir,
      focusComponent,
      rightColumnOpen,
      setVisible,
      setSelectableParents,
    } = this.props;

    return (
      <div className="column-right" style={{ width: `${this.props.width}%` }}>
        {/* <RightTabs
          components={components}
          focusComponent={focusComponent}
          rightColumnOpen={rightColumnOpen}
          setVisible={setVisible}
          onExpansionPanelChange={this.handleExpansionPanelChange}
          setSelectableParents={setSelectableParents}
        /> */}
        <Props
          rightColumnOpen={rightColumnOpen}
          focusComponent={focusComponent}
          components={components}
          styles={styles}
        />
        <SortableComponent
          components={components}
          setVisible={setVisible}
          setSelectableParents={setSelectableParents}
          openExpansionPanelChange={this.handleExpansionPanelChange}
          styles={styles}
        />

        <Snackbars
          successOpen={successOpen}
          errorOpen={errorOpen}
          handleNotificationClose={handleNotificationClose}
          msg={appDir}
          viewAppDir={this.viewAppDir}
        />
      </div>
    );
  }
}

RightContainer.propTypes = {
  components: PropTypes.array.isRequired,
  successOpen: PropTypes.bool.isRequired,
  appDir: PropTypes.string,
  errorOpen: PropTypes.bool.isRequired,
  focusComponent: PropTypes.object.isRequired,
  handleNotificationClose: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  openExpansionPanel: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RightContainer);
