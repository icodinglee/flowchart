import {combineReducers} from 'redux';

export  function TreeMenu(state={},action) {
    let newState={};
    switch (action.type){
        case "ADDNOTES_BY_DRAGTRESS":
            newState=$.extend(true,{},state);
            newState.addnotesdata=action.data;
            return newState;
        default:return state
    }

}
export  function MultiSelect(state=[],action) {
    let newState={};
    switch (action.type){
        case "MULTI_SELECT_DATA1":
            newState=$.extend(true,{},state);
            newState.multiselectdata1=action.data;
            return newState;
        default:return state
    }
}

let rootReducer=combineReducers({
    MultiSelect,
    TreeMenu
});
export default rootReducer;
