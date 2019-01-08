import React from 'react';
import SortableTree from 'react-sortable-tree';
import PropTypes from 'prop-types';
import 'react-sortable-tree/style.css';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import { Typography, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styles from './PropsStyle';

const SortableComponent = (props) => {
  const {
    components,
    setVisible,
    onExpansionPanelChange,
    setSelectableParents,
    classes,
  } = props;

  const rootComponents = components
    .filter(comp => comp.parentId.length === 0)
    .reverse();

  const toggleViewBtn = (rowInfo) => {
    setVisible(rowInfo.node.id);
    setSelectableParents();
  };

  const nodeClicked = (rowInfo) => {
    onExpansionPanelChange(rowInfo.node);
  };

  const generateNodeProps = (rowInfo) => {
    const rowProps = {
      buttons: [
        <InfoIcon
          key={rowInfo.node.id}
          className="row_color"
          onClick={() => nodeClicked(rowInfo)}
          style={{
            color: rowInfo.node.color,
          }}
        />,
      ],
    };
    if (rowInfo.node.route) {
      rowProps.buttons.push(
        rowInfo.node.visible ? (
          <VisibilityIcon
            key="1"
            style={{
              color: rowInfo.node.color,
            }}
            onClick={() => toggleViewBtn(rowInfo)}
          />
        ) : (
          <VisibilityOff
            key="1"
            style={{
              color: rowInfo.node.color,
            }}
            onClick={() => toggleViewBtn(rowInfo)}
          />
        ),
      );
    }
    return rowProps;
  };

  return (
    <div className="sortable-tree">
      <Paper className={classes.headLabel}>
        <Typography className={classes.headText}>Hierarchy</Typography>
      </Paper>
      <SortableTree
        treeData={rootComponents}
        canDrag={false}
        onChange={treeData => this.setState({ treeData })}
        generateNodeProps={generateNodeProps}
      />
    </div>
  );
};

export default withStyles(styles)(SortableComponent);

SortableComponent.propTypes = {
  components: PropTypes.array,
};
