const _ = require("lodash");

function diffAndExtract(oldSet, newSet, selectedSet, options) {
  const { targetLevel, compareKey } = options;
  const diffs = [];

  // 1. Extract function: filters newSet based on selectedSet's structure.
  function extract(sourceNode, selectionNode) {
    if (!sourceNode || !selectionNode) {
      return null;
    }

    const extractedNode = { ..._.omit(sourceNode, "children") };

    if (selectionNode.children) {
      const extractedChildren = [];
      if (sourceNode.children) {
        const sourceChildrenMap = new Map(
          sourceNode.children.map((c) => [c.title, c])
        );
        for (const selectionChild of selectionNode.children) {
          const sourceChild = sourceChildrenMap.get(selectionChild.title);
          if (sourceChild) {
            const extractedChild = extract(sourceChild, selectionChild);
            if (extractedChild) {
              extractedChildren.push(extractedChild);
            }
          }
        }
      }
      extractedNode.children = extractedChildren;
    }
    return extractedNode;
  }

  // 2. Diffing logic: traverse to the target level and compare children of oldSet vs newSet.
  function findAndDiff(oldNode, newNode, currentPath) {
    if (!oldNode || !newNode) {
      return;
    }

    // If this is the target parent, diff its children
    if (_.isEqual(currentPath, targetLevel)) {
      const oldChildrenMap = new Map(
        (oldNode.children || []).map((c) => [c.title, c])
      );
      const newChildrenMap = new Map(
        (newNode.children || []).map((c) => [c.title, c])
      );

      oldChildrenMap.forEach((oldChild, title) => {
        const childPath = [...currentPath, title];
        if (newChildrenMap.has(title)) {
          const newChild = newChildrenMap.get(title);
          const oldValue = _.get(oldChild, compareKey);
          const newValue = _.get(newChild, compareKey);
          if (!_.isEqual(oldValue, newValue)) {
            diffs.push({
              type: "modified",
              path: childPath,
              before: oldValue,
              after: newValue,
            });
          }
        } else {
          diffs.push({
            type: "deleted",
            path: childPath,
            before: _.omit(oldChild, "children"),
          });
        }
      });

      newChildrenMap.forEach((newChild, title) => {
        if (!oldChildrenMap.has(title)) {
          const childPath = [...currentPath, title];
          diffs.push({
            type: "added",
            path: childPath,
            after: _.omit(newChild, "children"),
          });
        }
      });
    }

    // Continue traversal
    const oldChildrenMap = new Map(
      (oldNode.children || []).map((c) => [c.title, c])
    );
    const newChildrenMap = new Map(
      (newNode.children || []).map((c) => [c.title, c])
    );

    const allChildTitles = _.union(
      [...oldChildrenMap.keys()],
      [...newChildrenMap.keys()]
    );

    for (const title of allChildTitles) {
      const oldChild = oldChildrenMap.get(title);
      const newChild = newChildrenMap.get(title);
      if (oldChild && newChild) {
        findAndDiff(oldChild, newChild, [...currentPath, title]);
      }
    }
  }

  const extracted = extract(newSet, selectedSet);
  findAndDiff(oldSet, newSet, [oldSet.title]);

  return { diff: diffs, extracted };
}

module.exports = {
  diffAndExtract,
};
