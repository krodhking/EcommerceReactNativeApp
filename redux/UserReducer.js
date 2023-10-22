import { createSlice } from "@reduxjs/toolkit";

export const UserSlice = createSlice({
  name: "user",
  initialState: {
    userPayload: null
  },
  reducers: {
    updateUser: (state, action) => {
      if(!action.payload) {
        console.log("User not logged in, not setting user");
        return;
      }
      console.log("Updating the user in User Reducer");
      state.userPayload = action.payload;
    },
  },
});

export const {updateUser} = UserSlice.actions;

export default UserSlice.reducer
