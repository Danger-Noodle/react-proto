const getAllChildren = (components, childrenIds, unSelectable = []) => {
  if (!childrenIds || childrenIds.length < 1) return unSelectable;
  for (let i = 0; i < childrenIds.length; i += 1) {
    const component = components.find(({ id }) => id === childrenIds[i]);
    if (!unSelectable.includes(childrenIds[i])) {
      unSelectable.push(childrenIds[i]);
    }
    getAllChildren(components, component.childrenIds, unSelectable);
  }
  return unSelectable;
};

const getSelectableParents = ({ id, childrenIds, components }) => {
  const unSelectableParents = getAllChildren(components, childrenIds, [id]);
  return components
    .filter(comp => !unSelectableParents.includes(comp.id) && comp.visible)
    .map(({ id, title }) => ({ id, title }));
};

const setSelectableParents = components => components.map(
  comp => (
    {
      ...comp,
      selectableParents: getSelectableParents({
        id: comp.id,
        childrenIds: comp.childrenIds,
        components,
      }),
    }
  ),
);

// should grab all of the child elements and the childrens children etc
const refactorGetSelectableParents = (id, childrenIds, refactorComponents) => {
  // base case: if the childrenIds array is empty return the id of the object
  // let numId = parseInt(id)
  if (childrenIds.length <= 0) return id;

  let output = [];
  output.push(id);
  // otherwise for each element in childrenIds, call the function and add to output
  childrenIds.forEach((el) => {
    output = output.concat(refactorGetSelectableParents(el, refactorComponents[el].childrenIds, refactorComponents));
  });

  return output;
};

// gets all of the selectable parents for element, is very not efficient O(2^n) probably. needs further refactor
const refactorSetSelectableParents = (refactorComponents) => {
  const keys = Object.keys(refactorComponents);
  const output = {};
  keys.forEach((el) => {
    const filter = refactorGetSelectableParents(el, refactorComponents[el].childrenIds, refactorComponents);
    // filters out all keys that are either children or children of children etc.. (and also not the el)
    const selectableParents = keys.filter(key => ((filter.indexOf(parseInt(key)) < 0) && (key !== el)));
    const newComp = {
      ...refactorComponents[el],
      selectableParents,
    };
    output[el] = newComp;
  });
  console.log(output);
};

export default setSelectableParents;
