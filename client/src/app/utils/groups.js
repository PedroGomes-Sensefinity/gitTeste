const groupsUtil = {
    makeGroupLabel(group) {
        const parentParent = (group.parent_group_id !== 0) ? "../" : "";
        const parent = (group.parent_label !== "") ? `${group.parent_label}/` : "";
        return`${parentParent}${parent}${group.label}`;
    }
}

export default groupsUtil;