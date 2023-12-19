import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    user:null,
};

const profileSlice = createSlice({
    name:"profile",
    initialState: initialState,
    reducers:{
        setToken(state,value){
            state.token = value.payload;
        },
    },
});


export const {setToken} = profileSlice.actions;
export default profileSlice.reducer;