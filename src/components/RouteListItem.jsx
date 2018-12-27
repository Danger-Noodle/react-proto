import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import InputLabel from '@material-ui/core/InputLabel';

const RouteListItem = ({
  componentTitle,
  pathName,
  routeCompId,
  deleteRoute,
  classes,
  routerCompId,
  color,
}) => (
  <div className={classes.root}>
    <ExpansionPanel className={classes.panel} expanded={false} elevation={4}>
      <ExpansionPanelSummary >
        <Grid container spacing={12} alignItems={'center'} justify={'space-between'}>
          <Grid item xs={9}>
            <Typography className = {classes.label}>Path: / {pathName}</Typography>
          </Grid>
          <Grid item xs={2}>
            <IconButton
              className={classes.button}
              onClick={() => {
                deleteRoute({
                  routeCompId,
                  routerCompId,
                });
              }}
              aria-label="Delete"
            >
              <DeleteIcon className={classes.light} />
            </IconButton>{' '}
          </Grid>
        </Grid>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography className = {classes.label}>Component: {componentTitle}</Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </div>
);

export default RouteListItem;
