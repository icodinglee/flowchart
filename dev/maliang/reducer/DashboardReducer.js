export default function DashboardReducer(state={},action) {
    let newState={};
    switch (action.type){
        case "SHOW_FORM":
            newState=$.extend(true,{},state);
            newState.data=action.data;

            return newState;
        default:return state
    }

}
