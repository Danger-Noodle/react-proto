import setSelectableParents from './setSelectableParents.util';
import setSelectableRoutes from './setSelectableRoutes.utils';
import getColor from './colors.util';

const initialComponentState = {
  id: null,
  stateful: false,
  router: false,
  routes: [],
  title: '',
  parentId: '',
  color: getColor(),
  draggable: true,
  childrenIds: [],
  selectableParents: [],
  selectableRoutes: [],
  expanded: true,
  nextPropId: 0,
  position: {
    x: 110,
    y: 120,
    width: 50,
    height: 50,
  },
  route: false,
  visible: true,
};

export const addComponent = (state, { title }) => {
  const strippedTitle = title
    .replace(/[a-z]+/gi, word => word[0].toUpperCase() + word.slice(1))
    .replace(/[-_\s0-9\W]+/gi, '');
  const newComponent = {
    ...initialComponentState,
    title: strippedTitle,
    id: state.nextId.toString(),
    color: getColor(),
  };

  const components = [...state.components, newComponent];

  // refactor
  const { refactorComponents } = state;
  refactorComponents[state.nextId] = newComponent;
  //---

  const totalComponents = state.totalComponents + 1;
  const nextId = state.nextId + 1;

  return {
    ...state,
    totalComponents,
    nextId,
    components,
    refactorComponents,
    focusComponent: newComponent,
  };
};

export const updateComponent = (
  state,
  {
    id,
    newParentId = null,
    color = null,
    stateful = null,
    props = null,
    router = null,
  },
) => {
  let component;
  const components = state.components.map((comp) => {
    if (comp.id === id) {
      component = { ...comp };
      if (newParentId === 'null') {
        component.parentId = '';
      } else if (newParentId) {
        component.parentId = newParentId;
      }
      if (props) {
        component.props = props;
        component.nextPropId += 1;
      }
      component.color = color || component.color;
      component.stateful = stateful === null ? component.stateful : stateful;
      component.router = router === null ? component.router : router;
      return component;
    }
    return comp;
  });

  return {
    ...state,
    components,
    focusComponent: component,
  };
};

// Delete component with the index for now, but will be adjusted to use id
export const deleteComponent = (state, { index, id }) => {
  const { focusComponent } = state;
  const components = [
    ...state.components.slice(0, index),
    ...state.components.slice(index + 1),
  ];

  const totalComponents = state.totalComponents - 1;

  // refactor
  const newRefactorComponents = { ...state.refactorComponents };
  delete newRefactorComponents[id];
  //----

  return {
    ...state,
    totalComponents,
    components,
    refactorComponents: newRefactorComponents,
    focusComponent: focusComponent.id === id ? {} : focusComponent,
  };
};

export const addChild = (state, { id, childId }) => {
  const components = state.components.map((component) => {
    if (component.id === id) {
      const { childrenIds } = component;
      return { ...component, childrenIds: [...childrenIds, childId] };
    }
    return component;
  });

  // refactor
  const componentId = id;
  const newRefactorComponents = { ...state.refactorComponents };
  if (componentId in newRefactorComponents) {
    const newChildrenIds = newRefactorComponents[componentId].childrenIds.slice();
    newChildrenIds.push(childId);
    newRefactorComponents[componentId].childrenIds = newChildrenIds;
  }
  //----

  return {
    ...state,
    components,
    refactorComponents: newRefactorComponents,
  };
};

export const deleteChild = (state, { parent, childId }) => {
  const components = state.components.map((component) => {
    if (component.id === parent.id) {
      // Find child with matching id and remove from children
      const childrenIds = component.childrenIds.filter(id => id !== childId);
      return { ...component, childrenIds };
    }
    return component;
  });

  // refactor
  const parentId = parent.id;
  const { refactorComponents } = state;
  const newRefactorComponents = { ...refactorComponents };
  const newChildrenIds = newRefactorComponents[parentId].childrenIds.filter(el => el !== childId);
  newRefactorComponents[parentId].childrenIds = newChildrenIds;
  //----


  return {
    ...state,
    components,
    refactorComponents: newRefactorComponents,
  };
};

/**
 * Moves component to the end of the components effectively giving it the highest z-index
 * @param {object} state - The current state of the application
 * @param {string} componentId - The id of the component that is to be moved
 */

export const moveToTop = (state, componentId) => {
  const components = state.components.concat();
  const index = components.findIndex(component => component.id === componentId);
  const removedComponent = components.splice(index, 1);
  components.push(removedComponent[0]);

  // refactor


  //----


  return {
    ...state,
    components,
  };
};

/**
 * Updates the current image path with the newly provided path
 * @param {object} state - The current state of the application
 * @param {string} imagePath - The new path for the updated image
 */

export const changeImagePath = (state, imagePath) => ({
  ...state,
  imagePath,
});

export const reassignParent = (state, { index, id, parent = {} }) => {
  // Get all childrenIds of the component to be deleted
  const { childrenIds } = state.components[index];
  const components = state.components.map((comp) => {
    // Give each child their previous parent's parent
    if (childrenIds.includes(comp.id)) {
      return { ...comp, parentId: parent.id || '' };
    }
    // Give the parent all children of it's to be deleted child
    if (parent.id === comp.id) {
      const prevChildrenIds = comp.childrenIds;
      return {
        ...comp,
        childrenIds: [...new Set(prevChildrenIds.concat(childrenIds))],
      };
    }
    return comp;
  });

  // refactor
  const componentId = id;
  const newRefactorComponents = { ...state.refactorComponents };
  const componentToDelete = newRefactorComponents[componentId];
  // loops through childrenIds array, gives each child the
  // parent's parent if possible
  componentToDelete.childrenIds.forEach((el) => {
    newRefactorComponents[el].parentId = componentToDelete.parentId;
  });
  if (componentToDelete.parentId !== '') {
    newRefactorComponents[componentToDelete.parentId].childrenIds = componentToDelete.childrenIds;
  }
  //-----

  return {
    ...state,
    components,
    refactorComponents: newRefactorComponents,
  };
};

// helper function for setSelectableP
const refactorGetSelectableParents = (id, childrenIds, refactorComponents) => {
  // base case: if the childrenIds array is empty return the id of the object
  if (childrenIds.length <= 0) return [id];

  let output = [];
  output.push(id);
  // otherwise for each element in childrenIds, call the function and add to output
  childrenIds.forEach((el) => {
    output = output.concat(refactorGetSelectableParents(el, refactorComponents[el].childrenIds, refactorComponents));
  });

  return output;
};

/* should eventually be refactored so that it is only called for an
 individual component when that individual component is rendered */
export const setSelectableP = (state) => {
  // refactor
  const { refactorComponents } = state;
  const keys = Object.keys(refactorComponents);
  const newRefactorComponents = {};
  // for each variable
  keys.forEach((el) => {
    // gets all children in el's lineage
    const filter = refactorGetSelectableParents(el, refactorComponents[el].childrenIds, refactorComponents);
    // filters out all keys that exist in lineage (and also the el)
    const selectableParents = keys.filter(key => ((filter.indexOf(key) < 0) && (key !== el)));
    // adds to new object
    newRefactorComponents[el] = {
      ...refactorComponents[el],
      selectableParents,
    };
  });
  //-----

  return {
    ...state,
    components: setSelectableParents(state.components),
    refactorComponents: newRefactorComponents,
  };
};

export const setSelectableR = (state, id) => {
  // refactor
  const refactorComponents = { ...state.refactorComponents };
  const compToChange = refactorComponents[id];
  // displays component as possible route if the element in the array is present in the childrenIds but not in the routes
  const compsToAdd = compToChange.childrenIds.filter(el => compToChange.routes.indexOf(el) < 0);

  // this is necessary to interact with legacy code. creates an object --
  const newSelectableRoutes = compsToAdd.map(el => ({
    id: el,
    title: refactorComponents[el].title,
  }));
  //--

  refactorComponents[id].selectableRoutes = newSelectableRoutes;
  //-----

  return {
    ...state,
    components: setSelectableRoutes(state.components, id),
    refactorComponents,
  };
};

export const addRoute = (state, { path, routerCompId, routeCompId }) => {
  // refactor
  const refactorComponents = { ...state.refactorComponents };

  refactorComponents[routerCompId].routes.push({
    path,
    routeCompId,
    title: refactorComponents[routeCompId].title,
  });
  //-----

  return {
    ...state,
    components: state.components.map((comp) => {
      if (comp.id === routerCompId) {
      // crete new route object
        const newRoute = { path, routeCompId };
        // build the new Route Object from the selectable Routes info
        comp.selectableRoutes.forEach((route) => {
          if (route.id === routeCompId) {
            newRoute.routeCompTitle = route.title;
          }
        });
        comp.routes = [...comp.routes, newRoute];
        return { ...comp };
      }
      if (comp.id === routeCompId) return { ...comp, route: true };
      return comp;
    }),
    refactorComponents,
  };
};

export const deleteRoute = (state, { routerCompId, routeCompId }) => {
  // refactor
  const refactorComponents = { ...state.refactorComponents };
  const compToChange = refactorComponents[routerCompId];
  // takes routeCompId out from the component
  refactorComponents[routerCompId].routes = compToChange.filter(el => el.routeCompId === routeCompId);
  //-----


  return {
    ...state,
    components: state.components.map((comp) => {
      if (comp.id === routerCompId) {
        const routes = [...comp.routes];
        let indexOfRouteToDelete;
        routes.forEach((route, i) => {
          if (route.routeCompId === routeCompId) indexOfRouteToDelete = i;
        });
        routes.splice(indexOfRouteToDelete, 1);
        // comp.routes = routes;
        return { ...comp, routes };
      }
      if (comp.id === routeCompId) {
        if (!comp.visible) setVisible(state, comp.id);
        return { ...comp, route: false, visible: true };
      }
      return comp;
    }),
    refactorComponents,
  };
};

export const exportFilesSuccess = (state, { status, dir }) => ({
  ...state,
  successOpen: status,
  appDir: dir,
  loading: false,
});

export const exportFilesError = (state, { status, err }) => ({
  ...state,
  errorOpen: status,
  appDir: err,
  loading: false,
});

export const handleClose = (state, status) => ({
  ...state,
  errorOpen: status,
  successOpen: status,
});

export const updatePosition = (state, { id, x, y }) => {
  const components = state.components.map((component) => {
    if (component.id === id) {
      return {
        ...component,
        position: {
          x,
          y,
          width: component.position.width,
          height: component.position.height,
        },
      };
    }
    return component;
  });

  // refactor
  const refactorComponents = { ...state.refactorComponents };
  refactorComponents[id] = {
    ...refactorComponents[id],
    position: {
      x,
      y,
      width: refactorComponents[id].position.width,
      height: refactorComponents[id].position.height,
    },
  };
  //-----


  return {
    ...state,
    components,
    refactorComponents,
  };
};

/**
 * Applies the new x and y coordinates, as well as, the new width
 * and height the of components to the component with the provided id.
 * The transformation is calculated on component drags, as well as, whe the
 * component is resized
 * @param {object} state - The current state of the application
 * @param {object} transform - Object containing new transformation
 * @param {string} id - id of the component we want to apply the transformation to
 * @param {number} x - updated x coordinate
 * @param {number} y - updated y coordinate
 * @param {number} width - updated width
 * @param {number} height - updated height
 */

export const handleTransform = (state, {
  id, x, y, width, height,
}) => {
  const components = state.components.map((component) => {
    if (component.id === id) {
      return {
        ...component,
        position: {
          x,
          y,
          width,
          height,
        },
      };
    }
    return component;
  });
  return {
    ...state,
    components,
  };
};

/**
 * Toggles the drag of the group, as well as all components. If the group is draggable the
 * rectangles need to be undraggable so the user can drag the group from anywhere
 * @param {object} state - The current state of the application
 * @param {boolean} status - The boolean value to apply to all draggable components
 */

export const toggleDragging = (state, status) => {
  const components = state.components.map(component => ({
    ...component,
    draggable: status,
  }));
  return {
    ...state,
    components,
  };
};

/**
 * Moves component to the front of the components effectively giving it the lowest z-index
 * @param {object} state - The current state of the application
 * @param {string} componentId - The id of the component that is to be moved
 */

export const moveToBottom = (state, componentId) => {
  const components = state.components.concat();
  const index = components.findIndex(component => component.id === componentId);
  const removedComponent = components.splice(index, 1);
  components.unshift(removedComponent[0]);

  return {
    ...state,
    components,
  };
};

/**
 * Selects a component and sets it as the focusComponent. The focus component is used to
 * sync up expanding the panel, adding the transformer, and showing the components
 * corresponding props.
 * @param {object} state - The current state of the application
 * @param {object} component - The component we want to assign as the currently focused component
 */

export const openExpansionPanel = (state, { component }) => ({
  ...state,
  focusComponent: component,
});

// done
export const addProp = (state, {
  key, value = null, required, type, origin,
}) => {
  const { compProps, nextPropId } = state;
  const newProp = {
    id: nextPropId,
    key,
    value: value || key,
    required,
    type,
    origin,
    availableAt: [],
    displayedAt: [],
  };
  compProps.push(newProp);
  return ({
    ...state,
    compProps,
    nextPropId: nextPropId + 1,
  });
};

export const deleteProp = (state, { propId }) => {
  const { compProps } = state;
  const newCompProps = compProps.filter(el => el.id !== propId);

  return ({
    ...state,
    compProps: newCompProps,
  });
};

export const addPropToDisplayed = (state, { propId, compId }) => {
  const { compProps } = state;
  const newCompProps = compProps.map((el) => {
    if (el.id === propId) {
      el.displayedAt.push(compId);
    }
    return el;
  });

  return ({
    ...state,
    compProps: newCompProps,
  });
};

export const removePropFromDisplayed = (state, { propId, compId }) => {
  const { compProps } = state;
  const newCompProps = compProps.map((el) => {
    if (el.id === propId) {
      el.displayedAt.splice(el.displayedAt.indexOf(compId));
    }
    return el;
  });

  return ({
    ...state,
    compProps: newCompProps,
  });
};


export const setVisible = (state, compId) => ({
  ...state,
  components: state.components.map((comp) => {
    if (comp.parentId === compId) setVisible(state, comp.id);
    if (comp.id === compId) {
      // comp.visible = !comp.visible;
      return { ...comp, visible: !comp.visible };
    }
    return comp;
  }),
});
